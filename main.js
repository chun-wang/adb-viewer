// Modules to control application life and create native browser window
const {app, BrowserWindow} = require('electron')
const path = require('path')
const electron = require('electron');
const child_process = require('child_process');
const spawn = require('child_process').spawn
const dialog = electron.dialog;
const ipc = electron.ipcMain
var mainWindow = null

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      preload: path.join(__dirname, 'preload.js')
    }
  })

  // and load the index.html of the app.
  mainWindow.loadFile('index.html')

  update_screen()

  // Open the DevTools.
  mainWindow.webContents.openDevTools()
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') app.quit()
})

app.on('activate', function () {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) createWindow()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
//Uses node.js process manager

// This function will output the lines from the script 
// and will return the full combined output
// as well as exit code when it's done (using the callback).
function run_script(command, args, callback) {
  console.log(command);
    var child = spawn(command, args, {
        encoding: 'utf8',
        shell: true
    });
    // You can also use a variable to save the output for when the script closes later
    child.on('error', (error) => {
        dialog.showMessageBox({
            title: 'Title',
            type: 'warning',
            message: 'Error occured.\r\n' + error
        });
    });

    child.stdout.setEncoding('utf8');
    child.stdout.on('data', (data) => {
        //Here is the output
        data=data.toString();   
        console.log(data);
        mainWindow.webContents.send('data-reply', data)
    });

    child.stderr.setEncoding('utf8');
    child.stderr.on('data', (data) => {
        // Return some data to the renderer process with the mainprocess-response ID
        // mainWindow.webContents.send('mainprocess-response', data);
        //Here is the output from the command
        data=data.toString();
        console.log(data);
        dialog.showMessageBox({
          title: 'run command error',
          type: 'warning',
          message: 'Error occured.\r\n' + data
      });
    });

    child.on('close', (code) => {
      console.log(code);
      if (typeof callback === 'function')
        callback();
    });
}

function update_screen() {
  console.log("update_screen")
  const userDataPath = (electron.app || electron.remote.app).getPath('userData');
  console.log(userDataPath)
  const path = "'" + userDataPath + "'";
  run_script("adb shell screencap -p /sdcard/screenshot.png && adb pull /sdcard/screenshot.png " + path, null, () =>{
    if (mainWindow != null)
      mainWindow.webContents.send('update_screen-reply', userDataPath)
    setTimeout(update_screen, 100)
  })
}

ipc.on('run_script', (event, arg) => {
  console.log(arg) // prints "ping"
  run_script(arg, null, ()=>{
    event.reply('run_script-reply', 'pong')
  })
})

ipc.on('update_screen', (event, arg) => {
  console.log(arg) // prints "ping"
  run_script(arg, null, ()=>{
    event.reply('update_screen-reply', 'pong')
  })
})
