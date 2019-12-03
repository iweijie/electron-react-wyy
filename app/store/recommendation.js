import { getBanner } from '../request/index';

export default {
  namespace: 'recommendation',
  state: {
    bannerList: []
  },
  reducers: {},
  effects: {
    async getBanner({ call, put, state, rootState }, name) {
      const list = await getBanner();
      call('recommendation/bannerList', list);
    }
  }
};
