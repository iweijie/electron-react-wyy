import requestMap from '../request/index';

export default {
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
      push(
        'recommendation/personalizedList',
        list
          // .sort((a, b) => {
          // 	return b.playCount - a.playCount;
          // })
          .slice(0, 9)
      );
    },
    async getRecommendSongs({ call, push, state, rootState }, name) {
      const list = await requestMap.requestRecommendSongs();
      push('recommendation/recommendSongsList', list);
    },
  },
};
