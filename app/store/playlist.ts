import requestMap from '../request/index';

export default {
  namespace: 'playlist',
  state: {
    playlist: {
      all: {},
      sub: [],
      allCategories: [],
    },
    taglist: [],
  },
  reducers: {},
  effects: {
    async getTaglist({ call, push, state, rootState }, name) {
      const { tags } = await requestMap.requestTagList();
      push('playlist/taglist', tags);
    },
    async getPlaylist({ call, push, state, rootState }, name) {
      let { all, categories, sub } = await requestMap.requestPlaylist();
      // 增加allCategories字段，将所有sub归类
      let allCategories = [];
      for (let key in categories) {
        allCategories.push({
          category: +key,
          name: categories[key],
          sub: [],
        });
      }
      sub.forEach((item) => {
        allCategories.some((ele) => {
          if (item.category === ele.category) {
            ele.sub.push(item);
            return true;
          }
          return false;
        });
      });
      push('playlist/playlist', {
        all,
        categories,
        sub,
        allCategories,
      });
    },
  },
};
