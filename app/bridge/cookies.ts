import { session } from 'electron';
import config from '../config';

export function getCookie(url = config.address) {
  return new Promise((resolve, reject) => {
    session.defaultSession.cookies.get({ url }, (err, cookies) => {
      if (err) return reject(err);
      resolve(cookies);
    });
  });
}

export function setCookie({
  url = config.address,
  name,
  value,
  expirationDate,
  path,
}) {
  return new Promise((resolve, reject) => {
    session.defaultSession.cookies.set(
      { url, name, value, expirationDate, path },
      (err, cookies) => {
        if (err) return reject(err);
        resolve(cookies);
      }
    );
  });
}

export function removeCookie({ url, name }) {
  return new Promise((resolve, reject) => {
    session.defaultSession.cookies.remove(url, name, resolve);
  });
}
