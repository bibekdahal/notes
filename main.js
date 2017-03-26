const {app, BrowserWindow, ipcMain} = require('electron');
const path = require('path');
const url = require('url');
const ipc = ipcMain;

const FileStore = require('./filestore.js');

let window;

function createWindow () {
    window = new BrowserWindow({
        width: 800,
        height: 600,
        type: 'utility',
    });

    window.loadURL(url.format({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file:',
        slashes: true
    }));

    window.setMenu(null);
    // window.webContents.openDevTools();

    window.on('closed', () => {
        window = null
    });


    let fileStore = new FileStore('notes.html');
    ipc.on('save', (event, data) => {
        fileStore.setData(data);
    });

    window.webContents.on('dom-ready', () => {
        window.webContents.send('load', fileStore.getData());
    });
}

app.on('ready', createWindow);
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (window === null) {
        createWindow();
    }
})
