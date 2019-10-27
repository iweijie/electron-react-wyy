import React from 'react';
import HomePage from './containers/HomePage';
import CounterPage from './containers/CounterPage';

const routers = [
	{
		path: '/discovrMusic',
		exact: true,
		component: HomePage
  },
	{
		path: '/counter',
		component: CounterPage
	},
	{
		path: '*',
		component: HomePage
	}
];

export default routers;
