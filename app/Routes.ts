import React from 'react';
import DiscovrMusicPage from './page/discoverMusic/index';
import NotFound from './page/404/index';
import RecommendedDaily from './page/RecommendedDaily/index';
import SongListDaily from './page/SongListDaily';

interface IRouter {
  path: string;
  exact?: boolean;
  component: React.ComponentType<any>;
}

const routers: IRouter[] = [
  {
    path: '/discoverMusic',
    component: DiscovrMusicPage,
  },
  {
    path: '/recommendedDaily',
    exact: true,
    component: RecommendedDaily,
  },
  {
    path: '/songListDaily/:id',
    exact: true,
    component: SongListDaily,
  },
  {
    path: '*',
    exact: true,
    component: NotFound,
  },
];

export default routers;
