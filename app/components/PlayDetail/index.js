import React, { Component } from 'react';
import { CSSTransition } from 'react-transition-group';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Toast from 'components/Toast';
import { get, isNaN, isEmpty, join, map, first } from 'lodash';
import './animation.global.less';
import styles from './index.less';
import { reducers } from '../../store';

class Player extends Component {
	constructor(props) {
		super(props);
		this.state = {};
	}

	static propTypes = {
		// title: PropTypes.string.isRequired,
		// link: PropTypes.string,
		// child: PropTypes.element
	};

	componentDidMount() {}

	componentDidUpdate(preProps) {}

	render() {
		const { currentPlaySongId, isShowPlayDetailPage } = this.props;
		const isShowDetail = !!isShowPlayDetailPage && !!currentPlaySongId;
		return (
			<CSSTransition
				in={isShowDetail}
				timeout={300}
				classNames="detail"
				unmountOnExit
				// onEnter={() => setShowButton(false)}
				// onExited={() => setShowButton(true)}
			>
				<div className={styles['global-container-play-detail-wrap']}>
					<div className="" onClick={this.handleCancle}>
						handleCancle
					</div>
				</div>
			</CSSTransition>
		);
	}

	handleCancle = () => {
		const { isShowPlayDetailPage, changePlayMore } = this.props;
		changePlayMore({
			isShowPlayDetailPage: false
		});
	};
}

function mapStateToProps(state) {
	return {
		playerList: state.player.playerList,
		playMode: state.player.playMode,
		isShowPlayDetailPage: state.player.isShowPlayDetailPage,
		currentPlaySongId: state.player.currentPlaySongId
	};
}

function mapDispatchToProps() {
	return {
		changePlayMore: reducers.player.changePlayMore
	};
}
export default connect(mapStateToProps, mapDispatchToProps)(Player);
