import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Switch, Route, Redirect } from 'react-router';
import TopNav from '../TopNav/index';
import LeftMenu from '../LeftMenu/index';
import routers from '../../Routes';
import styles from './index.less';
import historyStack from 'utils/historyStack';
import Player from 'components/Player/index';
import { get, last, split } from 'lodash';
import { reducers } from '../../store/index';

const menuList = [
	{
		title: '推荐',
		chalidren: [
			{
				link: '/discovrMusic',
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

export default class Layout extends Component {
	componentDidMount() {
		reducers.common.login();
	}

	render() {
		const { history, match } = this.props;
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
				</div>
				<Player />
			</div>
		);
	}
}
