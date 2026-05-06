import { useState } from 'react'

export default function Login({ onLogin }) {
  const [usuario, setUsuario] = useState('')
  const [senha, setSenha]     = useState('')
  const [verSenha, setVerSenha] = useState(false)
  const [loading, setLoading]   = useState(false)
  const [erro, setErro]         = useState('')
  const [sucesso, setSucesso]   = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setErro('')
    if (!usuario.trim() || !senha) { setErro('Preencha usuário e senha.'); return }
    setLoading(true)
    try {
      const res = await window.electronAPI.login(usuario.trim(), senha)
      if (res.ok) { setSucesso(true); setTimeout(() => onLogin(res.usuario), 800) }
      else setErro(res.erro)
    } catch { setErro('Não foi possível conectar.') }
    finally { setLoading(false) }
  }

  return (
    <div style={s.layout}>
      {/* Painel esquerdo */}
      <div style={s.artwork}>
        <div style={s.grid} />
        <div style={s.fade} />
        <div style={s.stats}>
          {[['248','Veículos'],['91%','Em rota'],['3','Alertas']].map(([v,l]) => (
            <div key={l}>
              <div style={s.statVal}>{v}</div>
              <div style={s.statLabel}>{l}</div>
            </div>
          ))}
        </div>
        <div style={s.artworkLabel}>
          <p style={s.eyebrow}><span style={s.dot} /> Sistema ativo</p>
          <h1 style={s.h1}>Controle total<br />da sua <strong>frota</strong></h1>
          <p style={s.desc}>Monitoramento em tempo real, manutenção preventiva e gestão de rotas em um único lugar.</p>
        </div>
      </div>

      {/* Painel direito */}
      <div style={s.panel}>
        <div style={s.logo}>
          <div style={s.logoMark}>⬡</div>
          <span style={s.logoText}>Fleet<span style={{color:'#e8a020'}}>OS</span></span>
        </div>

        <div style={{marginBottom:'2rem'}}>
          <p style={s.tag}>// Autenticação</p>
          <h2 style={s.h2}>Bem-vindo de volta</h2>
        </div>

        {erro    && <div style={s.msgError}>{erro}</div>}
        {sucesso && <div style={s.msgSuccess}>Acesso autorizado. Redirecionando...</div>}

        <form onSubmit={handleSubmit} noValidate>
          <Field label="Usuário / E-mail">
            <input style={s.input} type="text" placeholder="operador@empresa.com.br"
              value={usuario} onChange={e => setUsuario(e.target.value)} autoComplete="username" />
          </Field>

          <Field label="Senha">
            <div style={{position:'relative'}}>
              <input style={s.input} type={verSenha ? 'text' : 'password'} placeholder="••••••••"
                value={senha} onChange={e => setSenha(e.target.value)} autoComplete="current-password" />
              <button type="button" onClick={() => setVerSenha(v => !v)}
                style={s.togglePass} aria-label="Mostrar senha">
                {verSenha ? '🙈' : '👁'}
              </button>
            </div>
          </Field>

          <div style={s.optRow}>
            <label style={{display:'flex',gap:8,alignItems:'center',fontSize:12,color:'#6b726e',cursor:'pointer'}}>
              <input type="checkbox" /> Manter conectado
            </label>
            <a href="#" style={{fontFamily:'var(--mono)',fontSize:11,color:'#a06a10'}}>Esqueci a senha</a>
          </div>

          <button type="submit" style={s.btn} disabled={loading}>
            {loading ? 'Verificando...' : 'Acessar sistema'}
          </button>
        </form>

        <div style={s.footer}>
          <span style={{fontSize:11,color:'#6b726e',fontFamily:'monospace'}}>© 2025 FleetOS</span>
          <span style={s.version}>v1.0.0</span>
        </div>
      </div>
    </div>
  )
}

function Field({ label, children }) {
  return (
    <div style={{marginBottom:'1.25rem'}}>
      <label style={{display:'block',fontFamily:'monospace',fontSize:10,letterSpacing:'0.16em',textTransform:'uppercase',color:'#6b726e',marginBottom:7}}>{label}</label>
      {children}
    </div>
  )
}

