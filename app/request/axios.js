import axios from 'axios';
import { get, isEmpty } from 'lodash';
import { formatCookie, setCookie, getCookie } from '../utils/cookies';

axios.interceptors.request.use(
	(config) => {
		return config;
	},
	(error) => Promise.reject(error)
);

axios.interceptors.response.use(
	(response) => {
		const setCookieList = get(response, 'headers.set-cookie');
		if (!isEmpty(setCookieList)) {
			const cookiesList = formatCookie(setCookieList);
			cookiesList.forEach((cookie) => {
				setCookie(cookie);
			});
		}
		return response;
	},
	(error) => Promise.reject(error)
);

export function checkStatus(response) {
	if (response.status >= 200 && response.status < 300) {
		return response.data;
	}
	const error = new Error(response.statusText);
	error.response = response;
	throw error;
}

export function axiosGet(url, params = {}) {
	return axios
		.get(url, {
			params,
			headers: {
				'content-type': 'application/json',
				Cookie: getCookie()
			},
			withCredentials: true
		})
		.then(checkStatus);
}
