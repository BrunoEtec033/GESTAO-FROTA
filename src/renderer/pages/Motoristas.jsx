import { useState, useEffect } from 'react'
import styles from '../styles/Motoristas.module.css'

// Função que formata qualquer data do banco pra dd/mm/aaaa
function formatarData(data) {
  if (!data) return '—'
  return new Date(data).toLocaleDateString('pt-BR')
}

export default function Motoristas({ usuario }) {
  const [motoristas, setMotoristas] = useState([])
  const [busca, setBusca]           = useState('')
  const [pagina, setPagina]         = useState(1)

  useEffect(() => {
    async function carregar() {
      const resultado = await window.electronAPI.listarMotoristas(usuario.id_empresa)
      if (resultado.ok) setMotoristas(resultado.dados)
    }
    carregar()
  }, [])

  const porPagina = 15

  const filtrados = motoristas.filter(m =>
    m.nome.toLowerCase().includes(busca.toLowerCase()) ||
    m.cnh.toLowerCase().includes(busca.toLowerCase())
  )

  const totalPaginas = Math.ceil(filtrados.length / porPagina)
  const inicio = (pagina - 1) * porPagina
  const visiveis = filtrados.slice(inicio, inicio + porPagina)

  return (
    <div>
      <h1 className={styles.titulo}>Motoristas</h1>

      <input
        className={styles.busca}
        type="text"
        placeholder="Buscar por nome ou CNH..."
        value={busca}
        onChange={e => { setBusca(e.target.value); setPagina(1) }}
      />

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
                {/* Formata a data pra não quebrar o React */}
                <td>{formatarData(m.vencimento_cnh)}</td>
                <td>{m.telefone || '—'}</td>
                <td>
                  <span className={
                    m.status_motorista === 'Ativo'     ? styles.badgeAtivo  :
                    m.status_motorista === 'De férias' ? styles.badgeFerias :
                    styles.badgeAfastado
                  }>
                    {m.status_motorista}
                  </span>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

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