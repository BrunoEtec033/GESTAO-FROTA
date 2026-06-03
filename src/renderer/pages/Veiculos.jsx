import { useState, useEffect } from 'react'
import styles from '../styles/Veiculos.module.css'

export default function Veiculos({ usuario }) {
  const [veiculos, setVeiculos] = useState([])
  const [busca, setBusca]       = useState('')
  const [pagina, setPagina]     = useState(1)

  useEffect(() => {
    async function carregar() {
      // Passa o id_empresa pra filtrar só os veículos da empresa
      const resultado = await window.electronAPI.listarVeiculos(usuario.id_empresa)
      if (resultado.ok) setVeiculos(resultado.dados)
    }
    carregar()
  }, [])

  const porPagina = 15

  const filtrados = veiculos.filter(v =>
    v.placa.toLowerCase().includes(busca.toLowerCase()) ||
    v.modelo.toLowerCase().includes(busca.toLowerCase())
  )

  const totalPaginas = Math.ceil(filtrados.length / porPagina)
  const inicio = (pagina - 1) * porPagina
  const visiveis = filtrados.slice(inicio, inicio + porPagina)

  return (
    <div>
      <h1 className={styles.titulo}>Veículos</h1>

      <input
        className={styles.busca}
        type="text"
        placeholder="Buscar por placa ou modelo..."
        value={busca}
        onChange={e => { setBusca(e.target.value); setPagina(1) }}
      />

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
                <td>
                  <span className={
                    v.status_veiculo === 'Disponível'   ? styles.badgeDisponivel :
                    v.status_veiculo === 'Em viagem'    ? styles.badgeViagem     :
                    styles.badgeManutencao
                  }>
                    {v.status_veiculo}
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