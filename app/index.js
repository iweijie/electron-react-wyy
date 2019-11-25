import React from 'react';
import { render } from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import Root from './Root';
// import { configureStore, history } from './store/configureStore';
// import {} from './store/index';
import history from './utils/history';
import { store } from './store';
import './style/common.global.less';

render(
	<AppContainer>
		<Root store={store} history={history} />
	</AppContainer>,
	document.getElementById('root')
);

if (module.hot) {
	module.hot.accept('./Root', () => {
		// eslint-disable-next-line global-require
		const NextRoot = require('./Root').default;
		render(
			<AppContainer>
				<NextRoot store={store} history={history} />
			</AppContainer>,
			document.getElementById('root')
		);
	});
}
