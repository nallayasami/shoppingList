import { MenuItemConstructorOptions, MenuItem, BrowserWindow, app, Menu, ipcMain } from "electron";

const url = require('url');
const path = require('path');

process.env.NODE_ENV = 'production'
process.env.NODE_ENV = 'development'

// const { app, BrowserWindow, Menu } = electron;

let mainWindow: BrowserWindow;
let addWindow: BrowserWindow;
let angularWindow: BrowserWindow;

//Wait till the application is ready
app.on('ready', () => {
    // Create the window
    mainWindow = new BrowserWindow();
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'main.html'),
        // pathname: path.join(__dirname, 'angular_app/index.html'),
        protocol: 'file:',
        slashes: true
    }));

    //Event on close
    mainWindow.on('closed', () => {
        app.quit();
    })

    const mainMenu = Menu.buildFromTemplate(menuTemplate);
    Menu.setApplicationMenu(mainMenu);
});

//Actions
const showAddWindow = () => {
    addWindow = new BrowserWindow({
        width: 500,
        height: 500,
    });
    addWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'add.html'),
        protocol: 'file:',
        slashes: true
    }));
    // garbage collection
    addWindow.on('close', () => {
        addWindow = null;
    });

};
const showAngularWindow = () => {
    angularWindow = new BrowserWindow({
        width: 500,
        height: 500,
    });
    angularWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'angular_app/index.html'),
        protocol: 'file:',
        slashes: true
    }));
    // garbage collection
    angularWindow.on('close', () => {
        angularWindow = null;
    });

};

// Send data between pages
ipcMain.on('item:add', (event, item) => {
    console.log('item:add', item);
    mainWindow.webContents.send('item:add', item);
    addWindow.close();
});


//Menu template
const menuTemplate: MenuItemConstructorOptions[] = [
    {
        label: 'File',
        submenu: [
            {
                label: 'Add Item',
                click() {
                    showAddWindow();
                }
            },
            {
                label: 'Clear Item'
            },
            {
                label: 'Angular Integration',
                click() {
                    showAngularWindow();
                }
            },
            {
                label: 'Quit',
                accelerator: process.platform == 'darwin' ? 'Command+Q' : 'Ctrl+Q',
                click() {
                    app.quit();
                }
            }
        ]
    }
]
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
                click(menuItem: MenuItem, browserWindow: any) {
                    browserWindow.toggleDevTools();
                },
                accelerator: process.platform == 'darwin' ? 'Command+I' : 'Ctrl+I',
            },
            {
                role: 'reload'
            }
        ]
    })
}