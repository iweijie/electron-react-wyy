import enhanceRedux from 'utils/enhance-redux/index';
import { createLogger } from 'redux-logger';
import commonModal from './common';
import recommendationModal from './recommendation';

const modals = [commonModal, recommendationModal];

export const { store, reducers, registry, unRegistry } = enhanceRedux(modals, {
  enhancer: [createLogger()]
});
