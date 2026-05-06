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

ipcMain.handle('auth:login', async (_e, usuario, senha) => {
  try {
    const [rows] = await db.query(
      'SELECT id, nome, cargo FROM usuarios WHERE usuario = ? AND senha = ? LIMIT 1',
      [usuario, senha]
    )
    if (rows.length === 0) return { ok: false, erro: 'Usuário ou senha inválidos.' }
    return { ok: true, usuario: rows[0] }
  } catch (err) {
    console.error('[auth:login]', err)
    return { ok: false, erro: 'Erro interno. Tente novamente.' }
  }
})

app.whenReady().then(createWindow)
app.on('window-all-closed', () => { if (process.platform !== 'darwin') app.quit() })