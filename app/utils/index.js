import { setCookie } from "../bridge/cookies";

/**
 * 存储localStorage
 */
export const setStore = (name, content) => {
	if (!name) return;
	if (typeof content !== 'string') {
		content = JSON.stringify(content);
	}
	window.localStorage.setItem(name, content);
};

/**
 * 获取localStorage
 */
export const getStore = (name) => {
	if (!name) return;
	return JSON.parse(window.localStorage.getItem(name));
};

/**
 * 删除localStorage
 */
export const removeStore = (name) => {
	if (!name) return;
	window.localStorage.removeItem(name);
};
/**
 * 存储sessionStorage
 */
export const setSessionStore = (name, content) => {
	if (!name) return;
	if (typeof content !== 'string') {
		content = JSON.stringify(content);
	}
	window.sessionStorage.setItem(name, content);
};

/**
 * 获取sessionStorage
 */
export const getSessionStore = (name) => {
	if (!name) return;
	return JSON.parse(window.sessionStorage.getItem(name));
};

/**
 * 删除sessionStorage
 */
export const removeSessionStore = (name) => {
	if (!name) return;
	window.sessionStorage.removeItem(name);
};

/**
 * 获取style样式
 */
export const getStyle = (element, attr, NumberMode = 'int') => {
	let target;
	// scrollTop 获取方式不同，没有它不属于style，而且只有document.body才能用
	if (attr === 'scrollTop') {
		target = element.scrollTop;
	} else if (element.currentStyle) {
		target = element.currentStyle[attr];
	} else {
		target = document.defaultView.getComputedStyle(element, null)[attr];
	}
	//在获取 opactiy 时需要获取小数 parseFloat
	return NumberMode == 'float' ? parseFloat(target) : parseInt(target);
};

