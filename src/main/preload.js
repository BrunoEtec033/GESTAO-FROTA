const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
  login: (usuario, senha) => ipcRenderer.invoke('auth:login', usuario, senha),
})