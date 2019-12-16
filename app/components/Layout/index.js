import React, { Component } from 'react';
import { connect } from 'react-redux';
// import { CSSTransition } from 'react-transition-group';
import { Link } from 'react-router-dom';
import { Switch, Route, Redirect } from 'react-router';
import TopNav from '../TopNav/index';
import LeftMenu from '../LeftMenu/index';
import routers from '../../Routes';
import historyStack from 'utils/historyStack';
import Player from 'components/Player/index';
import PlayDetail from 'components/PlayDetail/index';
import { get, last, split } from 'lodash';
import { reducers } from '../../store/index';
import styles from './index.less';

const menuList = [
	{
		title: '推荐',
		chalidren: [
			{
				link: '/discovrMusic/recommendation',
				title: '发现音乐',
				iconType: 'yinyue',
				iconStyle: {
					// top left 为调整icon 的偏移量
					top: 4
				},
				isActive: false
			}
		]
	}
];

class Layout extends Component {
	componentDidMount() {
		reducers.common.login();
	}

	render() {
		const { history, match, currentPlaySongId, isShowPlayDetailPage } = this.props;
		const isShowDetail = !!isShowPlayDetailPage && !!currentPlaySongId;
		return (
			<div className="global-layout">
				<TopNav />
				<div className={styles['global-container']}>
					<div className={styles['global-container-left']}>
						<LeftMenu menu={menuList} />
					</div>
					<div className={styles['global-container-right']}>
						<Switch>
							{routers.map((route, i) => (
								<Route key={i} exact={!!route.exact} path={route.path} component={route.component} />
							))}
							{window.location.pathname.includes('app.html') && (
								<Redirect to="/discovrMusic/recommendation" />
							)}
						</Switch>
					</div>
					<PlayDetail />
				</div>
				<Player />
			</div>
		);
	}
}

export default Layout;
