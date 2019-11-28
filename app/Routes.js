import React from 'react';
import DiscovrMusicPage from './page/discovrMusic/index';
// import CounterPage from './containers/CounterPage';

// const router =  require.context("./page", true, /\.router\.js$/)

// console.log("router",router)

const routers = [
	{
		path: '/discovrMusic/:id',
		exact: true,
		component: DiscovrMusicPage,
		// render: (props) => {
		// 	console.log('props--:', props);
		// 	return <DiscovrMusicPage {...props} />;
		// }
	}
	// {
	// 	path: '/counter',
	// 	component: CounterPage
	// },
];

export default routers;
