import { useState } from 'react'
import Login      from './pages/Login'
import Layout     from './components/Layout'
import Dashboard  from './pages/Dashboard'
import Veiculos   from './pages/Veiculos'

export default function App() {
  const [pagina, setPagina]   = useState('login')
  const [usuario, setUsuario] = useState(null)

  function handleLogin(dadosUsuario) {
    setUsuario(dadosUsuario)
    setPagina('dashboard')
  }

  // Enquanto não estiver logado, mostra o login
  if (pagina === 'login') {
    return <Login onLogin={handleLogin} />
  }

  // Decide qual componente renderizar baseado na página selecionada
  function renderPagina() {
    if (pagina === 'dashboard') return <Dashboard usuario={usuario} />
    if (pagina === 'veiculos')  return <Veiculos />
    return <p style={{ color: '#555' }}>Em construção...</p>
  }

  return (
    <Layout usuario={usuario} paginaAtual={pagina} onNavegar={setPagina}>
      {renderPagina()}
    </Layout>
  )
}