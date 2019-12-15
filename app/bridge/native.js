import { app, BrowserWindow, ipcMain, ipcRenderer } from 'electron';

export default (mainWindow) => {
	// 窗口最小化
	ipcMain.on('ipc-native-minimize', (e) => mainWindow.minimize());
	// 取消窗口最大化
	ipcMain.on('ipc-native-unmaximize', (e) => mainWindow.unmaximize());
	// 窗口最大化
	ipcMain.on('ipc-native-maximize', (e) => mainWindow.maximize());
	// 关闭窗口
	ipcMain.on('ipc-native-close', (e) => mainWindow.close());
	// 窗口是否最大化
	ipcMain.on('ipc-native-is-maximize', (e) => {
		e.reply('reply-is-maximize', mainWindow.isMaximized());
	});
	// 当前窗口是否为焦点
	ipcMain.on('ipc-native-is-focused', (e, id = 'reply-is-focused') => {
		console.log('id:', e);
		console.log('id:', id);
		mainWindow.webContents.send(id, mainWindow.isFocused());
	});

	// // 窗口 大小 变化时的事件
	// ipcMain.on('window-size-change', (e, state) => {
	// 	e.reply('reply-window-size-change', state);
	// });
};
