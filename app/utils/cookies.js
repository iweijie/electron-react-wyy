import electron, { ipcRenderer, remote } from 'electron';
import config from '../config';
import { get, join, map, split } from 'lodash';

const session = remote.getCurrentWindow().webContents.session;

export function formatCookie(cookiesList = []) {
	return map(cookiesList, (cookie) => {
		const item = split(cookie, ';');
		const [ name, value ] = split(item[0], '=');
		const [ placeholder1, expirationDate ] = split(item[1], '=');
		const [ placeholder2, Path ] = split(item[2], '=');
		return {
			name,
			value,
			Path,
			expirationDate: Math.floor(new Date(expirationDate).getTime() / 1000)
		};
	});
}

/**
 * 
 * @param {expirationDate} Number 秒
 */

export function setCookie({ url = config.address, name, value, expirationDate, path }) {
	return new Promise((resolve, reject) => {
		session.cookies.set({ url, name, value, expirationDate, path }, (err, cookies) => {
			if (err) return reject(err);
			resolve(cookies);
		});
	});
}

export function getCookie(url = config.address) {
	return new Promise((resolve, reject) => {
		session.cookies.get({ url }, (err, cookies) => {
			if (err) return reject(err);
			cookies = join(
				map(cookies, (item) => {
					const name = get(item, 'name', '');
					const value = get(item, 'value', '');
					return `${name}=${value}`;
				}),
				'; '
			);
			resolve(cookies);
		});
	});
}

export function removeCookie({ url, name }) {
	return new Promise((resolve, reject) => {
		session.cookies.remove(url, name, resolve);
	});
}
