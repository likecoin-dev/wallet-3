/******************************************************************************
 * Copyright © 2017 XIN Community                                             *
 *                                                                            *
 * See the DEVELOPER-AGREEMENT.txt and LICENSE.txt files at  the top-level    *
 * directory of this distribution for the individual copyright  holder        *
 * information and the developer policies on copyright and licensing.         *
 *                                                                            *
 * Unless otherwise agreed in a custom licensing agreement, no part of the    *
 * XIN software, including this file, may be copied, modified, propagated,    *
 * or distributed except according to the terms contained in the LICENSE.txt  *
 * file.                                                                      *
 *                                                                            *
 * Removal or modification of this copyright notice is prohibited.            *
 *                                                                            *
 ******************************************************************************/

var electron = require('electron');
// Module to control application life.
var app = electron.app;
// Module to create native browser window.
var BrowserWindow = electron.BrowserWindow;

var path = require('path');
var url = require('url');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
var mainWindow;

function createEternalUrlWindow(url){
    var external = new BrowserWindow({width: 1920, height: 1080,icon:path.join(__dirname, 'images/logo.png')});

    // Emitted when the window is closed.
    external.on('closed', function () {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        external = null;
    });

}

function createMenu(){
    var template = [
        {
            label: 'Window',
            role: 'window',
            submenu: [
                {
                  label: 'Full Screen',
                  accelerator: process.platform === 'darwin' ? 'Ctrl+Command+F' : 'F11',
                  click() {
                    mainWindow.setFullScreen(!mainWindow.isFullScreen());
                  }
                },
                {
                   label: 'Minimize',
                   accelerator: 'CmdOrCtrl+M',
                   role: 'minimize'
                },
                {
                    role: 'close'
                },
                {
                    role:'toggledevtools'
                }
            ]
        },
        {
            label: 'Edit',
            submenu: [
              {
                label: 'Undo',
                accelerator: 'CmdOrCtrl+Z',
                role: 'undo'
              },
              {
                label: 'Redo',
                accelerator: 'Shift+CmdOrCtrl+Z',
                role: 'redo'
              },
              {
                type: 'separator'
              },
              {
                label: 'Cut',
                accelerator: 'CmdOrCtrl+X',
                role: 'cut'
              },
              {
                label: 'Copy',
                accelerator: 'CmdOrCtrl+C',
                role: 'copy'
              },
              {
                label: 'Paste',
                accelerator: 'CmdOrCtrl+V',
                role: 'paste'
              },
              {
                label: 'Select All',
                accelerator: 'CmdOrCtrl+A',
                role: 'selectall'
              },
            ]
          },
        {
            label: 'Resources',
            role: 'help',
            submenu: [
                {
                    label: 'Foundation',
                    accelerator: 'CmdOrCtrl+F',
                    click:function () {
                      electron.shell.openExternal('http://www.infinity-economics.org/');
                    }
                },
                {
                    label: 'Download',
                    accelerator: 'CmdOrCtrl+D',
                    click:function () {
                      electron.shell.openExternal('http://www.infinity-economics.org/download/');
                    }
                },
                {
                    label: 'Documentation',
                    accelerator: 'CmdOrCtrl+X',
                    click:function () {
                      electron.shell.openExternal('http://www.infinity-economics.org/docs/');
                    }
                },
                {
                    label: 'API',
                    accelerator: 'CmdOrCtrl+A',
                    click:function () {
                      electron.shell.openExternal('http://www.infinity-economics.org/api/');
                    }
                },
                {
                    label: 'Monitor',
                    accelerator: 'CmdOrCtrl+M',
                    click:function () {
                      electron.shell.openExternal('http://www.infinity-economics.org/monitor/');
                    }
                },
                {
                  type: 'separator'
                },
                {
                    label: 'Forum',
                    accelerator: 'CmdOrCtrl+O',
                    click:function () {
                      electron.shell.openExternal('http://forum.infinity-economics.org/');
                    }
                }


            ]
        }
    ];



    var menu = electron.Menu.buildFromTemplate(template);
    electron.Menu.setApplicationMenu(menu);
}

function createWindow () {
    // Create the browser window.
    mainWindow = new BrowserWindow({width: 1920, height: 1080,icon:path.join(__dirname, 'images/logo.png')});
    mainWindow.maximize();

    // and load the index.html of the app.
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file:',
        slashes: true
    }));

    // Open the DevTools.
    //mainWindow.webContents.openDevTools();

    createMenu();

    // Emitted when the window is closed.
    mainWindow.on('closed', function () {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        mainWindow = null;
    });

    mainWindow.webContents.on('new-window', function(e, urlExt) {
        if(urlExt.indexOf('file://')!==-1){
            urlExt=urlExt.replace('file://','http://');
        }
        e.preventDefault();
        electron.shell.openExternal(urlExt);
    });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', function () {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', function () {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (mainWindow === null) {
        createWindow();
    }
});


// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
//Contact GitHub
