const { app, BrowserWindow, ipcMain, Tray, Menu, globalShortcut, session, nativeImage } = require('electron');
const path = require('path');

// Keep audio running when the window is minimized
app.commandLine.appendSwitch('disable-renderer-backgrounding');
app.commandLine.appendSwitch('disable-background-timer-throttling');
app.commandLine.appendSwitch('autoplay-policy', 'no-user-gesture-required');

let win = null, tray = null, quitting = false;

if (!app.requestSingleInstanceLock()) { app.quit(); }
app.on('second-instance', () => showWin());

function showWin() {
  if (!win) return;
  if (win.isMinimized()) win.restore();
  win.show(); win.focus();
}

function createWindow() {
  win = new BrowserWindow({
    width: 1280, height: 820, minWidth: 900, minHeight: 600,
    frame: false, backgroundColor: '#0d0f14', show: false,
    title: 'VoiceChanger',
    icon: path.join(__dirname, 'icon.png'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true, nodeIntegration: false,
      backgroundThrottling: false
    }
  });
  win.loadFile(path.join(__dirname, 'index.html'));
  win.once('ready-to-show', () => win.show());

  // Closing the window hides it to the tray (voice keeps changing)
  win.on('close', e => {
    if (!quitting) { e.preventDefault(); win.hide(); win.webContents.send('vc:hidden'); }
  });
  win.on('maximize', () => win.webContents.send('vc:maximized', true));
  win.on('unmaximize', () => win.webContents.send('vc:maximized', false));
}

function createTray() {
  tray = new Tray(nativeImage.createFromPath(path.join(__dirname, 'tray.png')));
  tray.setToolTip('VoiceChanger');
  tray.setContextMenu(Menu.buildFromTemplate([
    { label: 'Open VoiceChanger', click: showWin },
    { label: 'A/B: effect on/off', click: () => send('bypass') },
    { label: 'Hear yourself on/off', click: () => send('monitor') },
    { type: 'separator' },
    { label: 'Quit', click: () => { quitting = true; app.quit(); } }
  ]));
  tray.on('click', showWin);
}

function send(action, arg) { if (win) win.webContents.send('vc:hotkey', action, arg); }

function registerHotkeys() {
  // Global hotkeys — work even in games
  globalShortcut.register('Control+Shift+B', () => send('bypass'));
  globalShortcut.register('Control+Shift+M', () => send('monitor'));
  globalShortcut.register('Control+Shift+V', () => send('mute'));
  for (let i = 1; i <= 9; i++) globalShortcut.register('Control+Shift+' + i, () => send('preset', i - 1));
}

app.whenReady().then(() => {
  app.setAppUserModelId('com.w1ckix.voicechanger');
  // Allow microphone and output selection without prompts
  session.defaultSession.setPermissionRequestHandler((wc, perm, cb) => cb(['media', 'speaker-selection', 'audioCapture'].includes(perm)));
  session.defaultSession.setPermissionCheckHandler((wc, perm) => ['media', 'speaker-selection', 'audioCapture'].includes(perm));

  createWindow();
  createTray();
  registerHotkeys();

  ipcMain.on('vc:win', (e, cmd) => {
    if (!win) return;
    if (cmd === 'min') win.minimize();
    else if (cmd === 'max') win.isMaximized() ? win.unmaximize() : win.maximize();
    else if (cmd === 'close') win.close();
    else if (cmd === 'quit') { quitting = true; app.quit(); }
  });
});

app.on('before-quit', () => { quitting = true; });
app.on('will-quit', () => globalShortcut.unregisterAll());
app.on('window-all-closed', () => { if (process.platform !== 'darwin') app.quit(); });
