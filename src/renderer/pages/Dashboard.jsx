import styles from '../styles/Dashboard.module.css'

export default function Dashboard({ usuario }) {
  return (
    <div>
      <h1 className={styles.titulo}>Dashboard</h1>
      <p className={styles.subtitulo}>Visão geral da frota</p>

      {/* Cards de resumo - por enquanto com dados fixos, depois conectamos ao banco */}
      <div className={styles.cards}>
        <div className={styles.card}>
          <span className={styles.cardLabel}>Total de veículos</span>
          <strong className={styles.cardValor}>0</strong>
        </div>
        <div className={styles.card}>
          <span className={styles.cardLabel}>Em viagem</span>
          <strong className={styles.cardValor}>0</strong>
        </div>
        <div className={styles.card}>
          <span className={styles.cardLabel}>Em manutenção</span>
          <strong className={styles.cardValor}>0</strong>
        </div>
        <div className={styles.card}>
          <span className={styles.cardLabel}>Docs vencendo</span>
          <strong className={styles.cardValor}>0</strong>
        </div>
      </div>
    </div>
  )
}