"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var electron_1 = require("electron");
var url = require('url');
var path = require('path');
process.env.NODE_ENV = 'production';
process.env.NODE_ENV = 'development';
// const { app, BrowserWindow, Menu } = electron;
var mainWindow;
var addWindow;
var angularWindow;
//Wait till the application is ready
electron_1.app.on('ready', function () {
    // Create the window
    mainWindow = new electron_1.BrowserWindow();
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'main.html'),
        // pathname: path.join(__dirname, 'angular_app/index.html'),
        protocol: 'file:',
        slashes: true
    }));
    //Event on close
    mainWindow.on('closed', function () {
        electron_1.app.quit();
    });
    var mainMenu = electron_1.Menu.buildFromTemplate(menuTemplate);
    electron_1.Menu.setApplicationMenu(mainMenu);
});
//Actions
var showAddWindow = function () {
    addWindow = new electron_1.BrowserWindow({
        width: 500,
        height: 500,
    });
    addWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'add.html'),
        protocol: 'file:',
        slashes: true
    }));
    // garbage collection
    addWindow.on('close', function () {
        addWindow = null;
    });
};
var showAngularWindow = function () {
    angularWindow = new electron_1.BrowserWindow({
        width: 500,
        height: 500,
    });
    angularWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'angular_app/index.html'),
        protocol: 'file:',
        slashes: true
    }));
    // garbage collection
    angularWindow.on('close', function () {
        angularWindow = null;
    });
};
// Send data between pages
electron_1.ipcMain.on('item:add', function (event, item) {
    console.log('item:add', item);
    mainWindow.webContents.send('item:add', item);
    addWindow.close();
});
//Menu template
var menuTemplate = [
    {
        label: 'File',
        submenu: [
            {
                label: 'Add Item',
                click: function () {
                    showAddWindow();
                }
            },
            {
                label: 'Clear Item'
            },
            {
                label: 'Angular Integration',
                click: function () {
                    showAngularWindow();
                }
            },
            {
                label: 'Quit',
                accelerator: process.platform == 'darwin' ? 'Command+Q' : 'Ctrl+Q',
                click: function () {
                    electron_1.app.quit();
                }
            }
        ]
    }
];
// Mac os show New menu 
if (process.platform == 'darwin') {
    // menuTemplate = [{}, ...menuTemplate];
    menuTemplate.unshift({});
}
console.log(process.env.NODE_ENV);
//Enable dev tools
if (process.env.NODE_ENV !== 'production') {
    menuTemplate.push({
        label: 'Develper Tools',
        submenu: [
            {
                label: 'Toggle Dev Tools',
                click: function (menuItem, browserWindow) {
                    browserWindow.toggleDevTools();
                },
                accelerator: process.platform == 'darwin' ? 'Command+I' : 'Ctrl+I',
            },
            {
                role: 'reload'
            }
        ]
    });
}
