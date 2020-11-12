import { ipcRenderer } from 'electron';

const response = 'ipc-request-response';
const responseError = 'ipc-request-response-err';

export const ipcField = {
	response: 'ipc-request-response',
	responseError: 'ipc-request-response-err'
};
// 开发环境  重复刷新会多次注册，  所以一次性全部移除后重新注册
ipcMain.removeAllListeners(Object.keys(ipcField).map((key) => ipcField[key]));

function nodeRequestResponse(event, data) {
	// const { type, data } = response;
}

function nodeRequestResponseError(event, data) {}

ipcRenderer.on(ipcField.response, (event, response) => {
	let { type, data } = response;
	console.log('weijie', type);
	try {
		data = JSON.parse(data);
		console.log('weijie---', data);
	} catch (err) {
		console.log('weijie', err);
	}
});
ipcRenderer.on(ipcField.responseError, (event, response) => {
	const { type, data } = response;
	console.log('weijie-err', type);
	console.log('weijie-err', JSON.parse(data));
});



// function nodeRequestResponse(event, data) {
// 	// const { type, data } = response;
// }

// function nodeRequestResponseError(event, data) {}

// ipcRenderer.on('ipc-request-response', (event, response) => {
// 	let { type, data } = response;
// 	console.log('weijie', type);
// 	try {
// 		data = JSON.parse(data);
// 		console.log('weijie---', data);
// 	} catch (err) {
// 		console.log('weijie', err);
// 	}
// });
// ipcRenderer.on('ipc-request-response-err', (event, response) => {
// 	const { type, data } = response;
// 	console.log('weijie-err', type);
// 	console.log('weijie-err', JSON.parse(data));
// });
// export const request = (url, params, option) => {
// 	ipcRenderer.send('node-request', url, params, option);
// };

// request(getPersonalizedUrl, {}, { type: '123', value: '3333' });
// request(login, { phone: 18620813846, password: 'zrf9520' });
