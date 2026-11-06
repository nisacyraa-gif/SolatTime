const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

let mainWindow;
let reminderWindow;

function createMainWindow() {
  mainWindow = new BrowserWindow({
    width: 900,
    height: 700,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });
  mainWindow.loadFile('renderer/index.html');
}

function createReminderWindow() {
  reminderWindow = new BrowserWindow({
    width: 650,
    height: 650,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });
  reminderWindow.loadFile('renderer/reminders.html');
}

ipcMain.on('open-reminder-window', () => {
  createReminderWindow();
});

app.whenReady().then(createMainWindow);