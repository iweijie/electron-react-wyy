import requestMap from '../request/index';
import { get, split, slice, filter } from 'lodash';

function lyricFormat(lyric) {
	const newArr = [];
	if (!lyric) return newArr;
	// const num = str.indexOf('[00:');
	// const b = str.slice(num);
	const arr = filter(split(lyric, '\n'), Boolean);

	for (let i = arr.length - 1; i >= 0; i--) {
		if (!arr[i]) continue;
		const a = split(arr[i].slice(1), ']');
		a[0] = getTime(a[0]);
		newArr.push(a);
	}

	return newArr.reverse();
}

function getTime(str) {
	const likeList = /^(\d{2}):(\d{2})(\.?\d*)$/.exec(str);
	return Number(get(likeList, '1', 0)) * 60 + Number(get(likeList, '2', 0)) + Number(get(likeList, '3', 0));
}

export default {
	namespace: 'playSongDetail',
	state: {
		// 当前列表播放歌曲id
		// currentPlaySongId: '426881573',
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
			put('playSongDetail/info', info);
		},
		async getLyric({ call, put, state, rootState }, id) {
			const lyricInfo = await requestMap.requestGetLyric({ id });
			const nolyric = get(lyricInfo, 'nolyric', false);
			console.log('lyricInfo:', lyricInfo);
			const lyric = nolyric ? [ 0, '纯音乐，请您欣赏' ] : lyricFormat(get(lyricInfo, 'lrc.lyric', ''));
			console.log('lyric:', lyric);
			put('playSongDetail/lyric', lyric);
		}
	}
};
