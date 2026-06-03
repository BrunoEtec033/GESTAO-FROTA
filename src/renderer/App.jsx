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
    if (pagina === 'dashboard')     return <Dashboard     usuario={usuario} />
    if (pagina === 'veiculos')      return <Veiculos      usuario={usuario} />
    if (pagina === 'motoristas')    return <Motoristas    usuario={usuario} />
    if (pagina === 'viagens')       return <Viagens       usuario={usuario} />
    if (pagina === 'manutencao')    return <Manutencao    usuario={usuario} />
    if (pagina === 'abastecimento') return <Abastecimento usuario={usuario} />
    if (pagina === 'multas')        return <Multas        usuario={usuario} />
    return <p style={{ color: '#555' }}>Em construção...</p>
}

  return (
    <Layout usuario={usuario} paginaAtual={pagina} onNavegar={setPagina}>
      {renderPagina()}
    </Layout>
  )
}