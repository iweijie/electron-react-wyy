import requestMap from '../request/index';
import { get, split, slice, first, filter, isElement, isEmpty } from 'lodash';

import { IModal } from '../utils/enhanceRedux/index.d';

type IlyricItem = [number, string];

function lyricFormat(lyric: string) {
  const newArr: IlyricItem[] = [];
  if (!lyric) return newArr;
  const arr = filter(split(lyric, '\n'), Boolean);
  for (let i = arr.length - 1; i >= 0; i--) {
    if (!arr[i]) continue;
    const a = split(arr[i].slice(1), ']');
    const num = getTime(a[0]);
    newArr.push([num, a[1]]);
  }

  return newArr.reverse();
}

function getTime(str: string): number {
  const likeList = /^(\d{2}):(\d{2})(\.?\d*)$/.exec(str);
  return (
    Number(get(likeList, '1', 0)) * 60 +
    Number(get(likeList, '2', 0)) +
    Number(get(likeList, '3', 0))
  );
}

const modal: IModal = {
  namespace: 'playSongDetail',
  state: {
    // 当前显示详情的 id
    playDetialId: '',
    lyric: [],
    info: {},
    hotComment: {
      total: 0,
      pagination: false,
      list: [],
      page: 1,
      limit: 20,
    },
  },
  reducers: {
    setPlayDetailId({ state }, payload) {
      return {
        ...state,
        playDetialId: payload,
      };
    },
    setHotComment({ state }, payload) {
      return {
        ...state,
        hotComment: payload,
      };
    },
  },
  effects: {
    async getSongDetail({ call, push, state, rootState }, ids) {
      const info = await requestMap.requestSongDetail({ ids });
      const firstData = first(info);
      if (isEmpty(firstData)) return;
      push('playSongDetail/info', firstData);
    },
    async getLyric({ call, push, state, rootState }, id) {
      const lyricInfo = await requestMap.requestGetLyric({ id });
      const nolyric = get(lyricInfo, 'nolyric', false);
      const lyric = nolyric
        ? [0, '纯音乐，请您欣赏']
        : lyricFormat(get(lyricInfo, 'lrc.lyric', ''));
      push('playSongDetail/lyric', lyric);
      return lyric;
    },
    async getHotComment({ call, push, state, rootState }, id) {
      const { hotComment } = state;
      const commentInfo = await requestMap.requestGetHotComment({
        id,
        type: 0,
      });
      call('playSongDetail/setHotComment', {
        ...hotComment,
        list: get(commentInfo, 'hotComments'),
        total: get(commentInfo, 'total'),
      });
    },
  },
};

export default modal;
