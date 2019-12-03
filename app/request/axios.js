import axios from 'axios';
// import { set } from 'lodash';
// import { login } from './api';

// const cookie =
// 'MUSIC_U=e6ef5e2ad0a6cf9c08a8c3df614b9a99e7a2fd7fe784da28c1a7d18e871c0254495a23675c8d37ab0e18e379e5c29000384fe0dd1eca3a5f; __csrf=2d15601c1b1fa307d6606644771a641f; appver=1.5.9; os=osx; channel=netease; osver=%E7%89%88%E6%9C%AC%2010.13.2%EF%BC%88%E7%89%88%E5%8F%B7%2017C88%EF%BC%89';

axios.interceptors.request.use(
  config =>
    // 在发送请求之前做些什么
    // console.log('config:', config);
    // set(config, 'headers.cookie', cookie);
    config,
  error =>
    // 对请求错误做些什么
    Promise.reject(error)
);

export function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response.data;
  }
  const error = new Error(response.statusText);
  error.response = response;
  throw error;
}

export function axiosGet(url, params) {
  let str = `${url}?`;
  Object.keys(params).forEach(k => {
    str += `${k}=${params[k]}&`;
  });
  // for (let k in params) {
  // 	str += `${k  }=${  params[k]  }&`;
  // }
  str = str.slice(0, str.length - 1);
  return axios
    .get(str, {
      withCredentials: true
    })
    .then(checkStatus);
}
