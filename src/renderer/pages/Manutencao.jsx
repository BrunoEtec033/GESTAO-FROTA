import { useState, useEffect } from 'react'
import styles from '../styles/Manutencao.module.css'

function formatarData(data) {
  if (!data) return '—'
  return new Date(data).toLocaleDateString('pt-BR')
}

export default function Manutencao({ usuario }) {
  const [manutencoes, setManutencoes] = useState([])
  const [preventivas, setPreventivas] = useState([])
  const [busca, setBusca]             = useState('')
  const [aba, setAba]                 = useState('realizadas')
  const [pagina, setPagina]           = useState(1)

  useEffect(() => {
    async function carregar() {
      const r1 = await window.electronAPI.listarManutencao(usuario.id_empresa)
      const r2 = await window.electronAPI.listarPreventivas(usuario.id_empresa)
      if (r1.ok) setManutencoes(r1.dados)
      if (r2.ok) setPreventivas(r2.dados)
    }
    carregar()
  }, [])

  const porPagina = 15

  const filtradasRealizadas = manutencoes.filter(m =>
    m.descricao_servico.toLowerCase().includes(busca.toLowerCase())
  )

  const filtradasPreventivas = preventivas.filter(p =>
    p.tipo_servico.toLowerCase().includes(busca.toLowerCase())
  )

  const lista = aba === 'realizadas' ? filtradasRealizadas : filtradasPreventivas
  const totalPaginas = Math.ceil(lista.length / porPagina)
  const inicio = (pagina - 1) * porPagina
  const visiveis = lista.slice(inicio, inicio + porPagina)

  return (
    <div>
      <h1 className={styles.titulo}>Manutenção</h1>

      <div className={styles.abas}>
        <button
          className={aba === 'realizadas' ? styles.abaAtiva : styles.aba}
          onClick={() => { setAba('realizadas'); setPagina(1) }}
        >
          Realizadas
        </button>
        <button
          className={aba === 'preventivas' ? styles.abaAtiva : styles.aba}
          onClick={() => { setAba('preventivas'); setPagina(1) }}
        >
          Preventivas
        </button>
      </div>

      <input
        className={styles.busca}
        type="text"
        placeholder="Buscar por descrição..."
        value={busca}
        onChange={e => { setBusca(e.target.value); setPagina(1) }}
      />

      {aba === 'realizadas' && (
        <table className={styles.tabela}>
          <thead>
            <tr>
              <th>Veículo</th>
              <th>Tipo</th>
              <th>Data</th>
              <th>Descrição</th>
              <th>Custo</th>
              <th>Oficina</th>
            </tr>
          </thead>
          <tbody>
            {visiveis.length === 0 ? (
              <tr><td colSpan="6" className={styles.vazio}>Nenhuma manutenção encontrada.</td></tr>
            ) : (
              visiveis.map(m => (
                <tr key={m.id_manutencao}>
                  <td>{m.id_veiculo}</td>
                  <td>
                    <span className={m.tipo_manutencao === 'Corretiva' ? styles.badgeCorretiva : styles.badgePreventiva}>
                      {m.tipo_manutencao}
                    </span>
                  </td>
                  <td>{formatarData(m.data_manutencao)}</td>
                  <td>{m.descricao_servico}</td>
                  <td>R$ {Number(m.custo).toFixed(2)}</td>
                  <td>{m.oficina || '—'}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}

      {aba === 'preventivas' && (
        <table className={styles.tabela}>
          <thead>
            <tr>
              <th>Veículo</th>
              <th>Serviço</th>
              <th>Data Prevista</th>
              <th>KM Prevista</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {visiveis.length === 0 ? (
              <tr><td colSpan="5" className={styles.vazio}>Nenhuma preventiva encontrada.</td></tr>
            ) : (
              visiveis.map(p => (
                <tr key={p.id_preventiva}>
                  <td>{p.id_veiculo}</td>
                  <td>{p.tipo_servico}</td>
                  <td>{formatarData(p.data_prevista)}</td>
                  <td>{p.quilometragem_prevista ? `${p.quilometragem_prevista} km` : '—'}</td>
                  <td>
                    <span className={
                      p.status === 'Concluída' ? styles.badgeConcluida :
                      p.status === 'Atrasada'  ? styles.badgeAtrasada  :
                      styles.badgePendente
                    }>
                      {p.status}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}

      {totalPaginas > 1 && (
        <div className={styles.paginacao}>
          <button onClick={() => setPagina(p => p - 1)} disabled={pagina === 1}>Anterior</button>
          <span>{pagina} de {totalPaginas}</span>
          <button onClick={() => setPagina(p => p + 1)} disabled={pagina === totalPaginas}>Próximo</button>
        </div>
      )}
    </div>
  )
}