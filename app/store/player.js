import requestMap from '../request/index';

export default {
	namespace: 'player',
	state: {
		playerList: [],
		// 1: 循环 ； 2 随机； 3 单曲
		playMode: 1,
		// 1:播放列表；2：历史记录
		tabIndex: 1,
		// 当前列表播放歌曲 在播放列表的索引
		currentIndex: 0,
		// 当前列表播放歌曲id
		currentPlaySongId: ''
	},
	reducers: {
		changePlayMode({ state }, payload) {
			return {
				...state,
				playMode: payload || 1
			};
		},
		changePlayMore({ state }, payload = {}) {
			return {
				...state,
				...payload
			};
		}
	},
	effects: {
		// async getSongInfo({ call, put, state, rootState }, name) {
		// 	const list = await requestMap.requestGetSong();
		// 	put('recommendation/bannerList', list);
		// }
	}
};
