/**
 * Created by sulvto on 16-4-6.
 */
'use strict';
var fs = require('fs');
const emailServiceConfig = require('./emailServiceConfig.json');
const sendAttachments = require('./sendAttachments.js');
const electron = require('electron');
const app = electron.app;  // Module to control application life.
const BrowserWindow = electron.BrowserWindow;  // Module to create native browser window.

//

var userConfig = {
    path: __dirname + "/../config.json",

    get: function () {
        var fileContent = fs.readFileSync(this.path, 'utf8');
        return JSON.parse(fileContent);
    },
    set: function (content) {
        if ("object" === typeof content) {
            content = JSON.stringify(content);
        }
        fs.writeFileSync(this.path, content, 'utf8');
    }
};

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
var mainWindow = null;

// Quit when all windows are closed.
app.on('window-all-closed', function () {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform != 'darwin') {
        app.quit();
    }
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.on('ready', function () {
    // Create the browser window.
    mainWindow = new BrowserWindow({width: 400, height: 300});

    // and load the index.html of the app.
    mainWindow.loadURL('file://' + __dirname + '/index.html');

    // Open the DevTools.
    mainWindow.webContents.openDevTools();

    // Emitted when the window is closed.
    mainWindow.on('closed', function () {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        mainWindow = null;
    });
});


//======================== ipc ===================================

const ipcMain = electron.ipcMain;
const ipcRenderer = electron.ipcRenderer;

ipcMain.on('asynchronous-message', function (event, arg) {
    var reply = function (content) {
        event.sender.send('asynchronous-reply', content);
    };

    var r = /^\w+@([A-z]+)\.\w+?$/g;
    var service = r.exec(arg.form.email)[1];
    var config = emailServiceConfig[service];
    if (config) {
        config.auth = {
            "user": arg.form.email,
            "pass": arg.form.pass
        };
        sendAttachments
            .create(config, arg.to, arg.files)
            .send(function (error, info) {
                if (error) {
                    reply({error: 2, message: '发送失败', cause: error})
                } else {
                    reply({error: 0, message: '发送成功'});
                }
            });
    } else {
        reply({error: 1, message: '没有相关配置'});
    }
});

ipcMain.on('ipc-configInfo-get', function (event, arg) {
    event.sender.send('ipc-configInfo-reply', userConfig.get());
});

ipcMain.on('ipc-configInfo-set', function (event, arg) {
    userConfig.set(arg);
});