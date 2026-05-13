import styles from '../styles/Layout.module.css'

// Lista de páginas do menu
const menu = [
  { id: 'dashboard',    label: 'Dashboard'     },
  { id: 'veiculos',     label: 'Veículos'      },
  { id: 'motoristas',   label: 'Motoristas'    },
  { id: 'viagens',      label: 'Viagens'       },
  { id: 'manutencao',   label: 'Manutenção'    },
  { id: 'abastecimento',label: 'Abastecimento' },
  { id: 'multas',       label: 'Multas'        },
]

export default function Layout({ usuario, paginaAtual, onNavegar, children }) {
  return (
    <div className={styles.app}>

      {/* Sidebar esquerda */}
      <aside className={styles.sidebar}>
        <div className={styles.logo}>
          Pega na <span>Frota</span>
        </div>

        {/* Itens do menu */}
        <nav className={styles.nav}>
          {menu.map(item => (
            <button
              key={item.id}
              className={`${styles.navItem} ${paginaAtual === item.id ? styles.ativo : ''}`}
              onClick={() => onNavegar(item.id)}
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* Usuário logado no rodapé da sidebar */}
        <div className={styles.usuario}>
          <div className={styles.avatar}>
            {/* Pega a primeira letra do nome */}
            {usuario?.nome?.charAt(0) || 'A'}
          </div>
          <div>
            <p className={styles.nomeUsuario}>{usuario?.nome || 'Administrador'}</p>
            <span className={styles.cargoUsuario}>{usuario?.nivel_acesso || 'Gestor'}</span>
          </div>
        </div>
      </aside>

      {/* Conteúdo da página selecionada */}
      <main className={styles.conteudo}>
        {children}
      </main>

    </div>
  )
}