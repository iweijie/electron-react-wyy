import enhanceRedux from 'utils/enhance-redux/index';
import { createLogger } from 'redux-logger';
import commonModal from './common';
import recommendationModal from './recommendation';
import playerModal from './player';
import playSongDetailModal from './playSongDetail';
import playlistModal from './playlist';

const modals = [ commonModal, recommendationModal, playerModal, playSongDetailModal, playlistModal ];

export const { store, reducers, registry, unRegistry } = enhanceRedux(modals, {
	enhancer: [ createLogger() ]
});
