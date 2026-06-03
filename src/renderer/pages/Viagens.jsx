import { useState, useEffect } from 'react'
import styles from '../styles/Viagens.module.css'

function formatarData(data) {
  if (!data) return '—'
  return new Date(data).toLocaleDateString('pt-BR')
}

export default function Viagens({ usuario }) {
  const [viagens, setViagens] = useState([])
  const [busca, setBusca]     = useState('')
  const [pagina, setPagina]   = useState(1)

  useEffect(() => {
    async function carregar() {
      const resultado = await window.electronAPI.listarViagens(usuario.id_empresa)
      if (resultado.ok) setViagens(resultado.dados)
    }
    carregar()
  }, [])

  const porPagina = 15

  const filtrados = viagens.filter(v =>
    v.origem.toLowerCase().includes(busca.toLowerCase()) ||
    v.destino.toLowerCase().includes(busca.toLowerCase())
  )

  const totalPaginas = Math.ceil(filtrados.length / porPagina)
  const inicio = (pagina - 1) * porPagina
  const visiveis = filtrados.slice(inicio, inicio + porPagina)

  return (
    <div>
      <h1 className={styles.titulo}>Viagens</h1>

      <input
        className={styles.busca}
        type="text"
        placeholder="Buscar por origem ou destino..."
        value={busca}
        onChange={e => { setBusca(e.target.value); setPagina(1) }}
      />

      <table className={styles.tabela}>
        <thead>
          <tr>
            <th>Veículo</th>
            <th>Motorista</th>
            <th>Origem</th>
            <th>Destino</th>
            <th>Saída</th>
            <th>Retorno</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {visiveis.length === 0 ? (
            <tr>
              <td colSpan="7" className={styles.vazio}>Nenhuma viagem encontrada.</td>
            </tr>
          ) : (
            visiveis.map(v => (
              <tr key={v.id_viagem}>
                <td>{v.id_veiculo}</td>
                <td>{v.id_motorista}</td>
                <td>{v.origem}</td>
                <td>{v.destino}</td>
                <td>{formatarData(v.data_saida)}</td>
                <td>{formatarData(v.data_retorno)}</td>
                <td>
                  <span className={v.data_retorno ? styles.badgeConcluida : styles.badgeAndamento}>
                    {v.data_retorno ? 'Concluída' : 'Em andamento'}
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