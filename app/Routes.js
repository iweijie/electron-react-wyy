import React from 'react';
import DiscovrMusicPage from './page/discovrMusic/index';
// import CounterPage from './containers/CounterPage';

const routers = [
	{
		path: '/discovrMusic',
		exact: true,
		component: DiscovrMusicPage
	},
	// {
	// 	path: '/counter',
	// 	component: CounterPage
	// },
];

export default routers;
