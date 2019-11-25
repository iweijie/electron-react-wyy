import { warning, isReduxPrimitiveType } from './util';
import { NAMESPACE_SEP, DISPATCH_PUT_TYPE } from './namespace_sep';

function isAllFunction(obj) {
	return Object.keys(obj).every((key) => typeof obj[key] === 'function');
}

export function checkModel(model, registeredNamespace = {}) {
	const { namespace, state, reducers = {}, effects = {} } = model;
	warning(!registeredNamespace[model.namespace], `namespace：${model.namespace} 以注册，请勿重复注册`);
	registeredNamespace[model.namespace] = true;
	warning(namespace, 'namespace 是必须的');
	// state 不校验
	warning(isAllFunction(reducers), 'reducers 属性值需都为函数');
	warning(isAllFunction(effects), 'effects 属性值需都为函数');
}

// export function checkModels(models, registeredNamespace) {
// 	for (let i = 0; i < models.length; i++) {
// 		const model = models[i];
// 		warning(!registeredNamespace[model.namespace], `namespace：${model.namespace} 以注册，请勿重复注册`);
// 		checkModel(model);
// 		registeredNamespace[model.namespace] = true;
// 	}
// }

export function checkType(state, action) {
	if (action & (action.type === DISPATCH_PUT_TYPE)) return;
	warning(action && action.type, 'action需包含type字段');
	const { type } = action;
	if (isReduxPrimitiveType(type)) return;
	const namespaceList = type.split(NAMESPACE_SEP);
	warning(state[namespaceList[0]], 'namespace未注册');
}

export function isSame(one, two) {
	warning(two !== one, '两者值相同');
}
