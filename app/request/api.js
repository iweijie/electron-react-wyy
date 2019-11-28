/*
* @Author: weijie
* @Date:   2017-10-05 18:05:46
* @Last Modified by:   weijie
* @Last Modified time: 2017-11-01 14:24:33
*/
// const host = 'http://5fan.win:3000';
// const host = 'http://localhost:3000';
const host = 'http://wangyiyun.iweijie.cn';

export const login = host + '/login/cellphone'; // 登入
export const songListUrl = host + '/user/playlist'; //获取歌单
export const songListDetailUrl = host + '/playlist/detail'; // 获取歌单详细信息
export const getSongUrl = host + '/music/url'; // 获取歌曲url
export const getLyricUrl = host + '/lyric'; // 获取歌词url
export const getMusicCommentUrl = host + '/comment/music'; // 获取歌词评论
export const getBannerUrl = host + '/banner'; // 获取轮播图
export const getPersonalizedUrl = host + '/personalized'; // 获取个性化歌单  推荐歌单
export const getPrivatecontentUrl = host + '/personalized/privatecontent'; // 获取独家放送  独家放送
export const getNewsongUrl = host + '/personalized/newsong'; // 获取最新音乐  最新音乐
export const personal_fm_Url = host + '/personal_fm'; // 获取私人FM
export const recommend_songs = host + '/recommend/songs'; // 获取每日推荐歌曲
export const recommend_mv = host + '/personalized/mv'; // 获取每日推荐mv
// export const recommend_dj = host + '/dj/recommend'; // 精选电台
// export const recommend_dj = host + '/dj/hot'; // 精选电台
export const recommend_dj = host + '/dj/program'; // 精选电台