import { get } from 'lodash';
import { axiosGet } from './axios';

// const host = 'http://5fan.win:3000';
// const host = 'http://localhost:3000';
const host = 'http://wangyiyun.iweijie.cn';
const apis = {
	// 登入
	requestLogin: {
		url: host + '/login/cellphone',
		defaultValue: {}
	},
	// 获取歌单
	requestSongList: {
		url: host + '/user/playlist'
	},
	// 获取歌单详细信息
	requestSongListDetail: {
		url: host + '/playlist/detail'
	},
	// 获取歌曲url
	requestGetSong: {
		url: host + '/song/url',
		field: 'data.0',
		defaultValue: {}
	},
	// 获取歌词url
	requestGetLyric: {
		url: host + '/lyric',
		// field: 'lrc.lyric',
		defaultValue: []
	},
	// 精选电台
	requestSongDetail: {
		url: host + '/song/detail',
		field: 'songs.0',
		defaultValue: {}
	},
	// 获取歌词评论
	requestGetMusicComment: {
		url: host + '/comment/music'
	},
	// 获取轮播图
	requestGetBanner: {
		url: host + '/banner',
		defaultValue: [],
		field: 'banners'
	},
	// 获取个性化歌单  推荐歌单
	requestGetPersonalized: {
		url: host + '/personalized',
		field: 'result'
	},
	// 获取独家放送  独家放送
	requestGetPrivatecontent: {
		url: host + '/personalized/privatecontent'
	},
	// 获取最新音乐  最新音乐
	requestGetNewsong: {
		url: host + '/personalized/newsong'
	},
	// 获取私人FM
	requestPersonalFm: {
		url: host + '/personal_fm'
	},
	// 获取每日推荐歌曲
	requestRecommendSongs: {
		url: host + '/recommend/songs',
		field: 'recommend',
		defaultValue: []
	},
	// 获取每日推荐mv
	requestRecommendMv: {
		url: host + '/personalized/mv'
	},
	// 精选电台
	requestRecommendDj: {
		url: host + '/dj/program'
	},
	// 获取歌单列表
	requestPlaylist: {
		url: host + '/playlist/catlist'
	},
	// 获取热门标签分类
	requestTaglist: {
		url: host + '/playlist/hot'
	}
};
const requestMap = {};
Object.keys(apis).forEach((requestKey) => {
	requestMap[requestKey] = function(params = {}) {
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
