import native from './native';
import winEvent from './winEvent';

export default (win) => {
	native(win);
	winEvent(win);
};

// const { ipcMain } = require('electron')
// ipcMain.on('asynchronous-message', (event, arg) => {
//   console.log(arg) // prints "ping"
//   event.reply('asynchronous-reply', 'pong')
// })

// ipcMain.on('synchronous-message', (event, arg) => {
//   console.log(arg) // prints "ping"
//   event.returnValue = 'pong'
// })Copy
// //在渲染器进程 (网页) 中。
// const { ipcRenderer } = require('electron')
// console.log(ipcRenderer.sendSync('synchronous-message', 'ping')) // prints "pong"

// ipcRenderer.on('asynchronous-reply', (event, arg) => {
//   console.log(arg) // prints "pong"
// })
// ipcRenderer.send('asynchronous-message', 'ping')
