import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Switch, Route, Redirect } from 'react-router';
import styles from './index.less';
import Nav from './com/nav/index';
import Recommendation from './recommendation/index';
import RecommendSongs from './recommendSongs/index';
// import Toast from 'components/Toast';

import request from '../../request/index';

export default class Home extends Component {
	componentDidMount() {
    
	// duration: PropTypes.number.isRequired, // Notice显示时间
	// prefixCls: PropTypes.string, // 前缀class
	// type: PropTypes.oneOf([ 'info', 'success', 'warning', 'error' ]), // notice类型
	// iconClass: PropTypes.string, // icon的class
	// content: PropTypes.any, // Notice显示的内容
	// onClose: PropTypes.func // 显示结束回调
		// Toast.info('普通的Toast我普通的摇！！', 4000);
	}
	render() {
		const { history, match } = this.props;
		return (
			<div className={styles.container}>
				<Nav history={history} match={match} />
				<Switch>
					<Route exact path="/discovrMusic/recommendation" component={Recommendation} />
					<Route exact path="/discovrMusic/recommendSongs" component={RecommendSongs} />
					<Route exact path="/discovrMusic/songList" component={() => <div>123</div>} />
				</Switch>
			</div>
		);
	}
}
