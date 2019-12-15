import requestMap from '../request/index';
import { get } from 'lodash';

function lyricFormat(str) {
	const newArr = [];
	if (!str) return newArr;
	const num = str.indexOf('[00:');
	str = str.slice(num);
	const arr = str.split('[');
	for (let i = arr.length - 1; i >= 1; i--) {
		if (!arr[i]) continue;
		const a = arr[i].split(']');
		if (a[1] == '\r' || a[1] == '\n' || a[1] == '') continue;
		newArr.unshift(a);
	}
	return newArr;
}

export default {
	namespace: 'playSongDetail',
	state: {
		// 当前列表播放歌曲id
		currentPlaySongId: '210837',
		lyric: [],
		info: {}
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
		async getSongDetail({ call, put, state, rootState }, ids) {
			const info = await requestMap.requestSongDetail({ ids });
			put('player/info', info);
		},
		async getLyric({ call, put, state, rootState }, id) {
			const lyricInfo = await requestMap.requestGetLyric({ id });
			const nolyric = get(lyricInfo, 'nolyric', false);
			const lyric = nolyric ? [ 0, '纯音乐，请您欣赏' ] : lyricFormat(get(lyricInfo, 'lrc.lyric', ''));
			put('player/lyric', lyric);
		}
	}
};
