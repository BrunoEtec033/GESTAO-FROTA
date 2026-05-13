import { useState } from 'react'
import styles from '../styles/Abastecimento.module.css'

export default function Abastecimento() {
  // Lista de abastecimentos - depois vai vir do banco
  const [abastecimentos, setAbastecimentos] = useState([])

  // Texto digitado na busca
  const [busca, setBusca] = useState('')

  // Página atual
  const [pagina, setPagina] = useState(1)
  const porPagina = 15

  // Filtra pelo posto ou tipo de combustível
  const filtrados = abastecimentos.filter(a =>
    a.tipo_combustivel.toLowerCase().includes(busca.toLowerCase()) ||
    (a.posto_combustivel || '').toLowerCase().includes(busca.toLowerCase())
  )

  // Calcula paginação
  const totalPaginas = Math.ceil(filtrados.length / porPagina)
  const inicio = (pagina - 1) * porPagina
  const visiveis = filtrados.slice(inicio, inicio + porPagina)

  // Soma o valor total de todos os abastecimentos filtrados
  const totalGasto = filtrados.reduce((soma, a) => soma + Number(a.valor_total), 0)

  return (
    <div>
      <h1 className={styles.titulo}>Abastecimento</h1>

      {/* Card com total gasto no período filtrado */}
      <div className={styles.resumo}>
        <span className={styles.resumoLabel}>Total gasto</span>
        <strong className={styles.resumoValor}>
          R$ {totalGasto.toFixed(2)}
        </strong>
      </div>

      {/* Campo de busca */}
      <input
        className={styles.busca}
        type="text"
        placeholder="Buscar por combustível ou posto..."
        value={busca}
        onChange={e => { setBusca(e.target.value); setPagina(1) }}
      />

      {/* Tabela de abastecimentos */}
      <table className={styles.tabela}>
        <thead>
          <tr>
            <th>Veículo</th>
            <th>Motorista</th>
            <th>Data</th>
            <th>Combustível</th>
            <th>Litros</th>
            <th>R$/L</th>
            <th>Total</th>
            <th>Posto</th>
          </tr>
        </thead>
        <tbody>
          {visiveis.length === 0 ? (
            <tr>
              <td colSpan="8" className={styles.vazio}>Nenhum abastecimento encontrado.</td>
            </tr>
          ) : (
            visiveis.map(a => (
              <tr key={a.id_abastecimento}>
                <td>{a.id_veiculo}</td>
                <td>{a.id_motorista}</td>
                <td>{a.data_abastecimento}</td>
                <td>{a.tipo_combustivel}</td>
                <td>{Number(a.quantidade_litros).toFixed(1)} L</td>
                <td>R$ {Number(a.valor_litro).toFixed(2)}</td>
                <td>R$ {Number(a.valor_total).toFixed(2)}</td>
                <td>{a.posto_combustivel || '—'}</td>
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