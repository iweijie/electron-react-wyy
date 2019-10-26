import { app, BrowserWindow, ipcMain, ipcRenderer } from 'electron';

export default (mainWindow) => {
	// 窗口最小化
	ipcMain.on('native-minimize', (e) => mainWindow.minimize());
	// 取消窗口最大化
	ipcMain.on('native-unmaximize', (e) => mainWindow.unmaximize());
	// 窗口最大化
	ipcMain.on('native-maximize', (e) => mainWindow.maximize());
	// 关闭窗口
	ipcMain.on('native-close', (e) => mainWindow.close());
	// 窗口是否最大化
	ipcMain.on('native-is-maximize', (e) => {
		e.reply('reply-is-maximize', mainWindow.isMaximized());
	});
	// // 窗口 大小 变化时的事件
	// ipcMain.on('window-size-change', (e, state) => {
	// 	e.reply('reply-window-size-change', state);
	// });
};
