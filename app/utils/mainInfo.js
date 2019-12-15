import electron, { ipcRenderer, remote } from 'electron';
import config from '../config';
import { get, join, map, split } from 'lodash';

const win = remote.getCurrentWindow();

// 获取容器宽高 以及在屏幕中的位置
export const getContainerBounds = () => {
	return win.getBounds();
};
