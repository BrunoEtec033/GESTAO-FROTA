import { useState } from 'react'

export default function Login({ onLogin }) {
  const [login, setLogin]   = useState('')
  const [senha, setSenha]   = useState('')
  const [erro, setErro]     = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    setErro('')

    const resultado = await window.electronAPI.login(login, senha)

    if (resultado.ok) {
      onLogin(resultado.usuario)
    } else {
      setErro(resultado.erro)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h1>Login</h1>

      {erro && <p>{erro}</p>}

      <input
        type="text"
        placeholder="Usuário"
        value={login}
        onChange={e => setLogin(e.target.value)}
      />

      <input
        type="password"
        placeholder="Senha"
        value={senha}
        onChange={e => setSenha(e.target.value)}
      />

      <button type="submit">Entrar</button>
    </form>
  )
}