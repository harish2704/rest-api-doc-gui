"use strict";


var app = require('app');  // Module to control application life.
var BrowserWindow = require('browser-window');  // Module to create native browser window.
var assert = require('assert');

var ipc = require('electron').ipcMain;
var InputFile = require('./input-file');

var dataFile = process.argv[2];
assert( dataFile, 'No dataFile specified! ...');



// Report crashes to our server.
require('crash-reporter').start();

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


ipc.on( 'readFile', function( ev ){
  var data = InputFile.read( dataFile );
  ev.sender.send( 'dataFile', data );
});

ipc.on( 'writeFile', function( ev, data ){
  InputFile.write( dataFile, data );
});


// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.on('ready', function() {
  // Create the browser window.
  mainWindow = new BrowserWindow();

  // and load the index.html of the app.
  mainWindow.loadUrl('file://' + __dirname + '/main.html');
  mainWindow.maximize();

  // Open the DevTools.
  // mainWindow.openDevTools();

  // Emitted when the window is closed.
  mainWindow.on('closed', function() {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });
});
