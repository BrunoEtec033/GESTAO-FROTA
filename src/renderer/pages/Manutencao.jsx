import { useState } from 'react'
import styles from '../styles/Manutencao.module.css'

export default function Manutencao() {
  // Lista de manutenções realizadas - depois vai vir do banco
  const [manutencoes, setManutencoes] = useState([])

  // Lista de manutenções preventivas - depois vai vir do banco
  const [preventivas, setPreventivas] = useState([])

  // Texto digitado na busca
  const [busca, setBusca] = useState('')

  // Controla qual aba está ativa: 'realizadas' ou 'preventivas'
  const [aba, setAba] = useState('realizadas')

  // Página atual
  const [pagina, setPagina] = useState(1)
  const porPagina = 15

  // Filtra manutenções realizadas pela descrição
  const filtradasRealizadas = manutencoes.filter(m =>
    m.descricao_servico.toLowerCase().includes(busca.toLowerCase())
  )

  // Filtra preventivas pelo tipo de serviço
  const filtradasPreventivas = preventivas.filter(p =>
    p.tipo_servico.toLowerCase().includes(busca.toLowerCase())
  )

  // Decide qual lista usar baseado na aba ativa
  const lista = aba === 'realizadas' ? filtradasRealizadas : filtradasPreventivas

  // Calcula paginação
  const totalPaginas = Math.ceil(lista.length / porPagina)
  const inicio = (pagina - 1) * porPagina
  const visiveis = lista.slice(inicio, inicio + porPagina)

  return (
    <div>
      <h1 className={styles.titulo}>Manutenção</h1>

      {/* Abas para alternar entre realizadas e preventivas */}
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

      {/* Campo de busca */}
      <input
        className={styles.busca}
        type="text"
        placeholder="Buscar por descrição..."
        value={busca}
        onChange={e => { setBusca(e.target.value); setPagina(1) }}
      />

      {/* Tabela de manutenções realizadas */}
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
              <tr>
                <td colSpan="6" className={styles.vazio}>Nenhuma manutenção encontrada.</td>
              </tr>
            ) : (
              visiveis.map(m => (
                <tr key={m.id_manutencao}>
                  <td>{m.id_veiculo}</td>
                  <td>
                    {/* Badge colorido pelo tipo */}
                    <span className={m.tipo_manutencao === 'Corretiva' ? styles.badgeCorretiva : styles.badgePreventiva}>
                      {m.tipo_manutencao}
                    </span>
                  </td>
                  <td>{m.data_manutencao}</td>
                  <td>{m.descricao_servico}</td>
                  <td>R$ {Number(m.custo).toFixed(2)}</td>
                  <td>{m.oficina || '—'}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}

      {/* Tabela de manutenções preventivas */}
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
              <tr>
                <td colSpan="5" className={styles.vazio}>Nenhuma preventiva encontrada.</td>
              </tr>
            ) : (
              visiveis.map(p => (
                <tr key={p.id_preventiva}>
                  <td>{p.id_veiculo}</td>
                  <td>{p.tipo_servico}</td>
                  <td>{p.data_prevista || '—'}</td>
                  <td>{p.quilometragem_prevista ? `${p.quilometragem_prevista} km` : '—'}</td>
                  <td>
                    {/* Badge colorido pelo status */}
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