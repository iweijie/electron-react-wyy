import requestMap from '../request/index';

export default {
	namespace: 'recommendation',
	state: {
		bannerList: [],
		personalizedList: [],
		recommendSongsList: []
	},
	reducers: {},
	effects: {
		async getBanner({ call, put, state, rootState }, name) {
			const list = await requestMap.requestGetBanner();
			put('recommendation/bannerList', list);
			return list;
		},

		async getPersonalized({ call, put, state, rootState }, name) {
			const list = await requestMap.requestGetPersonalized();
			put(
				'recommendation/personalizedList',
				list
					// .sort((a, b) => {
					// 	return b.playCount - a.playCount;
					// })
					.slice(0, 9)
			);
		},

		async getRecommendSongs({ call, put, state, rootState }, name) {
			const list = await requestMap.requestRecommendSongs();
			put('recommendation/recommendSongsList', list);
		}
	}
};
