import requestMap from '../request/index';

export default {
	namespace: 'playlist',
	state: {
    playlist: {
      all: {},
      sub: [],
      allCategories: []
    },
    taglist: []
	},
	reducers: {

  },
	effects: {
		async getTaglist({ call, put, state, rootState }, name) {
      const { tags } = await requestMap.requestTaglist();
			put('playlist/taglist', tags);
		},
		async getPlaylist({ call, put, state, rootState }, name) {
      let { all, categories, sub } = await requestMap.requestPlaylist();
      // 增加allCategories字段，将所有sub归类
      let allCategories = []
      for(let key in categories) {
        allCategories.push({
          category: +key,
          name: categories[key],
          sub: []
        })
      }
      sub.forEach(item => {
        allCategories.some(ele => {
          if (item.category === ele.category) {
            ele.sub.push(item);
            return true
          }
          return false
        })
      })
			put('playlist/playlist', {
        all,
        categories,
        sub,
        allCategories,
      });
		},
	}
};
