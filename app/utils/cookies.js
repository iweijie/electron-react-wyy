import { setStore, getStore, setSessionStore, getSessionStore } from './index';
import { get, join, map, split } from 'lodash';

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
			expirationDate: Math.floor(new Date(expirationDate).getTime())
		};
	});
}

const field = '__cookie';

/**
 * 
 * @param {expirationDate} Number 时间戳，到截止时间的时间戳
 */
export const setCookie = ({ name, value, path = '/', domain, expirationDate = 0 }) => {
	//只存有  wangyiyun 的 cookie  ； 所以暂时不分区
	let cookies;
	if (!expirationDate || expirationDate < 0) {
		cookies = getSessionStore(field) || [];
		cookies.push({ name, value, path, expirationDate });
		setSessionStore(field, cookies);
	} else {
		cookies = getStore(field) || [];
		cookies.push({ name, value, path, expirationDate });
		const now = Date.now();
		cookies = cookies.filter((cookie) => cookie.expirationDate >= now);
		setStore(field, cookies);
	}
};

export const getCookie = () => {
	const now = Date.now();
	let store = getStore(field) || [];
	store = store.filter((cookie) => cookie.expirationDate >= now);
	const sessionStore = getSessionStore(field) || [];

	const cookies = [ ...store, ...sessionStore ];
	return join(
		map(cookies, (item) => {
			const name = get(item, 'name', '');
			const value = get(item, 'value', '');
			return `${name}=${value}`;
		}),
		'; '
	);
};
