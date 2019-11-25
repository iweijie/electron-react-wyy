import { getUniqueness } from './util';

export const NAMESPACE_SEP = '/';
export const REDUCER = 1;
export const EFFECT = 2;
export const DISPATCH_PUT_TYPE = 'DISPATCH_PUT_TYPE_' + Math.random().toString().slice(2);
export const PUT_DISPATCH = getUniqueness('PUT');
export const CALL_DISPATCH = getUniqueness('CALL');
