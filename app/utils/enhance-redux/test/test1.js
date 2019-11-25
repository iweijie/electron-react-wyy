export default {
	namespace: 'weijie', //model的namespace
	state: {
		name: 'weijie',
		age: 28,
		sex: 'men'
	}, //model的初始化数据
	reducers: {
		changename({ state, rootState }, payload) {
			return {
				...state,
				name: payload
			};
		},
		growUp({ state, rootState }, payload) {
			return {
				...state,
				age: state.age + 1
			};
		}
	},
	effects: {
		changeSex({ put, call, state, rootState }, sex) {
			console.log('rootState', rootState);
			call('weijie/changename', 123);
			put('weijie/sex', sex);
		}
	}
};
