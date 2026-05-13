const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
  // Autenticação
  login: (usuario, senha) => ipcRenderer.invoke('auth:login', usuario, senha),

  // Todas passam o id_empresa pra filtrar os dados
  listarVeiculos:      (id_empresa) => ipcRenderer.invoke('veiculos:listar', id_empresa),
  listarMotoristas:    (id_empresa) => ipcRenderer.invoke('motoristas:listar', id_empresa),
  listarViagens:       (id_empresa) => ipcRenderer.invoke('viagens:listar', id_empresa),
  listarManutencao:    (id_empresa) => ipcRenderer.invoke('manutencao:listar', id_empresa),
  listarPreventivas:   (id_empresa) => ipcRenderer.invoke('preventivas:listar', id_empresa),
  listarAbastecimento: (id_empresa) => ipcRenderer.invoke('abastecimento:listar', id_empresa),
  listarMultas:        (id_empresa) => ipcRenderer.invoke('multas:listar', id_empresa),
})