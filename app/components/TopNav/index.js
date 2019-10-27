import React, { Component } from 'react';
import { connect } from 'react-redux';
import { ipcRenderer } from 'electron';
import observer from '../../utils/pubSub';
import { Link } from 'react-router-dom';
import styles from './index.less';
import Icon from 'components/Icon';
import topbar from '../../static/images/topbar.png';
import historyStack from '../../utils/historyStack';

class TopNav extends Component {
	handleMinimize = (e) => {
		ipcRenderer.send('native-minimize');
	};

	handleMaximize = () => {
		ipcRenderer.send('native-maximize');
	};

	handleClose = () => {
		ipcRenderer.send('native-close');
	};

	handleWindowSizeChange = (event, state) => {
		const { dispatch } = this.props;
		dispatch({ type: state });
	};

	componentDidMount() {
		ipcRenderer.on('window-size-change', this.handleWindowSizeChange);
	}

	render() {
		const { handleMinimize, handleMaximize, handleClose } = this;
		const { historyState } = this.props;
		return (
			<div className={styles['top-nav']}>
				<div className={styles['top-nav-left']}>
					<h1>网易云音乐</h1>
				</div>
				<div className={styles['top-nav-right']}>
					<div className={styles['top-nav-search']}>
						<div className={styles['top-nav-search-btn']}>
							<span className={historyState.isBack ? styles['back-btn-active'] : styles['back-btn']} />
							<span
								className={
									historyState.isForward ? styles['forward-btn-active'] : styles['forward-btn']
								}
							/>
						</div>
						<div className={styles['top-nav-search-input']}>
							<input type="text" placeholder="搜索音乐，视频，歌词，电台" />
							<i className={styles['search-btn']} />
						</div>
					</div>
					<div className={styles['top-nav-tool-wrap']}>
						<div className={styles['user-info']}>weijie</div>
						<div className={styles['top-nav-tool']}>
							<Icon onClick={handleMinimize} type="mini" />
							<Icon onClick={handleMinimize} type="heng" />
							<Icon onClick={handleMaximize} type="mouth" />
							<Icon onClick={handleClose} type="close" />
						</div>
					</div>
				</div>
			</div>
		);
	}
}

function mapStateToProps(state) {
	return {
		windowState: state.windowState,
		historyState: state.historyState
	};
}

export default connect(mapStateToProps)(TopNav);
