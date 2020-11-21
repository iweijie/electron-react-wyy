import { warning, isReduxPrimitiveType } from "./util";
import { DISPATCH_PUSH_TYPE } from "./namespace";

function isAllFunction(obj) {
  return Object.keys(obj).every((key) => typeof obj[key] === "function");
}

export function checkModel(model, registeredNamespace = {}) {
  const { namespace, reducers = {}, effects = {} } = model;
  warning(
    !registeredNamespace[model.namespace],
    `namespace：${model.namespace} 以注册，请勿重复注册`
  );
  registeredNamespace[model.namespace] = true;
  warning(namespace, "namespace 是必须的");
  // state 不校验
  warning(isAllFunction(reducers), "reducers 属性值需都为函数");
  warning(isAllFunction(effects), "effects 属性值需都为函数");
}

export function checkType({ state, action, separator }) {
  if (action && (action.type === DISPATCH_PUSH_TYPE) || ( action || action.type)) return;
  warning(action && action.type, "action需包含type字段");
  const { type } = action;
  if (isReduxPrimitiveType(type)) return;
  const namespaceList = type.split(separator);
  console.log("namespaceList:",namespaceList,namespaceList)
  warning(state[namespaceList[0]], `namespace -- ${namespaceList[0]} 未注册`);
}

export function isSame(one, two) {
  warning(two !== one, "两者值相同");
}
