import requestMap from '../request/index';
import { IModal } from '../utils/enhanceRedux/index.d';

const modal: IModal = {
  namespace: 'recommendation',
  state: {
    bannerList: [],
    personalizedList: [],
    recommendSongsList: [],
  },
  reducers: {},
  effects: {
    async getBanner({ push, state, rootState }, name) {
      const list = await requestMap.requestGetBanner();
      push('recommendation/bannerList', list);
      return list;
    },

    async getPersonalized({ call, push, state, rootState }, name) {
      const list = await requestMap.requestGetPersonalized();
      push('recommendation/personalizedList', list.slice(0, 9));
    },
    async getRecommendSongs({ call, push, state, rootState }, name) {
      const list = await requestMap.requestRecommendSongs();
      push('recommendation/recommendSongsList', list);
    },
  },
};

export default modal;
