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
  try {
    const [rows] = await db.query(
      'SELECT * FROM controle_veiculo WHERE ativo = 1 AND id_empresa = ? ORDER BY placa',
      [id_empresa]
    )
    return { ok: true, dados: rows }
  } catch (err) {
    console.error('[veiculos:listar]', err.message)
    return { ok: false, erro: 'Erro ao buscar veículos.' }
  }
})

// ── Motoristas ─────────────────────────────────────────────
ipcMain.handle('motoristas:listar', async (_e, id_empresa) => {
  try {
    const [rows] = await db.query(
      'SELECT * FROM motorista WHERE ativo = 1 AND id_empresa = ? ORDER BY nome',
      [id_empresa]
    )
    return { ok: true, dados: rows }
  } catch (err) {
    console.error('[motoristas:listar]', err.message)
    return { ok: false, erro: 'Erro ao buscar motoristas.' }
  }
})

// ── Viagens ────────────────────────────────────────────────
ipcMain.handle('viagens:listar', async (_e, id_empresa) => {
  try {
    const [rows] = await db.query(
      'SELECT * FROM controle_viagem WHERE id_empresa = ? ORDER BY data_saida DESC',
      [id_empresa]
    )
    return { ok: true, dados: rows }
  } catch (err) {
    console.error('[viagens:listar]', err.message)
    return { ok: false, erro: 'Erro ao buscar viagens.' }
  }
})

// ── Manutenção realizadas ──────────────────────────────────
ipcMain.handle('manutencao:listar', async (_e, id_empresa) => {
  try {
    const [rows] = await db.query(
      'SELECT * FROM controle_manutencao WHERE id_empresa = ? ORDER BY data_manutencao DESC',
      [id_empresa]
    )
    return { ok: true, dados: rows }
  } catch (err) {
    console.error('[manutencao:listar]', err.message)
    return { ok: false, erro: 'Erro ao buscar manutenções.' }
  }
})

// ── Manutenção preventivas ─────────────────────────────────
ipcMain.handle('preventivas:listar', async (_e, id_empresa) => {
  try {
    const [rows] = await db.query(
      'SELECT * FROM manutencao_preventiva WHERE id_empresa = ? ORDER BY data_prevista ASC',
      [id_empresa]
    )
    return { ok: true, dados: rows }
  } catch (err) {
    console.error('[preventivas:listar]', err.message)
    return { ok: false, erro: 'Erro ao buscar preventivas.' }
  }
})

// ── Abastecimento ──────────────────────────────────────────
ipcMain.handle('abastecimento:listar', async (_e, id_empresa) => {
  try {
    const [rows] = await db.query(
      'SELECT * FROM abastecimento WHERE id_empresa = ? ORDER BY data_abastecimento DESC',
      [id_empresa]
    )
    return { ok: true, dados: rows }
  } catch (err) {
    console.error('[abastecimento:listar]', err.message)
    return { ok: false, erro: 'Erro ao buscar abastecimentos.' }
  }
})

// ── Multas ─────────────────────────────────────────────────
ipcMain.handle('multas:listar', async (_e, id_empresa) => {
  try {
    const [rows] = await db.query(
      'SELECT * FROM controle_multas WHERE id_empresa = ? ORDER BY data_infracao DESC',
      [id_empresa]
    )
    return { ok: true, dados: rows }
  } catch (err) {
    console.error('[multas:listar]', err.message)
    return { ok: false, erro: 'Erro ao buscar multas.' }
  }
})

// ── App lifecycle ──────────────────────────────────────────
app.whenReady().then(createWindow)
app.on('window-all-closed', () => { if (process.platform !== 'darwin') app.quit() })