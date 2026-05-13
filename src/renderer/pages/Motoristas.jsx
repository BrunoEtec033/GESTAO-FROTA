import { useState } from 'react'
import styles from '../styles/Motoristas.module.css'

export default function Motoristas() {
  // Lista de motoristas - depois vai vir do banco
  const [motoristas, setMotoristas] = useState([])

  // Texto digitado na busca
  const [busca, setBusca] = useState('')

  // Página atual
  const [pagina, setPagina] = useState(1)
  const porPagina = 15

  // Filtra pelo nome ou CNH digitado
  const filtrados = motoristas.filter(m =>
    m.nome.toLowerCase().includes(busca.toLowerCase()) ||
    m.cnh.toLowerCase().includes(busca.toLowerCase())
  )

  // Calcula quantas páginas existem
  const totalPaginas = Math.ceil(filtrados.length / porPagina)

  // Pega só os motoristas da página atual
  const inicio = (pagina - 1) * porPagina
  const visiveis = filtrados.slice(inicio, inicio + porPagina)

  return (
    <div>
      <h1 className={styles.titulo}>Motoristas</h1>

      {/* Campo de busca */}
      <input
        className={styles.busca}
        type="text"
        placeholder="Buscar por nome ou CNH..."
        value={busca}
        onChange={e => { setBusca(e.target.value); setPagina(1) }}
      />

      {/* Tabela de motoristas */}
      <table className={styles.tabela}>
        <thead>
          <tr>
            <th>Nome</th>
            <th>CNH</th>
            <th>Categoria</th>
            <th>Venc. CNH</th>
            <th>Telefone</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {visiveis.length === 0 ? (
            <tr>
              <td colSpan="6" className={styles.vazio}>Nenhum motorista encontrado.</td>
            </tr>
          ) : (
            visiveis.map(m => (
              <tr key={m.id_motorista}>
                <td>{m.nome}</td>
                <td>{m.cnh}</td>
                <td>{m.categoria_cnh}</td>
                <td>{m.vencimento_cnh}</td>
                <td>{m.telefone || '—'}</td>
                <td>{m.status_motorista}</td>
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