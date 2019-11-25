import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { Router } from 'react-router-dom';
import Layout from './components/Layout';

export default class Root extends Component<Props> {
	render() {
		const { store, history } = this.props;
		return (
			<Provider store={store}>
				<Router history={history}>
					<Layout {...this.props} />
				</Router>
			</Provider>
		);
	}
}
