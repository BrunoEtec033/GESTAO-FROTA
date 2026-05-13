import { useState } from 'react'
import Login      from './pages/Login'
import Layout     from './components/Layout'
import Dashboard  from './pages/Dashboard'
import Veiculos   from './pages/Veiculos'
import Motoristas from './pages/Motoristas'
import Viagens from './pages/Viagens'
import Manutencao from './pages/Manutencao'
import Abastecimento from './pages/Abastecimento'
import Multas from './pages/Multas'

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
    if (pagina === 'motoristas') return <Motoristas />
    if (pagina === 'viagens') return <Viagens />
    if (pagina === 'manutencao') return <Manutencao />
    if (pagina === 'abastecimento') return <Abastecimento />
    if (pagina === 'multas') return <Multas />
    return <p style={{ color: '#555' }}>Em construção...</p>
    
  }

  return (
    <Layout usuario={usuario} paginaAtual={pagina} onNavegar={setPagina}>
      {renderPagina()}
    </Layout>
  )
}