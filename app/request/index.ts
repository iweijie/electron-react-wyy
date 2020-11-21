import { get } from 'lodash';
import { axiosGet } from './axios';

interface IApis {
  [x: string]: IApiItem;
}

interface IApiItem {
  url: string;
  defaultValue?: any;
  field?: string;
}

// interface IRequestData {
//   code: number;
//   data: any;
//   msg: string;
// }

interface IRequestMap {
  [x: string]: (a?: any) => Promise<any>;
}

// const host = 'http://5fan.win:3000';
// const host = 'http://localhost:3000';
const host = 'https://wangyiyun.iweijie.cn';
const apis: IApis = {
  // 登入
  requestLogin: {
    url: `${host}/login/cellphone`,
    defaultValue: {},
  },
  // 获取歌单
  requestSongList: {
    url: `${host}/user/playlist`,
  },
  // 获取歌单详细信息
  requestSongListDetail: {
    url: `${host}/playlist/detail`,
  },
  // 获取歌曲url
  requestGetSong: {
    url: `${host}/song/url`,
    field: 'data.0',
    defaultValue: {},
  },
  // 获取歌词url
  requestGetLyric: {
    url: `${host}/lyric`,
    // field: 'lrc.lyric',
    defaultValue: [],
  },
  /**
   * 依据 id 获取歌曲详情列表
   * url?ids=123  or  url?ids=123,456,789
   */
  requestSongDetail: {
    url: `${host}/song/detail`,
    field: 'songs',
    defaultValue: [],
  },
  // 获取歌词评论
  requestGetMusicComment: {
    url: `${host}/comment/music`,
  },
  // 获取热门评论
  // 参数 ：  type  --- 包含：  0: 歌曲 1: mv 2: 歌单 3: 专辑 4: 电台 5: 视频 6: 动态
  // 					id
  requestGetHotComment: {
    url: `${host}/comment/hot`,
    // field: 'hotComments',
    defaultValue: {},
  },
  // 获取轮播图
  requestGetBanner: {
    url: `${host}/banner`,
    defaultValue: [],
    field: 'banners',
  },
  // 获取个性化歌单  推荐歌单
  requestGetPersonalized: {
    url: `${host}/personalized`,
    field: 'result',
  },
  // 获取独家放送  独家放送
  requestGetPrivatecontent: {
    url: `${host}/personalized/privatecontent`,
  },
  // 获取最新音乐  最新音乐
  requestGetNewsong: {
    url: `${host}/personalized/newsong`,
  },
  // 获取私人FM
  requestPersonalFm: {
    url: `${host}/personal_fm`,
  },
  // 获取每日推荐歌曲
  requestRecommendSongs: {
    url: `${host}/recommend/songs`,
    field: 'recommend',
    defaultValue: [],
  },
  // 获取每日推荐mv
  requestRecommendMv: {
    url: `${host}/personalized/mv`,
  },

  // 精选电台
  requestRecommendDj: {
    url: `${host}/dj/program`,
  },
  // 获取歌单列表
  requestPlaylist: {
    url: `${host}/playlist/catlist`,
  },
  // 获取热门标签分类
  requestTagList: {
    url: `${host}/playlist/hot`,
  },
};

const requestMap: IRequestMap = {};
Object.keys(apis).forEach((requestKey) => {
  requestMap[requestKey] = function (params = {}) {
    const { url, defaultValue = {}, field } = apis[requestKey];
    return axiosGet(url, params).then((res) => {
      if (get(res, 'code') === 200) {
        if (!field) return res;
        return get(res, field, defaultValue);
      }
      return defaultValue;
    });
  };
});

export default requestMap;
