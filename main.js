const { app, BrowserWindow, dialog, ipcMain } = require('electron');
const { Menu } = require('electron');
const path = require('path');
const fs = require('fs');

function createWindow() {
  const win = new BrowserWindow({
    width: 1000,
    height: 700,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  });

const menu = Menu.buildFromTemplate([
  {
    label: 'File',
    submenu: [
      {
        label: 'Open...',
        click: async () => {
          const result = await dialog.showOpenDialog({
            properties: ['openFile'],
            filters: [{ name: 'Text Files', extensions: ['txt'] }]
          });
          if (result.canceled || result.filePaths.length === 0) return;

          const filePath = result.filePaths[0];
          win.webContents.send('new-file-selected', filePath);
        }
      },
      {
        label: 'Save',
        accelerator: 'Ctrl+S',
        click: (menuItem, browserWindow) => {
          browserWindow.webContents.send('menu-save');
        }
      },
      { role: 'quit' }
    ]
  }
]);

Menu.setApplicationMenu(menu);
win.webContents.openDevTools();



  win.loadFile('index.html');
}

app.whenReady().then(createWindow);

ipcMain.handle('open-file', async () => {
  const result = await dialog.showOpenDialog({
    properties: ['openFile'],
    filters: [{ name: 'Text Files', extensions: ['txt'] }]
  });
  if (result.canceled || result.filePaths.length === 0) return null;
  return result.filePaths[0];
});


ipcMain.handle('read-file', async (_, filePath) => {
  return fs.readFileSync(filePath, 'utf-8');
});

ipcMain.handle('read-json', async (_, jsonPath) => {
  return JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));
});

ipcMain.handle('save-file', async (_, filePath, text) => {
  fs.writeFileSync(filePath, text, 'utf-8');
  return true;
});