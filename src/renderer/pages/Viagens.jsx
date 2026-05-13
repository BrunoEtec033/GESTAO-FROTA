import { useState } from 'react'
import styles from '../styles/Viagens.module.css'

export default function Viagens() {
  // Lista de viagens - depois vai vir do banco
  const [viagens, setViagens] = useState([])

  // Texto digitado na busca
  const [busca, setBusca] = useState('')

  // Página atual
  const [pagina, setPagina] = useState(1)
  const porPagina = 15

  // Filtra pela origem ou destino digitado
  const filtrados = viagens.filter(v =>
    v.origem.toLowerCase().includes(busca.toLowerCase()) ||
    v.destino.toLowerCase().includes(busca.toLowerCase())
  )

  // Calcula quantas páginas existem
  const totalPaginas = Math.ceil(filtrados.length / porPagina)

  // Pega só as viagens da página atual
  const inicio = (pagina - 1) * porPagina
  const visiveis = filtrados.slice(inicio, inicio + porPagina)

  return (
    <div>
      <h1 className={styles.titulo}>Viagens</h1>

      {/* Campo de busca */}
      <input
        className={styles.busca}
        type="text"
        placeholder="Buscar por origem ou destino..."
        value={busca}
        onChange={e => { setBusca(e.target.value); setPagina(1) }}
      />

      {/* Tabela de viagens */}
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
                <td>{v.data_saida}</td>
                {/* Se não tiver retorno ainda, mostra "Em andamento" */}
                <td>{v.data_retorno || '—'}</td>
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

      {/* Paginação — só aparece se tiver mais de uma página */}
      {totalPaginas > 1 && (
        <div className={styles.paginacao}>
          <button onClick={() => setPagina(p => p - 1)} disabled={pagina === 1}>
            Anterior
          </button>
          <span>{pagina} de {totalPaginas}</span>
          <button onClick={() => setPagina(p => p + 1)} disabled={pagina === totalPaginas}>
            Próximo
          </button>
        </div>
      )}
    </div>
  )
}