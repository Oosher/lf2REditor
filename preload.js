const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
  readFile: (path) => ipcRenderer.invoke('read-file', path),
  readJSON: (path) => ipcRenderer.invoke('read-json', path),
  onNewFile: (callback) => ipcRenderer.on('new-file-selected', (_, path) => callback(path))
});
