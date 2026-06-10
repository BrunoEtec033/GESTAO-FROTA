require('dotenv').config()
const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')
const db = require('./database')

const isDev = process.env.NODE_ENV !== 'production'

function createWindow() {
  const win = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 960,
    minHeight: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  })

  isDev
    ? win.loadURL('http://localhost:5173')
    : win.loadFile(path.join(__dirname, '../../dist/index.html'))
}

// ── Helper: wrapper com tratamento de erro padrão ──────────
// FIX: evita repetir try/catch em todo handler
async function querySegura(canal, sql, params = []) {
  try {
    const [rows] = await db.query(sql, params)
    return { ok: true, dados: rows }
  } catch (err) {
    console.error(`[${canal}]`, err.message)
    return { ok: false, erro: `Erro ao executar ${canal}.` }
  }
}

// ── Login ──────────────────────────────────────────────────
ipcMain.handle('auth:login', async (_e, login, senha) => {
  try {
    const [rows] = await db.query(
      'SELECT id, nome, nivel_acesso, id_empresa FROM `user` WHERE login = ? AND senha = ? AND ativo = 1 LIMIT 1',
      [login, senha]
    )
    if (rows.length === 0) return { ok: false, erro: 'Usuário ou senha inválidos.' }
    return { ok: true, usuario: rows[0] }
  } catch (err) {
    console.error('[auth:login]', err.message)
    return { ok: false, erro: 'Erro interno. Tente novamente.' }
  }
})

// ── Veículos ───────────────────────────────────────────────
ipcMain.handle('veiculos:listar', async (_e, id_empresa) => {
  // FIX: se id_empresa for null/undefined, busca tudo (compatível com schema sem id_empresa)
  if (id_empresa) {
    return querySegura('veiculos:listar',
      'SELECT * FROM controle_veiculo WHERE ativo = 1 AND id_empresa = ? ORDER BY placa',
      [id_empresa]
    )
  }
  return querySegura('veiculos:listar',
    'SELECT * FROM controle_veiculo WHERE ativo = 1 ORDER BY placa'
  )
})

// ── Motoristas ─────────────────────────────────────────────
ipcMain.handle('motoristas:listar', async (_e, id_empresa) => {
  if (id_empresa) {
    return querySegura('motoristas:listar',
      'SELECT * FROM motorista WHERE ativo = 1 AND id_empresa = ? ORDER BY nome',
      [id_empresa]
    )
  }
  return querySegura('motoristas:listar',
    'SELECT * FROM motorista WHERE ativo = 1 ORDER BY nome'
  )
})

// ── Viagens ────────────────────────────────────────────────
ipcMain.handle('viagens:listar', async (_e, id_empresa) => {
  if (id_empresa) {
    return querySegura('viagens:listar',
      'SELECT * FROM controle_viagem WHERE id_empresa = ? ORDER BY data_saida DESC',
      [id_empresa]
    )
  }
  return querySegura('viagens:listar',
    'SELECT * FROM controle_viagem ORDER BY data_saida DESC'
  )
})

// ── Manutenção realizadas ──────────────────────────────────
ipcMain.handle('manutencao:listar', async (_e, id_empresa) => {
  if (id_empresa) {
    return querySegura('manutencao:listar',
      'SELECT * FROM controle_manutencao WHERE id_empresa = ? ORDER BY data_manutencao DESC',
      [id_empresa]
    )
  }
  return querySegura('manutencao:listar',
    'SELECT * FROM controle_manutencao ORDER BY data_manutencao DESC'
  )
})

// ── Manutenção preventivas ─────────────────────────────────
ipcMain.handle('preventivas:listar', async (_e, id_empresa) => {
  if (id_empresa) {
    return querySegura('preventivas:listar',
      'SELECT * FROM manutencao_preventiva WHERE id_empresa = ? ORDER BY data_prevista ASC',
      [id_empresa]
    )
  }
  return querySegura('preventivas:listar',
    'SELECT * FROM manutencao_preventiva ORDER BY data_prevista ASC'
  )
})

// ── Abastecimento ──────────────────────────────────────────
ipcMain.handle('abastecimento:listar', async (_e, id_empresa) => {
  if (id_empresa) {
    return querySegura('abastecimento:listar',
      'SELECT * FROM abastecimento WHERE id_empresa = ? ORDER BY data_abastecimento DESC',
      [id_empresa]
    )
  }
  return querySegura('abastecimento:listar',
    'SELECT * FROM abastecimento ORDER BY data_abastecimento DESC'
  )
})

// ── Multas ─────────────────────────────────────────────────
ipcMain.handle('multas:listar', async (_e, id_empresa) => {
  if (id_empresa) {
    return querySegura('multas:listar',
      'SELECT * FROM controle_multas WHERE id_empresa = ? ORDER BY data_infracao DESC',
      [id_empresa]
    )
  }
  return querySegura('multas:listar',
    'SELECT * FROM controle_multas ORDER BY data_infracao DESC'
  )
})

// ── App lifecycle ──────────────────────────────────────────
app.whenReady().then(createWindow)
app.on('window-all-closed', () => { if (process.platform !== 'darwin') app.quit() })
