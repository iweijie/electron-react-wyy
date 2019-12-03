// import React from 'react';
import DiscovrMusicPage from './page/discovrMusic/index';
import NotFound from './page/404/index';
// import CounterPage from './containers/CounterPage';

// const router =  require.context("./page", true, /\.router\.js$/)

// console.log("router",router)

const routers = [
  {
    path: '/discovrMusic/:id',
    exact: true,
    component: DiscovrMusicPage
  },
  {
    path: '*',
    component: NotFound
  }
];

export default routers;
