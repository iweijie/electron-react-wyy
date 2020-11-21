import { getUniqueness } from "./util";

export const NAMESPACE_SEP = "/";
export const REDUCER = 1;
export const EFFECT = 2;
export const DISPATCH_PUSH_TYPE = getUniqueness("@@/IWEIJIE/ENHANCE_REDUX/PUSH");
// "DISPATCH_PUT_TYPE_" + Math.random().toString().slice(2);
export const FUNC_TYPE = getUniqueness("FUNC_TYPE");
export const IS_ENHANCE_REDUX_CALL = getUniqueness(
  "@@/IWEIJIE/ENHANCE_REDUX/CALL"
);
export const IS_ENHANCE_REDUX_REDUCER = getUniqueness(
  "@@/IWEIJIE/ENHANCE_REDUX/REDUCER"
);
export const IS_ENHANCE_REDUX_MODEL_ADDORREMOVE = getUniqueness(
  "@@/IWEIJIE/ENHANCE_REDUX/REDUCER"
);
