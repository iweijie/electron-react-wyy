import requestMap from '../request/index';

export default {
  namespace: 'player',
  state: {
    // 是否展示播放野详情
    isShowPlayDetailPage: false,
    playerList: [],
    // 1: 循环 ； 2 随机； 3 单曲
    playMode: 1,
    // 1:播放列表；2：历史记录
    tabIndex: 1,
    // 当前列表播放歌曲
    currentPlaySong: null,
    // 当前列表播放歌曲id
    currentPlaySongId: '',
    // currentPlaySongId: ''
  },
  reducers: {
    changePlayMode({ state }, payload) {
      return {
        ...state,
        playMode: payload || 1,
      };
    },
    changePlayMore({ state }, payload = {}) {
      return {
        ...state,
        ...payload,
      };
    },
  },
  effects: {
    async getSongInfo({ call, push, state, rootState }, name) {
      const list = await requestMap.requestGetSong();
      push('recommendation/bannerList', list);
    },
  },
};
