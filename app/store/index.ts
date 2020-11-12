// import { configureStore, getDefaultMiddleware, Action } from '@reduxjs/toolkit';
// import { createHashHistory } from 'history';
// import { routerMiddleware } from 'connected-react-router';
// import { createLogger } from 'redux-logger';
// import { ThunkAction } from 'redux-thunk';
// // eslint-disable-next-line import/no-cycle
// import createRootReducer from './rootReducer';

// export const history = createHashHistory();
// // const rootReducer = createRootReducer(history);
// // export type RootState = ReturnType<typeof rootReducer>;

// const router = routerMiddleware(history);
// const middleware = [...getDefaultMiddleware(), router];

import enhanceRedux from 'enhance-redux';
import { createLogger } from 'redux-logger';
import commonModal from './common';
import recommendationModal from './recommendation';
import playerModal from './player';
import playSongDetailModal from './playSongDetail';
import playlistModal from './playlist';

const modals = [
  commonModal,
  recommendationModal,
  playerModal,
  playSongDetailModal,
  playlistModal,
];

const { store, reducers, registry, unRegistry } = enhanceRedux(modals, {
  enhancer: [createLogger()],
});

export { store, reducers, registry, unRegistry };
