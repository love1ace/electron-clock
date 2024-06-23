const {app, BrowserWindow} = require('electron');

let mainWindow;
let initialWidth;

function sendResizeEvent() {
    let {width} = mainWindow.getBounds();
    mainWindow.webContents.send('resize', width);
}

async function createWindow() {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 700,
        frame: true,
        alwaysOnTop: true,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    });

    initialWidth = mainWindow.getBounds().width;
    mainWindow.webContents.send('initial-width', initialWidth);

    await mainWindow.loadFile('index.html');

    mainWindow.on('closed', function () {
        mainWindow = null;
    });

    mainWindow.on('resize', sendResizeEvent);
    mainWindow.webContents.on('did-finish-load', sendResizeEvent);
}

app.on('ready', async () => {
    await createWindow();
});

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});