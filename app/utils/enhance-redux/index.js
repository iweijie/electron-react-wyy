import { warning, isArray, isReduxPrimitiveType, print, isProduction } from './util';
import { NAMESPACE_SEP, CALL_DISPATCH } from './namespace_sep';
import { checkModel, checkType, isSame } from './check';
import { createStore, applyMiddleware } from 'redux';

export default function enhanceRedux(models, { enhancer, reducer }) {
	const REGISTERED_NAMESPACE = {};
	const decorateReducers = {};
	const primevalReducer = {};
	let states = {};
	let dispatch;
	let getState;
	let replaceReducer;

	/*
   *	包装 reducer 函数
   */

	function decorateReducer(namespace, key, reducerHandle) {
		return (...payload) => {
			if (!isProduction) {
				print(`${namespace}${NAMESPACE_SEP}${key}`);
			}
			const state = getState();
			dispatch({
				type: `${namespace}`,
				payload: reducerHandle(
					{
						state: state[namespace],
						rootState: state
					},
					...payload
				)
			});
		};
	}

	/*
   *	包装 effect 函数
   */

	function decorateEffect(namespace, key, effect) {
		return (...payload) => {
			if (!isProduction) {
				print(`${namespace}${NAMESPACE_SEP}${key}`);
			}
			const state = getState();
			return effect(
				{
					call: call(namespace, key),
					put: put(namespace, key),
					state: state[namespace],
					rootState: state
				},
				...payload
			);
		};
	}

	/*
   *	注册 model
   */

	function registry(model) {
		registryModel(model);
		const state = getState();
		const newState = (states = { ...state });
		replaceReducer(newState);
	}

	function registryModel(model) {
		if (!isProduction) {
			// 检测 model 的结构是否符合 ，以及是否重复注册
			checkModel(model, REGISTERED_NAMESPACE);
		}
		const { namespace, state, reducers, effects } = model;

		// 初始化state 赋值
		states[namespace] = state;
		// 获取 reducer
		Object.keys(reducers).forEach((key) => {
			if (!decorateReducers[namespace]) decorateReducers[namespace] = {};
			if (!primevalReducer[namespace]) primevalReducer[namespace] = {};
			decorateReducers[namespace][key] = decorateReducer(namespace, key, reducers[key]);
			primevalReducer[namespace][key] = reducers[key];
		});
		// 获取 effect
		// effect 会覆盖同名的 reducer

		Object.keys(effects).forEach((key) => {
			if (!decorateReducers[namespace]) decorateReducers[namespace] = {};
			if (!primevalReducer[namespace]) primevalReducer[namespace] = {};
			warning(!decorateReducers[key], `模块${namespace}中，reducers的${key}属性被effects中的${key}属性覆盖`);
			decorateReducers[namespace][key] = decorateEffect(namespace, key, effects[key]);
			primevalReducer[namespace][key] = effects[key];
		});
	}

	/*
   *	取消注册
   */
	function unRegistry(namespace) {
		const state = getState();
		const newState = (states = { ...state });
		delete newState[namespace];
		delete decorateReducers[namespace];
		delete primevalReducer[namespace];
		replaceReducer(newState);
	}

	function call(origin, oneType) {
		return (twoType, payload) => {
			if (process.env.NODE_ENV !== 'production') {
				isSame(twoType, oneType);
			}
			dispatch({
				type: twoType,
				payload,
				[CALL_DISPATCH]: true
			});
		};
	}
	// origin, key
	function put() {
		return (namespace, payload) => {
			dispatch({
				type: namespace,
				payload
			});
		};
	}

	function middleware(store) {
		return (next) => (action) => {
			if (action[CALL_DISPATCH]) {
				const { type, payload = {} } = action;
				try {
					const [ namespace, key ] = type.split(NAMESPACE_SEP);
					const callHandle = primevalReducer[namespace][key];
					const rootState = store.getState();
					return next({
						type: namespace,
						payload: callHandle({ state: rootState[namespace], rootState }, ...payload)
					});
				} catch (err) {
					console.error(err);
				}
			}
			return next(action);
		};
	}

	function defaultReduce(state = {}, action = {}) {
		if (!isProduction) {
			checkType(state, action);
		}
		const { type, payload } = action;
		if (isReduxPrimitiveType(type)) return state;
		try {
			const typeList = type.split(NAMESPACE_SEP);
			const typeLastAttr = typeList.pop();
			const selectedItem = typeList.reduce((obj, attr) => obj[attr], state);

			if (typeof selectedItem === 'object' || typeof selectedItem === 'function') {
				selectedItem[typeLastAttr] = payload;
				return { ...state };
			}
		} catch (err) {
			console.warn(`${type}赋值错误`);
		}
		return state;
	}

	if (!isArray(models)) {
		models = [ models ];
	}

	if (enhancer === undefined) {
		enhancer = [];
	}

	if (enhancer && !isArray(enhancer)) {
		enhancer = [ enhancer ];
	}

	models.forEach(registryModel);

	const store = createStore(reducer || defaultReduce, states, applyMiddleware(middleware, ...enhancer));

	dispatch = store.dispatch;
	getState = store.getState;
	replaceReducer = store.replaceReducer;

	return {
		store: {
			...store
		},
		reducers: { ...decorateReducers },
		registry,
		unRegistry
	};
}
