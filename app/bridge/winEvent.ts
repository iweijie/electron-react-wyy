import { app, BrowserWindow, ipcMain, ipcRenderer } from 'electron';
import { WINDOW_STATE_HIDE, WINDOW_STATE_NORMAL, WINDOW_STATE_MIN, WINDOW_STATE_MAX } from '../store/quiescent';

export default (mainWindow) => {
	// mainWindow.on('resize', (e) => {});
	// 窗口最大化时触发;
	mainWindow.on('maximize', (e) => {
		mainWindow.webContents.send('window-size-change', WINDOW_STATE_MAX);
	});
	// 当窗口从最大化状态退出时触发;
	mainWindow.on('unmaximize', (e) => {
		mainWindow.webContents.send('window-size-change', WINDOW_STATE_NORMAL);
	});
	// 窗口最小化时触发
	mainWindow.on('minimize', (e) => {
		mainWindow.webContents.send('window-size-change', WINDOW_STATE_HIDE);
	});

};