const s = {
  layout:    { display:'grid', gridTemplateColumns:'1fr 400px', height:'100vh' },
  artwork:   { position:'relative', overflow:'hidden', background:'#131614', borderRight:'1px solid #2a2e2b' },
  grid:      { position:'absolute', inset:0, backgroundImage:'linear-gradient(#2a2e2b 1px,transparent 1px),linear-gradient(90deg,#2a2e2b 1px,transparent 1px)', backgroundSize:'48px 48px', opacity:0.4 },
  fade:      { position:'absolute', inset:0, background:'radial-gradient(ellipse at 40% 50%,transparent 30%,#131614 80%)' },
  stats:     { position:'absolute', top:'2rem', left:'2.5rem', display:'flex', gap:'2rem' },
  statVal:   { fontFamily:'monospace', fontSize:20, fontWeight:500, color:'#e8a020' },
  statLabel: { fontSize:10, letterSpacing:'0.12em', textTransform:'uppercase', color:'#6b726e' },
  artworkLabel: { position:'absolute', bottom:'2.5rem', left:'2.5rem', right:'2.5rem' },
  eyebrow:   { fontFamily:'monospace', fontSize:10, letterSpacing:'0.2em', textTransform:'uppercase', color:'#e8a020', marginBottom:8 },
  dot:       { display:'inline-block', width:6, height:6, borderRadius:'50%', background:'#e8a020', marginRight:6, animation:'blink 2s infinite' },
  h1:        { fontSize:28, fontWeight:300, letterSpacing:'-0.02em', color:'#e8ebe9', lineHeight:1.2 },
  desc:      { marginTop:10, fontSize:13, color:'#6b726e', maxWidth:320 },
  panel:     { display:'flex', flexDirection:'column', justifyContent:'center', padding:'3rem 3.5rem', background:'#181b19' },
  logo:      { display:'flex', alignItems:'center', gap:10, marginBottom:'3rem' },
  logoMark:  { width:32, height:32, border:'1.5px solid #e8a020', display:'flex', alignItems:'center', justifyContent:'center', color:'#e8a020', fontSize:16 },
  logoText:  { fontFamily:'monospace', fontSize:15, fontWeight:500, color:'#fff', letterSpacing:'0.05em' },
  tag:       { fontFamily:'monospace', fontSize:10, letterSpacing:'0.18em', textTransform:'uppercase', color:'#a06a10', marginBottom:8 },
  h2:        { fontSize:22, fontWeight:400, color:'#e8ebe9', letterSpacing:'-0.02em' },
  input:     { width:'100%', padding:'0 14px', height:44, background:'#0d0f0e', border:'1px solid #2a2e2b', color:'#d4d8d5', fontFamily:'inherit', fontSize:14, transition:'border-color .15s' },
  togglePass:{ position:'absolute', right:12, top:'50%', transform:'translateY(-50%)', background:'none', border:'none', cursor:'pointer', fontSize:14 },
  optRow:    { display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'2rem' },
  btn:       { width:'100%', height:48, background:'#e8a020', color:'#0d0f0e', border:'none', fontFamily:'monospace', fontSize:13, fontWeight:500, letterSpacing:'0.12em', textTransform:'uppercase', cursor:'pointer' },
  msgError:  { padding:'10px 14px', marginBottom:'1.25rem', fontSize:12, fontFamily:'monospace', background:'#1a0c0c', border:'1px solid #4a1f1f', color:'#e07070' },
  msgSuccess:{ padding:'10px 14px', marginBottom:'1.25rem', fontSize:12, fontFamily:'monospace', background:'#0c1a10', border:'1px solid #1f4a28', color:'#60c080' },
  footer:    { marginTop:'2.5rem', paddingTop:'1.5rem', borderTop:'1px solid #2a2e2b', display:'flex', justifyContent:'space-between', alignItems:'center' },
  version:   { fontFamily:'monospace', fontSize:10, color:'#6b726e', background:'#0d0f0e', border:'1px solid #2a2e2b', padding:'3px 8px' },
}