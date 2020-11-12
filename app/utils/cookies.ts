import electron, { ipcRenderer, remote } from 'electron';
import config from '../config';
import { get, join, map, split } from 'lodash';

const { session } = remote.getCurrentWindow().webContents;

export function formatCookie(cookiesList = []): ISetCookie[] {
  return map(cookiesList, (cookie) => {
    const item = split(cookie, ';');
    const [name, value] = split(item[0], '=');
    const [placeholder1, expirationDate] = split(item[1], '=');
    const [placeholder2, path] = split(item[2], '=');
    return {
      name,
      value,
      path,
      expirationDate: Math.floor(new Date(expirationDate).getTime() / 1000),
    };
  });
}

/**
 *
 * @param {expirationDate} Number 秒
 */

export interface ISetCookie {
  url?: string;
  name: string;
  value: string;
  expirationDate: number;
  path: string;
}

export function setCookie({
  url = config.address,
  name,
  value,
  expirationDate,
  path,
}: ISetCookie) {
  return session.cookies.set({ url, name, value, expirationDate, path });
}

interface IGetCookieItem {
  name: string;
  value: string;
}
export function getCookie(url = config.address) {
  return session.cookies
    .get({ url })
    .then((cookies: IGetCookieItem[]) => {
      return join(
        map(cookies, (item) => {
          const name = get(item, 'name', '');
          const value = get(item, 'value', '');
          return `${name}=${value}`;
        }),
        '; '
      );
    })
    .catch((err) => {
      console.error(err);
      return '';
    });
}

interface IRemoveCookieParams {
  url: string;
  name: string;
}

export function removeCookie({ url, name }: IRemoveCookieParams) {
  return session.cookies.remove(url, name);
}
