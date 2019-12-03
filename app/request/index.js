import { get } from 'lodash';
import { axiosGet } from './axios';
import { songListUrl, getBannerUrl } from './api';

// 获取轮播图列表
export function getBanner(type = 0) {
  return axiosGet(getBannerUrl, { type }).then(res => {
    if (get(res, 'code') === 200) {
      return get(res, 'banners', []);
    }
    return [];
  });
}
