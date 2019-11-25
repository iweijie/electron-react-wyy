import {
	WINDOW_STATE_HIDE,
	WINDOW_STATE_NORMAL,
	WINDOW_STATE_MIN,
	WINDOW_STATE_MAX,
	HISTORY_STATE_CHANGE
} from './quiescent';
export default {
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
			isForward: true
		}
	},
	reducers: {
		handleChangeWindowState({ state, rootState }, payload) {
			return {
				...state,
				windowState: payload
			};
		},
		handleChangeHistoryState({ state, rootState }) {
			return {
				...state,
				historyState: payload
			};
		}
	},
	effects: {
		test({ call, put, state, rootState }, name) {
			call('todos/add', 'call_add');
		}
	}
};
