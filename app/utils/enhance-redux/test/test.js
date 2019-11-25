export default {
	namespace: 'todos', //model的namespace
	state: [], //model的初始化数据
	reducers: {
		add({ state, rootState }, payload) {
			console.log("rootState",rootState);
			return [ ...state, payload ];
		},
		remove({ state, rootState }) {
			return [];
		},
		test_1({ state, rootState }, name) {
			return [ ...state, name ];
		}
	},
	effects: {
		test({ call, put, state, rootState }, name) {
			call('todos/add', 'call_add');
		}
	}
};
