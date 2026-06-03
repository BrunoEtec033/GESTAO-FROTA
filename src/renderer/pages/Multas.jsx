import { useState, useEffect } from 'react'
import styles from '../styles/Multas.module.css'

function formatarData(data) {
  if (!data) return '—'
  return new Date(data).toLocaleDateString('pt-BR')
}

export default function Multas({ usuario }) {
  const [multas, setMultas] = useState([])
  const [busca, setBusca]   = useState('')
  const [pagina, setPagina] = useState(1)

  useEffect(() => {
    async function carregar() {
      const resultado = await window.electronAPI.listarMultas(usuario.id_empresa)
      if (resultado.ok) setMultas(resultado.dados)
    }
    carregar()
  }, [])

  const porPagina = 15

  const filtrados = multas.filter(m =>
    m.tipo_multa.toLowerCase().includes(busca.toLowerCase())
  )

  const totalMultas   = filtrados.reduce((soma, m) => soma + Number(m.valor_multa), 0)
  const totalPendentes = filtrados.filter(m => m.situacao_multa === 'Pendente').length
  const totalPaginas  = Math.ceil(filtrados.length / porPagina)
  const inicio = (pagina - 1) * porPagina
  const visiveis = filtrados.slice(inicio, inicio + porPagina)

  return (
    <div>
      <h1 className={styles.titulo}>Multas</h1>

      <div className={styles.resumos}>
        <div className={styles.resumo}>
          <span className={styles.resumoLabel}>Total em multas</span>
          <strong className={styles.resumoValorRed}>R$ {totalMultas.toFixed(2)}</strong>
        </div>
        <div className={styles.resumo}>
          <span className={styles.resumoLabel}>Pendentes</span>
          <strong className={styles.resumoValorOrange}>{totalPendentes}</strong>
        </div>
      </div>

      <input
        className={styles.busca}
        type="text"
        placeholder="Buscar por tipo de multa..."
        value={busca}
        onChange={e => { setBusca(e.target.value); setPagina(1) }}
      />

      <table className={styles.tabela}>
        <thead>
          <tr>
            <th>Veículo</th>
            <th>Motorista</th>
            <th>Data</th>
            <th>Tipo</th>
            <th>Valor</th>
            <th>Situação</th>
          </tr>
        </thead>
        <tbody>
          {visiveis.length === 0 ? (
            <tr><td colSpan="6" className={styles.vazio}>Nenhuma multa encontrada.</td></tr>
          ) : (
            visiveis.map(m => (
              <tr key={m.id_multa}>
                <td>{m.id_veiculo || '—'}</td>
                <td>{m.id_motorista || '—'}</td>
                <td>{formatarData(m.data_infracao)}</td>
                <td>{m.tipo_multa}</td>
                <td>R$ {Number(m.valor_multa).toFixed(2)}</td>
                <td>
                  <span className={
                    m.situacao_multa === 'Paga'    ? styles.badgePaga    :
                    m.situacao_multa === 'Recurso' ? styles.badgeRecurso :
                    styles.badgePendente
                  }>
                    {m.situacao_multa}
                  </span>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

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