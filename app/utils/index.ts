import { setCookie } from '../bridge/cookies';
import { isNaN } from 'lodash';
import './mainInfo';

/**
 * 存储localStorage
 */

export const setStore = (name: string, content: any) => {
  if (!name) return;
  window.localStorage.setItem(name, JSON.stringify(content));
};

/**
 * 获取localStorage
 */
export const getStore = (name: string) => {
  if (!name) return;
  // eslint-disable-next-line consistent-return
  return JSON.parse((window.localStorage.getItem(name) as string) || '');
};

/**
 * 删除localStorage
 */
export const removeStore = (name: string) => {
  if (!name) return;
  window.localStorage.removeItem(name);
};
/**
 * 存储sessionStorage
 */
export const setSessionStore = (name: string, content: any) => {
  if (!name) return;
  window.sessionStorage.setItem(name, JSON.stringify(content));
};

/**
 * 获取sessionStorage
 */
export const getSessionStore = (name: string) => {
  if (!name) return '';
  return JSON.parse((window.sessionStorage.getItem(name) as string) || '');
};

/**
 * 删除sessionStorage
 */
export const removeSessionStore = (name: string) => {
  if (!name) return;
  window.sessionStorage.removeItem(name);
};

/**
 * 获取style样式
 */
interface IElement extends HTMLElement {
  currentStyle?: {
    [x: string]: any;
  };
}

export const getStyle = (
  element: IElement,
  attr: string,
  NumberMode = 'int'
) => {
  let target;
  // scrollTop 获取方式不同，没有它不属于style，而且只有document.body才能用
  if (attr === 'scrollTop') {
    target = element.scrollTop;
  } else if (element.currentStyle) {
    target = element.currentStyle[attr];
  } else {
    target = (document as any).defaultView.getComputedStyle(element, null)[
      attr
    ];
  }
  // 在获取 opactiy 时需要获取小数 parseFloat
  return NumberMode === 'float' ? parseFloat(target) : parseInt(target, 10);
};
/**
 *
 * @param {Function} callback 回调
 * @param {Number} duration 延时
 * @return {Function} 停止方法
 */
export const loopCallback = (callback: () => void, duration: number) => {
  const time = Date.now();
  let flag = true;
  function call() {
    if (flag && Date.now() - time >= duration && callback) callback();
    window.requestAnimationFrame(call);
  }
  window.requestAnimationFrame(call);
  return () => {
    flag = false;
  };
};

/**
 * @param {Number} 时间 （秒）
 * @return {String} 00:00
 */
export function getFormatTime(num: number): string {
  if (isNaN(num)) return '00:00';
  if (!num) return '00:00';
  num = Math.floor(num);
  let minute: number | string = Math.floor(num / 60);
  let second: number | string = num % 60;
  if (second < 10) {
    second = `0${second}`;
  }
  if (minute < 10) {
    minute = `0${minute}`;
  }
  return `${minute}:${second}`;
}

export const getNodePosition = function (node: HTMLElement) {
  let left = node.offsetLeft; // 获取元素相对于其父元素的left值var left
  let top = node.offsetTop;
  let current = node.offsetParent as HTMLElement; // 取得元素的offsetParent
  // 一直循环直到根元素

  while (current != null) {
    left += current.offsetLeft;
    top += current.offsetTop;
    current = current.offsetParent as HTMLElement;
  }
  return {
    left,
    top,
  };
};

export const formatDate = (date: number | Date, fmt: string) => {
  if (typeof date === 'number') {
    date = new Date(date);
  }

  const o: any = {
    'M+': date.getMonth() + 1, // 月份
    'd+': date.getDate(), // 日
    'h+': date.getHours(), // 小时
    'm+': date.getMinutes(), // 分
    's+': date.getSeconds(), // 秒
    'q+': Math.floor((date.getMonth() + 3) / 3), // 季度
    S: date.getMilliseconds(), // 毫秒
  };
  if (/(y+)/.test(fmt))
    fmt = fmt.replace(
      RegExp.$1,
      `${date.getFullYear()}`.substr(4 - RegExp.$1.length)
    );
  // eslint-disable-next-line no-restricted-syntax
  for (const k in o)
    if (new RegExp(`(${k})`).test(fmt)) {
      fmt = fmt.replace(
        RegExp.$1,
        RegExp.$1.length === 1 ? o[k] : `00${o[k]}`.substr(`${o[k]}`.length)
      );
    }
  return fmt;
};

export const getFormatCount = (num: number): string => {
  return num > 10000 ? `${Math.floor(num / 10000)}万` : num.toString();
};
