import { useState } from 'react'
import styles from '../styles/Login.module.css'

export default function Login({ onLogin }) {
  const [login, setLogin] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro]   = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setErro('')
    if (!login.trim() || !senha) { setErro('Preencha usuário e senha.'); return }
    setLoading(true)
    try {
      const resultado = await window.electronAPI.login(login, senha)
      if (resultado.ok) onLogin(resultado.usuario)
      else setErro(resultado.erro)
    } catch {
      setErro('Não foi possível conectar.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.pagina}>

      <div className={styles.esquerda}>
        <svg viewBox="0 0 340 260" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">
          <rect width="340" height="260" fill="#060810"/>
          <circle cx="40" cy="20" r="1" fill="#fff" opacity="0.6"/>
          <circle cx="90" cy="35" r="1.5" fill="#fff" opacity="0.4"/>
          <circle cx="160" cy="15" r="1" fill="#fff" opacity="0.7"/>
          <circle cx="220" cy="28" r="1" fill="#fff" opacity="0.5"/>
          <circle cx="290" cy="10" r="1.5" fill="#fff" opacity="0.3"/>
          <circle cx="310" cy="40" r="1" fill="#fff" opacity="0.6"/>
          <circle cx="70" cy="55" r="0.8" fill="#fff" opacity="0.4"/>
          <circle cx="250" cy="50" r="1" fill="#fff" opacity="0.5"/>
          <rect x="0" y="140" width="340" height="120" fill="#08090f"/>
          <polygon points="100,140 240,140 320,260 20,260" fill="#0e0f16"/>
          <polygon points="160,140 180,140 220,260 190,260" fill="#1a1a28" opacity="0.6"/>
          <line x1="170" y1="145" x2="167" y2="165" stroke="#ff6a00" strokeWidth="2" strokeLinecap="round" opacity="0.8"/>
          <line x1="165" y1="175" x2="160" y2="200" stroke="#ff6a00" strokeWidth="2" strokeLinecap="round" opacity="0.6"/>
          <line x1="158" y1="210" x2="150" y2="240" stroke="#ff6a00" strokeWidth="2" strokeLinecap="round" opacity="0.4"/>
          <ellipse cx="130" cy="136" rx="18" ry="6" fill="#ff6a00" opacity="0.15"/>
          <ellipse cx="210" cy="136" rx="18" ry="6" fill="#ff6a00" opacity="0.15"/>
          <polygon points="118,130 142,130 180,260 60,260" fill="#ff6a00" opacity="0.04"/>
          <polygon points="198,130 222,130 280,260 160,260" fill="#ff6a00" opacity="0.04"/>
          <rect x="80" y="90" width="180" height="48" rx="4" fill="#0d0e15" stroke="#1a1b24" strokeWidth="1"/>
          <rect x="200" y="72" width="60" height="66" rx="3" fill="#0d0e15" stroke="#1a1b24" strokeWidth="1"/>
          <rect x="206" y="78" width="42" height="30" rx="2" fill="#0a0b12" stroke="#1e2030" strokeWidth="0.5"/>
          <rect x="252" y="100" rx="2" width="14" height="8" fill="#ff6a00" opacity="0.9"/>
          <rect x="252" y="112" rx="1" width="14" height="5" fill="#ff4400" opacity="0.6"/>
          <circle cx="110" cy="138" r="10" fill="#090a10" stroke="#1a1b24" strokeWidth="1"/>
          <circle cx="110" cy="138" r="5" fill="#0d0e15"/>
          <circle cx="230" cy="138" r="10" fill="#090a10" stroke="#1a1b24" strokeWidth="1"/>
          <circle cx="230" cy="138" r="5" fill="#0d0e15"/>
          <ellipse cx="170" cy="145" rx="80" ry="8" fill="#ff6a00" opacity="0.06"/>
        </svg>
      </div>

      <div className={styles.direita}>
        <p className={styles.tag}>// acesso ao sistema</p>
        <h1 className={styles.titulo}>Pega na <span>Frota</span></h1>

        {erro && <div className={styles.erro}>{erro}</div>}

        <form onSubmit={handleSubmit} noValidate>
          <label className={styles.label}>Usuário</label>
          <input
            className={styles.input}
            type="text"
            placeholder="seu.usuario"
            value={login}
            onChange={e => setLogin(e.target.value)}
            autoComplete="username"
          />

          <label className={styles.label}>Senha</label>
          <input
            className={styles.input}
            type="password"
            placeholder="••••••••"
            value={senha}
            onChange={e => setSenha(e.target.value)}
            autoComplete="current-password"
          />

          <button className={styles.botao} type="submit" disabled={loading}>
            {loading ? 'VERIFICANDO...' : 'ENTRAR'}
          </button>
        </form>
      </div>

    </div>
  )
}