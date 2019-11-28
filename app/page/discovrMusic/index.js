import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Switch, Route, Redirect } from 'react-router';
import styles from './index.less';
import Nav from './com/nav/index';
import Recommendation from './recommendation/index';

export default class Home extends Component {
	componentDidMount() {
	}
	render() {
		const { history, match } = this.props;
		return (
			<div className={styles.container}>
				<Nav history={history} match={match} />
				<Switch>
					<Route exact path="/discovrMusic/recommendation" component={Recommendation} />
					<Route exact path="/discovrMusic/songList" component={()=><div>123</div>} />
				</Switch>
			</div>
		);
	}
}
