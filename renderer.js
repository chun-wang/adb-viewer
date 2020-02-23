// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process because
// `nodeIntegration` is turned off. Use `preload.js` to
// selectively enable features needed in the rendering
// process.
let {remote} = require('electron');
const ipc = require('electron').ipcRenderer

ipc.on('update_screen-reply', (event, arg) => {
    url = arg + "/screenshot.png?" + + new Date().getTime()
    document.getElementById("imageid").src = url
    console.log("update_screen-reply" + arg)
})

ipc.on('data-reply', (event, arg) => {
    console.log("data-reply" + arg)
})

ipc.on('run_script-reply', (event, arg) => {
    console.log("run_script-reply")
    console.log(arg)
})

function requestUpdateImage() {
}

function onClickHome(){
    ipc.send('run_script', "adb shell input keyevent 3")
    requestUpdateImage()
    console.log('onClickHome Called!!!');
}

function onClickBack(){
    ipc.send('run_script', "adb shell input keyevent 4")
    requestUpdateImage()
    console.log('onClickBack Called!!!');
}

function onClickUp(){
    ipc.send('run_script', "adb shell input keyevent 19")
    requestUpdateImage()
    console.log('onClickUp Called!!!');
}

function onClickLeft(){
    ipc.send('run_script', "adb shell input keyevent 21")
    requestUpdateImage()
    console.log('onClickLeft Called!!!');
}

function onClickOk(){
    ipc.send('run_script', "adb shell input keyevent 23")
    requestUpdateImage()
    console.log('onClickOk Called!!!');
}

function onClickRight(){
    ipc.send('run_script', "adb shell input keyevent 22")
    requestUpdateImage()
    console.log('onClickRight Called!!!');
}

function onClickDown(){
    ipc.send('run_script', "adb shell input keyevent 20")
    requestUpdateImage()
    console.log('onClickDown Called!!!');
}
