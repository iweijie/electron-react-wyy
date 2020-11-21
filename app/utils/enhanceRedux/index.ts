import {
  warning,
  isArray,
  isReduxPrimitiveType,
  print,
  isProduction,
  isObject,
} from './util';
import {
  NAMESPACE_SEP,
  IS_ENHANCE_REDUX_CALL,
  IS_ENHANCE_REDUX_REDUCER,
  IS_ENHANCE_REDUX_MODEL_ADDORREMOVE,
} from './namespace';
import { Dispatch } from 'redux';
import {
  IModal,
  IEnhanceReduxReturn,
  ReducerType,
  EffectsType,
  IAction,
  IDecorateHandle,
  IDefaultReduce,
} from './index.d';
import { checkModel, checkType, isSame } from './check';
import { createStore, applyMiddleware } from 'redux';
function enhanceRedux(models: IModal[], options: any): IEnhanceReduxReturn {
  models = models || [];
  options = options || {};
  let { enhancer = [], reducer, separator = NAMESPACE_SEP } = options;
  const REGISTERED_NAMESPACE = {};
  const decorateReducers: any = {};
  const primevalReducer: any = {};
  let states: any = {};
  let store;
  //   redux 原生 dispatch
  let reduxDispatch: Dispatch;
  //   redux 原生 getState
  let getState: () => any;
  //   redux 原生 replaceReducer
  // let replaceReducer;

  /**
   * 自定义 dispatch 函数； 用于分发拦截
   * @param {object} action
   */

  function dispatch(action: IAction) {
    // 自定义 call 函数
    if (action && action[IS_ENHANCE_REDUX_CALL]) {
      let { type, payload } = action;
      try {
        const [namespace, key] = type.split(separator);
        const callHandle = decorateReducers[namespace][key];
        return callHandle(payload);
      } catch (err) {
        console.error(err);
      }
      // 正常 dispatch 事件分发
    } else if (isObject(action) && action.type) {
      return reduxDispatch(action);
    } else {
      // 其他； 如：bindActionCreators 包裹后的方法
      return action;
    }
  }

  /**
   *	包装 reducer 函数
   */

  function decorateReducer(
    namespace: string,
    key: string,
    reducerHandle: ReducerType,
    type: string
  ) {
    const anonymous: IDecorateHandle = (payload: any) => {
      if (!isProduction) {
        print(`${type}--  ${namespace}${separator}${key}`);
      }
      const state = getState();
      const data = reducerHandle(
        {
          state: state[namespace],
          rootState: state,
        },
        payload
      );
      reduxDispatch({
        type: namespace,
        payload: data,
      });
      return data;
    };

    anonymous[IS_ENHANCE_REDUX_REDUCER] = type;
    return anonymous;
  }

  /**
   *	包装 effect 函数
   */

  function decorateEffect(
    namespace: string,
    key: string,
    effect: EffectsType,
    type: string
  ) {
    const anonymous: IDecorateHandle = (payload: any) => {
      if (!isProduction) {
        print(`${type} --- ${namespace}${separator}${key}`);
      }
      const state = getState();
      return effect(
        {
          call: call(namespace, key),
          // push: push(namespace, key),
          push: push(),
          getState: (namespace) => {
            const state = getState();
            if (!namespace) return state;
            try {
              const typeList = namespace.split(separator);
              return typeList.reduce((obj, attr) => obj[attr], state);
            } catch (err) {
              console.warn(
                `getState：${namespace}取值错误，请查看取值路径是否正确`
              );
            }
            return state;
          },
          state: state[namespace],
          rootState: state,
        },
        payload
      );
    };
    anonymous[IS_ENHANCE_REDUX_REDUCER] = type;
    return anonymous;
  }

  /**
   *	注册 model
   */

  function register(model: IModal) {
    states = getState();
    registerModel(model);
    const newState = { ...states };
    reduxDispatch({
      type: IS_ENHANCE_REDUX_MODEL_ADDORREMOVE,
      payload: newState,
    });
  }

  function registerModel(model: IModal) {
    if (!isProduction) {
      // 检测 model 的结构是否符合 ，以及是否重复注册
      checkModel(model, REGISTERED_NAMESPACE);
    }
    const { namespace, state = {}, reducers = {}, effects = {} } = model;

    // const states = getState();
    // 初始化state 赋值
    states[namespace] = state;
    // 获取 reducer
    if (isObject(reducers)) {
      Object.keys(reducers).forEach((key) => {
        if (!decorateReducers[namespace]) decorateReducers[namespace] = {};
        if (!primevalReducer[namespace]) primevalReducer[namespace] = {};
        decorateReducers[namespace][key] = decorateReducer(
          namespace,
          key,
          reducers[key],
          'reducer'
        );
        primevalReducer[namespace][key] = reducers[key];
      });
    }

    // 获取 effect
    // 同一模块下；同名effect会覆盖同名的reducer

    if (isObject(effects)) {
      Object.keys(effects).forEach((key) => {
        if (!decorateReducers[namespace]) decorateReducers[namespace] = {};
        if (!primevalReducer[namespace]) primevalReducer[namespace] = {};
        warning(
          !decorateReducers[key],
          `模块${namespace}中，reducers的${key}属性被effects中的${key}属性覆盖`
        );
        decorateReducers[namespace][key] = decorateEffect(
          namespace,
          key,
          effects[key],
          'effect'
        );
        primevalReducer[namespace][key] = effects[key];
      });
    }
  }

  /**
   *	取消注册
   */
  function unRegister(namespace: string) {
    states = { ...getState() };
    delete states[namespace];
    delete decorateReducers[namespace];
    delete primevalReducer[namespace];
    reduxDispatch({
      type: IS_ENHANCE_REDUX_MODEL_ADDORREMOVE,
      payload: states,
    });
  }

  function call(origin: string, oneType: string) {
    return (twoType: string, payload: any) => {
      if (!isProduction) {
        isSame(twoType, oneType);
        // 如果是循环调用 ，表示无能为力
        // throw new Error(`${twoType} 自调用，烦请看看是否调用错了。`);
      }
      return dispatch({
        type: twoType,
        payload,
        [IS_ENHANCE_REDUX_CALL]: true,
      });
    };
  }
  // origin, oneType
  function push() {
    return (namespace: string, payload: any) =>
      dispatch({
        type: namespace,
        payload,
      });
  }
  // function push(namespace: string, payload: any) {
  //   dispatch({
  //     type: namespace,
  //     payload,
  //   });
  // }

  // react-redux  connect  第二个参数传对象时，会再被dispatch包裹一次
  // action 会为空时；做下错误处理
  const defaultReduce: IDefaultReduce = (state = {}, action) => {
    // type不存在 或者 redux内部的分发直接返回 state
    if (!action || !action.type || isReduxPrimitiveType(action.type))
      return state;
    if (!isProduction) {
      checkType({ state, action, separator });
    }
    const { type, payload } = action;
    // model 新增 or  移除
    if (type === IS_ENHANCE_REDUX_MODEL_ADDORREMOVE) {
      return payload;
    }
    try {
      const typeList = type.split(separator);
      const typeLastAttr = typeList.pop();
      const selected: any = typeList.reduce((obj, attr) => obj[attr], state);

      // 当前可挂载属性需为对象（包含普通对象，数组，函数等，也即为复杂值）
      if (isObject(selected)) {
        if (typeLastAttr) {
          selected[typeLastAttr] = payload;
        }
        return { ...state };
      }
    } catch (err) {
      console.warn(`${type} 赋值错误`);
    }
    return state;
  };

  // if (!isArray(models)) {
  //   models = [models];
  // }

  if (enhancer && !isArray(enhancer)) {
    enhancer = [enhancer];
  }

  models = models.filter(isObject);

  models.forEach(registerModel);

  store = createStore(
    reducer || defaultReduce,
    states,
    applyMiddleware(...enhancer)
  );

  reduxDispatch = store.dispatch;
  getState = store.getState;
  // replaceReducer = store.replaceReducer;

  return {
    store: {
      ...store,
      //  改写 dispatch， 做了一个拦截操作
      dispatch,
    },
    reducers: { ...decorateReducers },
    register,
    unRegister,
  };
}
export default enhanceRedux;
