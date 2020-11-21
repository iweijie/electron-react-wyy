import {
  WINDOW_STATE_HIDE,
  WINDOW_STATE_NORMAL,
  WINDOW_STATE_MIN,
  WINDOW_STATE_MAX,
  HISTORY_STATE_CHANGE,
} from './quiescent';
import requestMap from '../request/index';
import { getStore, setStore } from '../utils/index';
import { IModal } from '../utils/enhanceRedux/index.d';

const modal: IModal = {
  namespace: 'common',
  state: {
    version: '0.0.1',
    // 窗口状态
    //  1: 隐藏 2：最小化；3：正常；4：最大化
    // [ WINDOW_STATE_HIDE, WINDOW_STATE_MIN, WINDOW_STATE_NORMAL, WINDOW_STATE_MAX ];
    windowState: WINDOW_STATE_NORMAL,
    // 历史记录， 用于标识顶部导航是否可以 前进后退
    historyState: {
      isBack: true,
      isForward: true,
    },
    userInfo: null,
  },
  reducers: {
    handleChangeWindowState({ state }, payload) {
      return {
        ...state,
        windowState: payload,
      };
    },
    handleChangeHistoryState({ state, rootState }) {
      return {
        ...state,
        historyState: payload,
      };
    },
  },
  effects: {
    async login({ call, push, state, rootState }, payload) {
      let userInfo = getStore('userInfo');
      if (!userInfo) {
        payload = { phone: 18620813846, password: 'zrf9520' };
        userInfo = await requestMap.requestLogin(payload);
        setStore('userInfo', userInfo);
      }

      push('common/userInfo', userInfo);

      return userInfo;
    },
  },
};
export default modal;
