import { __DO_NOT_USE__ActionTypes } from 'redux';

/**
 * @param {Boolean} condition 为否时触发
 * @param {String} message 信息
 * @returns {void}
 */

export const isProduction = process.env.NODE_ENV === 'production';

export function warning(condition, message) {
	if (!!condition) return;
	if (typeof console !== 'undefined' && typeof console.error === 'function') {
		console.error(message);
	}
	try {
		throw new Error(message);
	} catch (e) {}
}

export function isArray(arr) {
	return Array.isArray(arr);
}

export function isReduxPrimitiveType(type) {
	return type === __DO_NOT_USE__ActionTypes['INIT'] || type === __DO_NOT_USE__ActionTypes['REPLACE'];
}

export const defaultAction = (state) => state;

export const randomName = (prefix = '') =>
	`${prefix}_${String(Date.now()).slice(7)}_${Math.random().toString().slice(2, 8)}`;

export const getUniqueness = (str = 'uniqueness') => {
	if (Symbol) return Symbol();
	return randomName(str);
};

export const print = (actionType) => {
	if (isProduction) return;
	console.log(`调用了 %c ${actionType}`, 'font-size:14px;color:#ff8400;');
};
