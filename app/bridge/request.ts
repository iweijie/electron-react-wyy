import { session, ipcMain, dialog } from 'electron';
import { get, map, split, join, isEmpty } from 'lodash';
import request from 'request';
import config from '../config';
import { getCookie, setCookie } from './cookies';

let cookiesStr = '';

const showMessageBox = function ({
  title = 'title',
  type = 'error',
  message = '无',
}) {
  dialog.showMessageBox({
    title,
    type,
    message,
  });
};

function joinParams(url, params = {}) {
  const query = Object.keys(params)
    .map((key) => {
      return `${key}=${params[key]}`;
    })
    .join('&');
  if (query) {
    url += `?${query}`;
  }
  return url;
}

function formatCookie(cookiesList = []) {
  return map(cookiesList, (cookie) => {
    const item = split(cookie, ';');
    const [name, value] = split(item[0], '=');
    const [p1, expirationDate] = split(item[1], '=');
    const [p2, Path] = split(item[2], '=');
    return {
      name,
      value,
      Path,
      expirationDate: Math.floor(new Date(expirationDate).getTime() / 1000),
    };
  });
}

function httpRequest(url, params = {}, other) {
  return new Promise((resolve, reject) => {
    request.get(joinParams(url, params), other, (error, response, body) => {
      if (error) return reject(error);
      const setCookieList =
        get(response, 'headers.set-cookie') ||
        get(response, 'headers.set-cookie2') ||
        [];
      if (!isEmpty(setCookieList)) {
        const cookiesList = formatCookie(setCookieList);
        cookiesList.forEach((cookie) => {
          setCookie(cookie);
        });
      }
      return resolve(body);
    });
  });
}

export default (win) => {
  ipcMain.on('node-get-cookie', (event) => {
    getCookie(config.address)
      .then((list) => {
        if (!isEmpty(list)) {
          cookiesStr = join(
            map(list, (item) => {
              const name = get(item, 'name', '');
              const value = get(item, 'value', '');
              return `${name}=${value}`;
            }),
            '; '
          );
        }
        return cookiesStr;
      })
      .then((cookies) => {
        win.webContents.send('node-cookies', cookies);
      })
      .catch((err) => {
        showMessageBox({
          title: 'cookie获取失败',
          message: JSON.stringify(err),
        });
      });
  });

  ipcMain.on('node-request', async (event, urlStr, params, option = {}) => {
    // const {protocol,host} = url.parse(urlStr);
    let promise;
    if (cookiesStr) {
      promise = Promise.resolve(cookiesStr);
    } else {
      promise = getCookie(config.address).then((list) => {
        if (!isEmpty(list)) {
          cookiesStr = join(
            map(list, (item) => {
              const name = get(item, 'name', '');
              const value = get(item, 'value', '');
              return `${name}=${value}`;
            }),
            '; '
          );
        }
        return cookiesStr;
      });
    }
    promise
      .then((cookies) => {
        console.log('------cookies--------:', cookies);
        return httpRequest(urlStr, params, {
          timeout: 3000,
          headers: {
            'content-type': 'application/json',
            Cookie: cookies,
          },
        });
      })
      .then((data) => {
        win.webContents.send('ipc-request-response', {
          ...option,
          data,
        });
      })
      .catch((err) => {
        showMessageBox({
          title: 'urlStr 请求失败',
          message: JSON.stringify(err),
        });
        win.webContents.send('ipc-request-response-err', {
          ...option,
          data: err,
        });
      });
  });
};
