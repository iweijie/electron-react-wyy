import {
	WINDOW_STATE_HIDE,
	WINDOW_STATE_NORMAL,
	WINDOW_STATE_MIN,
	WINDOW_STATE_MAX,
	HISTORY_STATE_CHANGE
} from 'actions/windowAction';

// 窗口状态
//  1: 隐藏 2：最小化；3：正常；4：最大化
// [ WINDOW_STATE_HIDE, WINDOW_STATE_MIN, WINDOW_STATE_NORMAL, WINDOW_STATE_MAX ];

function windowState(state = WINDOW_STATE_NORMAL, action) {
	const { type } = action;
	switch (type) {
		case WINDOW_STATE_HIDE:
			return WINDOW_STATE_HIDE;
		case WINDOW_STATE_NORMAL:
			return WINDOW_STATE_NORMAL;
		case WINDOW_STATE_MIN:
			return WINDOW_STATE_MIN;
		case WINDOW_STATE_MAX:
			return WINDOW_STATE_MAX;
		default:
			return state;
	}
}
// 历史记录， 用于标识顶部导航是否可以 前进后退
function historyState(
	state = {
		isBack: true,
		isForward: true
	},
	action
) {
	const { type, payload } = action;
	switch (type) {
		case HISTORY_STATE_CHANGE:
			return {
				...state,
				...payload
			};
		default:
			return state;
	}
}

export default {
	windowState,
	historyState
};
