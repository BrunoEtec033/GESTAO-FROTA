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

ipcMain.handle('auth:login', async (_e, login, senha) => {
  try {
    console.log('[login tentativa]', login, senha)
    const [rows] = await db.query(
      'SELECT id, nome, nivel_acesso FROM user WHERE login = ? AND senha = ? AND ativo = 1 LIMIT 1',
      [login, senha]
    )
    console.log('[login resultado]', rows)
    if (rows.length === 0) return { ok: false, erro: 'Usuário ou senha inválidos.' }
    return { ok: true, usuario: rows[0] }
  } catch (err) {
    console.error('[auth:login erro]', err.message)
    return { ok: false, erro: 'Erro interno. Tente novamente.' }
  }
})

app.whenReady().then(createWindow)
app.on('window-all-closed', () => { if (process.platform !== 'darwin') app.quit() })