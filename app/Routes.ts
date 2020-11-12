// /* eslint react/jsx-props-no-spreading: off */
// import React from 'react';
// import { Switch, Route } from 'react-router-dom';
// import routes from './constants/routes.json';
// import App from './containers/App';
// import HomePage from './page/discovrMusic/index';

// // Lazily load routes and code split with webpack
// const LazyCounterPage = React.lazy(() =>
//   import(/* webpackChunkName: "CounterPage" */ './containers/CounterPage')
// );

// const CounterPage = (props: Record<string, any>) => (
//   <React.Suspense fallback={<h1>Loading...</h1>}>
//     <LazyCounterPage {...props} />
//   </React.Suspense>
// );

// export default function Routes() {
//   return (
//     <App>
//       <Switch>
//         <Route path={routes.COUNTER} component={CounterPage} />
//         <Route path={routes.HOME} component={HomePage} />
//       </Switch>
//     </App>
//   );
// }

// import React from 'react';
import DiscovrMusicPage from './page/discovrMusic/index';
import NotFound from './page/404/index';
// import CounterPage from './containers/CounterPage';

// const router =  require.context("./page", true, /\.router\.js$/)

// console.log("router",router)

const routers = [
  {
    path: '/discovrMusic',
    component: DiscovrMusicPage,
  },
  {
    path: '*',
    exact: true,
    component: NotFound,
  },
];

export default routers;
