import { useState, useEffect } from 'react'
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import styles from '../styles/Dashboard.module.css'

export default function Dashboard({ usuario }) {
  const [veiculos,       setVeiculos]       = useState([])
  const [viagens,        setViagens]        = useState([])
  const [abastecimentos, setAbastecimentos] = useState([])
  const [multas,         setMultas]         = useState([])
  const [motoristas,     setMotoristas]     = useState([])
  const [agora,          setAgora]          = useState(new Date())

  // Atualiza o relógio a cada segundo
  useEffect(() => {
    const intervalo = setInterval(() => setAgora(new Date()), 1000)
    return () => clearInterval(intervalo)
  }, [])

  useEffect(() => {
    async function carregar() {
      const [rv, rvi, ra, rm, rmo] = await Promise.all([
        window.electronAPI.listarVeiculos(usuario.id_empresa),
        window.electronAPI.listarViagens(usuario.id_empresa),
        window.electronAPI.listarAbastecimento(usuario.id_empresa),
        window.electronAPI.listarMultas(usuario.id_empresa),
        window.electronAPI.listarMotoristas(usuario.id_empresa),
      ])
      if (rv.ok)  setVeiculos(rv.dados)
      if (rvi.ok) setViagens(rvi.dados)
      if (ra.ok)  setAbastecimentos(ra.dados)
      if (rm.ok)  setMultas(rm.dados)
      if (rmo.ok) setMotoristas(rmo.dados)
    }
    carregar()
  }, [])

  // Pizza: status dos veículos
  const statusVeiculos = [
    { name: 'Disponível',    value: veiculos.filter(v => v.status_veiculo === 'Disponível').length,    cor: '#3a8a3a' },
    { name: 'Em viagem',     value: veiculos.filter(v => v.status_veiculo === 'Em viagem').length,     cor: '#ff6a00' },
    { name: 'Em manutenção', value: veiculos.filter(v => v.status_veiculo === 'Em manutenção').length, cor: '#aa3333' },
  ]

  // Barras: gasto de abastecimento por mês
  const gastosPorMes = abastecimentos.reduce((acc, a) => {
    const mes = new Date(a.data_abastecimento).toLocaleDateString('pt-BR', { month: 'short' })
    const existente = acc.find(x => x.mes === mes)
    if (existente) existente.total += Number(a.valor_total)
    else acc.push({ mes, total: Number(a.valor_total) })
    return acc
  }, [])

  // Totais
  const totalVeiculos      = veiculos.length
  const viagensAndamento   = viagens.filter(v => !v.data_retorno).length
  const totalAbastecimento = abastecimentos.reduce((s, a) => s + Number(a.valor_total), 0)
  const multasPendentes    = multas.filter(m => m.situacao_multa === 'Pendente').length
  const motoristasAtivos   = motoristas.filter(m => m.status_motorista === 'Ativo').length

  return (
    <div className={styles.page}>

      {/* Cabeçalho */}
      <div className={styles.header}>
        <div>
          <h1 className={styles.titulo}>Dashboard</h1>
          <p className={styles.subtitulo}>Visão geral da frota — {usuario.nome}</p>
        </div>
        <div className={styles.dataBadge}>
          {agora.toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' })}
          {' — '}
          {agora.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
        </div>
      </div>

      {/* Cards */}
      <div className={styles.cards}>
        <div className={styles.card}>
          <div className={styles.cardTopo}>
            <span className={styles.cardLabel}>Total de veículos</span>
            <span className={styles.cardIcone}>🚛</span>
          </div>
          <strong className={styles.cardValor}>{totalVeiculos}</strong>
          <span className={styles.cardSub}>frota ativa</span>
        </div>

        <div className={styles.card}>
          <div className={styles.cardTopo}>
            <span className={styles.cardLabel}>Em viagem</span>
            <span className={styles.cardIcone}>🛣️</span>
          </div>
          <strong className={styles.cardValor} style={{ color: '#ff6a00' }}>{viagensAndamento}</strong>
          <span className={styles.cardSub}>em andamento</span>
        </div>

        <div className={styles.card}>
          <div className={styles.cardTopo}>
            <span className={styles.cardLabel}>Motoristas ativos</span>
            <span className={styles.cardIcone}>👤</span>
          </div>
          <strong className={styles.cardValor} style={{ color: '#4a8aff' }}>{motoristasAtivos}</strong>
          <span className={styles.cardSub}>disponíveis</span>
        </div>

        <div className={styles.card}>
          <div className={styles.cardTopo}>
            <span className={styles.cardLabel}>Abastecimento</span>
            <span className={styles.cardIcone}>⛽</span>
          </div>
          <strong className={styles.cardValor} style={{ color: '#3a8a3a' }}>R$ {totalAbastecimento.toFixed(0)}</strong>
          <span className={styles.cardSub}>total gasto</span>
        </div>

        <div className={styles.card}>
          <div className={styles.cardTopo}>
            <span className={styles.cardLabel}>Multas pendentes</span>
            <span className={styles.cardIcone}>⚠️</span>
          </div>
          <strong className={styles.cardValor} style={{ color: '#aa3333' }}>{multasPendentes}</strong>
          <span className={styles.cardSub}>aguardando pagamento</span>
        </div>
      </div>

      {/* Gráficos */}
      <div className={styles.graficos}>

        {/* Pizza */}
        <div className={styles.graficoCard}>
          <h2 className={styles.graficoTitulo}>Status da frota</h2>
          {totalVeiculos === 0 ? (
            <p className={styles.vazio}>Nenhum veículo cadastrado.</p>
          ) : (
            <>
              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie data={statusVeiculos} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value">
                    {statusVeiculos.map((entry, i) => <Cell key={i} fill={entry.cor} />)}
                  </Pie>
                  <Tooltip
                    contentStyle={{ background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: 6, fontSize: 12 }}
                    itemStyle={{ color: '#ccc' }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className={styles.legenda}>
                {statusVeiculos.map((s, i) => (
                  <div key={i} className={styles.legendaItem}>
                    <div className={styles.legendaDot} style={{ background: s.cor }} />
                    <span>{s.name}</span>
                    <strong>{s.value}</strong>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Barras */}
        <div className={styles.graficoCard}>
          <h2 className={styles.graficoTitulo}>Gasto com abastecimento por mês</h2>
          {gastosPorMes.length === 0 ? (
            <p className={styles.vazio}>Nenhum abastecimento registrado.</p>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={gastosPorMes} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#ff6a00" />
                    <stop offset="100%" stopColor="#cc4400" />
                  </linearGradient>
                </defs>
                <XAxis dataKey="mes" stroke="#333" tick={{ fill: '#666', fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis stroke="#333" tick={{ fill: '#666', fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: 6, fontSize: 12 }}
                  itemStyle={{ color: '#ff6a00' }}
                  formatter={v => [`R$ ${v.toFixed(2)}`, 'Total']}
                  cursor={{ fill: '#ffffff08' }}
                />
                <Bar dataKey="total" fill="url(#barGradient)" radius={0} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

      </div>

      {/* Viagens em andamento */}
      <div className={styles.tabelaCard}>
        <h2 className={styles.graficoTitulo}>Viagens em andamento</h2>
        {viagensAndamento === 0 ? (
          <p className={styles.vazio}>Nenhuma viagem em andamento.</p>
        ) : (
          <table className={styles.tabela}>
            <thead>
              <tr>
                <th>Veículo</th>
                <th>Origem</th>
                <th>Destino</th>
                <th>Saída</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {viagens.filter(v => !v.data_retorno).map(v => (
                <tr key={v.id_viagem}>
                  <td>{v.id_veiculo}</td>
                  <td>{v.origem}</td>
                  <td>{v.destino}</td>
                  <td>{new Date(v.data_saida).toLocaleDateString('pt-BR')}</td>
                  <td><span className={styles.badgeAndamento}>Em andamento</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

    </div>
  )
}