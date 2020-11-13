import React from 'react';
import { Provider } from 'react-redux';
import { Router } from 'react-router-dom';
import { hot } from 'react-hot-loader/root';
import { History } from 'history';
import Layout from '../components/Layout';

type Props = {
  store: any;
  history: History;
};

const Root = ({ store, history }: Props) => (
  <Provider store={store}>
    <Router history={history}>
      <Layout />
    </Router>
  </Provider>
);

export default hot(Root);
