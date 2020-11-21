import requestMap from '../request/index';
import { IModal } from '../utils/enhanceRedux/index.d';

const modal: IModal = {
  namespace: 'player',
  state: {
    // 是否展示播放野详情
    isShowPlayDetailPage: false,
    // 播放列表展示
    playerList: [],
    // 播放列表， 和 playerList 无关
    currentPlayerList: [],
    // 0: 循环 ； 1 顺序； 2 随机； 3 单曲
    playMode: 0,
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

export default modal;
