import requestMap from '../request/index';

export default {
	namespace: 'player',
	state: {
		// 是否展示播放野详情
		isShowPlayDetailPage: true,
		// playerList: [],
		playerList:  [
			{
				name: '恰似你的温柔',
				id: 210837,
				position: 7,
				alias: [],
				status: 0,
				fee: 8,
				copyrightId: 13009,
				disc: '1',
				no: 7,
				artists: [
					{
						name: '蔡琴',
						id: 7220,
						picId: 0,
						img1v1Id: 0,
						briefDesc: '',
						picUrl: 'http://p1.music.126.net/6y-UleORITEDbvrOLV0Q8A==/5639395138885805.jpg',
						img1v1Url: 'http://p1.music.126.net/6y-UleORITEDbvrOLV0Q8A==/5639395138885805.jpg',
						albumSize: 0,
						alias: [],
						trans: '',
						musicSize: 0,
						topicPerson: 0
					}
				],
				album: {
					name: '精选蔡琴',
					id: 21397,
					type: '专辑',
					size: 16,
					picId: 91259465122612,
					blurPicUrl: 'http://p1.music.126.net/E_aLd6dbY6qa9hhfyvxckA==/91259465122612.jpg',
					companyId: 0,
					pic: 91259465122612,
					picUrl: 'http://p1.music.126.net/E_aLd6dbY6qa9hhfyvxckA==/91259465122612.jpg',
					publishTime: 965059200000,
					description: '',
					tags: '',
					company: 'EMI',
					briefDesc: '',
					artist: {
						name: '',
						id: 0,
						picId: 0,
						img1v1Id: 0,
						briefDesc: '',
						picUrl: 'http://p1.music.126.net/6y-UleORITEDbvrOLV0Q8A==/5639395138885805.jpg',
						img1v1Url: 'http://p1.music.126.net/6y-UleORITEDbvrOLV0Q8A==/5639395138885805.jpg',
						albumSize: 0,
						alias: [],
						trans: '',
						musicSize: 0,
						topicPerson: 0
					},
					songs: [],
					alias: [],
					status: 1,
					copyrightId: 13009,
					commentThreadId: 'R_AL_3_21397',
					artists: [
						{
							name: '蔡琴',
							id: 7220,
							picId: 0,
							img1v1Id: 0,
							briefDesc: '',
							picUrl: 'http://p1.music.126.net/6y-UleORITEDbvrOLV0Q8A==/5639395138885805.jpg',
							img1v1Url: 'http://p1.music.126.net/6y-UleORITEDbvrOLV0Q8A==/5639395138885805.jpg',
							albumSize: 0,
							alias: [],
							trans: '',
							musicSize: 0,
							topicPerson: 0
						}
					],
					subType: '录音室版',
					transName: null,
					mark: 0
				},
				starred: false,
				popularity: 100,
				score: 100,
				starredNum: 0,
				duration: 255000,
				playedNum: 0,
				dayPlays: 0,
				hearTime: 0,
				ringtone: '600902000004447358',
				crbt: null,
				audition: null,
				copyFrom: '',
				commentThreadId: 'R_SO_4_210837',
				rtUrl: null,
				ftype: 0,
				rtUrls: [],
				copyright: 1,
				transName: null,
				sign: null,
				mark: 0,
				hMusic: {
					name: null,
					id: 63948766,
					size: 10204665,
					extension: 'mp3',
					sr: 44100,
					dfsId: 0,
					bitrate: 320000,
					playTime: 255000,
					volumeDelta: 5897
				},
				mMusic: {
					name: null,
					id: 93798128,
					size: 6122876,
					extension: 'mp3',
					sr: 44100,
					dfsId: 0,
					bitrate: 192000,
					playTime: 255000,
					volumeDelta: 7953
				},
				lMusic: {
					name: null,
					id: 63948767,
					size: 4081981,
					extension: 'mp3',
					sr: 44100,
					dfsId: 0,
					bitrate: 128000,
					playTime: 255000,
					volumeDelta: 9084
				},
				bMusic: {
					name: null,
					id: 63948767,
					size: 4081981,
					extension: 'mp3',
					sr: 44100,
					dfsId: 0,
					bitrate: 128000,
					playTime: 255000,
					volumeDelta: 9084
				},
				mvid: 0,
				rtype: 0,
				rurl: null,
				mp3Url: null,
				reason: '根据你可能喜欢的单曲 当爱已成往事',
				privilege: {
					id: 210837,
					fee: 8,
					payed: 0,
					st: 0,
					pl: 128000,
					dl: 0,
					sp: 7,
					cp: 1,
					subp: 1,
					cs: false,
					maxbr: 999000,
					fl: 128000,
					toast: false,
					flag: 0,
					preSell: false
				},
				alg: 'itembased'
			}
		],
		// 1: 循环 ； 2 随机； 3 单曲
		playMode: 1,
		// 1:播放列表；2：历史记录
		tabIndex: 1,
		// 当前列表播放歌曲
		currentPlaySong: null,
		// 当前列表播放歌曲id
		currentPlaySongId: '210837'
		// currentPlaySongId: ''
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
