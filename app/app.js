// const DB_FILE_PATH = __dirname + '/db.sqlite'
const CONTROLLER_MODULE_URI = 'file://' + __dirname + '/controller/controller.html'

const electron = require('electron');
const {app, BrowserWindow, ipcMain} = electron;

const sqlite3 = require('sqlite3').verbose();

let controllerWindow;
const viewerWindows = [];
// let db;
let currentContext;
const contexts = [];

app.on('ready', () => {

    // Initialize DB
    // db = new sqlite3.Database(DB_FILE_PATH);

    // Initialize Context stack
    currentContext = new Context();
    contexts.push(currentContext);

    // Create controller window
    controllerWindow = new BrowserWindow();
    controllerWindow.loadURL(CONTROLLER_MODULE_URI);
    controllerWindow.openDevTools(); // For debugging
    controllerWindow.on('closed', () => {
        controllerWindow = null;
    });

    // Initialize display
    // let displays = electron.screen.getAllDisplays();
    // let externalDisplays = displays.filter((display) => {
    //     return display.bounds.x !== 0 || display.bounds.y !== 0
    // });
    //
    // for ( display in externalDisplays ) {
    //
    // }
});

app.on('window-all-closed', () => {
    // db.close();
    app.quit();
});

// Context Management
class Context {
    constructor(data) {

    }
}

function updateContext(context) {
    currentContext = context;
    controllerWindow.webContents.executeJavaScript('onUpdateContext()')
        .then((result) => {
            console.log(result);
        });
}

ipcMain.on('update-context', (event, data) => {
    updateContext(new Context(data));
});

ipcMain.on('push-context', (event, data) => {
    contexts.push(currentContext);
    currentContext = new Context(data);
    updateContext(context);
});

ipcMain.on('pop-context', (event, dummy) => {
    updateContext(contexts.pop());
});
