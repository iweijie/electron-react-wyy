import enhanceRedux from 'utils/enhance-redux/index';
import { createLogger } from 'redux-logger';
import commonModal from './common';

const modals = [ commonModal ];

export const {store,reducers,registry,unRegistry} = enhanceRedux(modals, { enhancer: [ createLogger() ] });

