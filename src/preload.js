const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('vcApp', {
  win: cmd => ipcRenderer.send('vc:win', cmd),
  onHotkey: fn => ipcRenderer.on('vc:hotkey', (e, action, arg) => fn(action, arg)),
  onMaximized: fn => ipcRenderer.on('vc:maximized', (e, v) => fn(v)),
  onHidden: fn => ipcRenderer.on('vc:hidden', () => fn())
});
