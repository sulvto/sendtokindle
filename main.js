/**
 * Created by sulvto on 16-4-6.
 */
'use strict';

const sendAttachments = require('./sendAttachments.js');
const electron = require('electron');
const app = electron.app;  // Module to control application life.
const BrowserWindow = electron.BrowserWindow;  // Module to create native browser window.

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
var mainWindow = null;

// Quit when all windows are closed.
app.on('window-all-closed', function() {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform != 'darwin') {
        app.quit();
    }
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.on('ready', function() {
    // Create the browser window.
    mainWindow = new BrowserWindow({width: 400, height: 300});

    // and load the index.html of the app.
    mainWindow.loadURL('file://' + __dirname + '/index.html');

    // Open the DevTools.
    mainWindow.webContents.openDevTools();

    // Emitted when the window is closed.
    mainWindow.on('closed', function() {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        mainWindow = null;
    });
});



//======================== ipc ===================================
var config = {
    service: 'hotmail',
    auth: {
        user: '***@outlook.com',
        pass: '***'
    }
};

const ipcMain = electron.ipcMain;
ipcMain.on('asynchronous-message', function(event, arg) {
    for(var index in arg.files){
        console.log( arg.files[index]);
        console.log( arg.files[index].name);
        console.log( arg.files[index].path);
    }
    sendAttachments.create(config).send(arg.to, arg.files);
});



