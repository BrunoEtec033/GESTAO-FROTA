import { useState } from 'react'
import styles from '../styles/Veiculos.module.css'

export default function Veiculos() {
  // Lista de veículos - depois vai vir do banco
  const [veiculos, setVeiculos] = useState([])

  // Busca digitada pelo usuário
  const [busca, setBusca] = useState('')

  // Página atual da tabela
  const [pagina, setPagina] = useState(1)
  const porPagina = 15

  // Filtra os veículos pelo que foi digitado na busca
  const filtrados = veiculos.filter(v =>
    v.placa.toLowerCase().includes(busca.toLowerCase()) ||
    v.modelo.toLowerCase().includes(busca.toLowerCase())
  )

  // Pega só os veículos da página atual
  const totalPaginas = Math.ceil(filtrados.length / porPagina)
  const inicio = (pagina - 1) * porPagina
  const visiveis = filtrados.slice(inicio, inicio + porPagina)

  return (
    <div>
      <h1 className={styles.titulo}>Veículos</h1>

      {/* Barra de busca */}
      <input
        className={styles.busca}
        type="text"
        placeholder="Buscar por placa ou modelo..."
        value={busca}
        onChange={e => { setBusca(e.target.value); setPagina(1) }}
      />

      {/* Tabela de veículos */}
      <table className={styles.tabela}>
        <thead>
          <tr>
            <th>Placa</th>
            <th>Modelo</th>
            <th>Marca</th>
            <th>Ano</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {visiveis.length === 0 ? (
            <tr>
              <td colSpan="5" className={styles.vazio}>Nenhum veículo encontrado.</td>
            </tr>
          ) : (
            visiveis.map(v => (
              <tr key={v.id_veiculo}>
                <td>{v.placa}</td>
                <td>{v.modelo}</td>
                <td>{v.marca}</td>
                <td>{v.ano}</td>
                <td>{v.status_veiculo}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Paginação */}
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