import { useState } from 'react'
import Login from './pages/Login'

export default function App() {
  const [pagina, setPagina] = useState('login')
  const [usuario, setUsuario] = useState(null)

  function handleLogin(dadosUsuario) {
    setUsuario(dadosUsuario)
    setPagina('dashboard')
  }

  if (pagina === 'login') return <Login onLogin={handleLogin} />

  return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:'100vh', background:'#0d0f0e', color:'#e8a020', fontFamily:'monospace', fontSize:18 }}>
      Bem-vindo, {usuario?.nome || 'operador'} 🚛
    </div>
  )
}