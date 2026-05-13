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

    if (!login || !senha) {
      setErro('Preencha todos os campos.')
      return
    }

    setLoading(true)
    const resultado = await window.electronAPI.login(login, senha)
    setLoading(false)

    if (resultado.ok) {
      onLogin(resultado.usuario)
    } else {
      setErro(resultado.erro)
    }
  }

  return (
    <div className={styles.pagina}>
      <div className={styles.card}>
        <h1 className={styles.titulo}>Painel de Usuário</h1>
        <p className={styles.subtitulo}>Faça login para continuar</p>

        {erro && <p className={styles.erro}>{erro}</p>}

        <form onSubmit={handleSubmit}>
          <label className={styles.label}>Usuário</label>
          <input
            className={styles.input}
            type="text"
            placeholder="seu.usuario"
            value={login}
            onChange={e => setLogin(e.target.value)}
          />

          <label className={styles.label}>Senha</label>
          <input
            className={styles.input}
            type="password"
            placeholder="••••••••"
            value={senha}
            onChange={e => setSenha(e.target.value)}
          />

          <button className={styles.botao} type="submit" disabled={loading}>
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  )
}