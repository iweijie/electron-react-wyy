import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Switch, Route, Redirect } from 'react-router';
import TopNav from '../TopNav/index';
import LeftMenu from '../LeftMenu/index';
import routers from '../../Routes';
import styles from './index.less';

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
		window.addEventListener('hashchange', (e) => {
			console.log(e);
		});
	}

	render() {
		console.log(this.props)
		return (
			<div className="global-layout">
				<TopNav />
				<div className={styles['global-container']}>
					<LeftMenu menu={menuList} />
					<Switch>
						{routers.map((route, i) => (
							<Route key={i} exact={route.exact} path={route.path} component={route.component} />
						))}
						<Redirect to="/discovrMusic/recommendation" />
					</Switch>
				</div>
			</div>
		);
	}
}
