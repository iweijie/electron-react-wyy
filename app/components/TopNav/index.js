import React, { Component } from 'react';
import { connect } from 'react-redux';
import { ipcRenderer } from 'electron';
import { get, noop } from 'lodash';
import styles from './index.less';
import Icon from 'components/Icon';
import historyStack from '../../utils/historyStack';
import history from 'utils/history';

const POP = 'POP';
const REPLACE = 'REPLACE';
const PUSH = 'PUSH';

window.a = historyStack;

class TopNav extends Component {
	constructor() {
		super();
		// 1：后退 ； 2 前进 ； 0 ： 空
		this.currentButtonIsClicked = 0;
	}

	state = {
		isShowTip: false,
		isBack: false,
		isForward: false
	};

	componentDidMount() {
		this.initForwardAndBack();
		history.listen(this.handleListenHistory);
		ipcRenderer.on('window-size-change', this.handleWindowSizeChange);
	}

	handleListenHistory = (route, type) => {
		const { currentButtonIsClicked } = this;
		let isBack = false;
		let isForward = false;
		if (type === PUSH) {
			isForward = false;
			isBack = true;
			historyStack.push(route);
		} else if (type === REPLACE) {
			historyStack.replace(route);
			isForward = false;
			isBack = historyStack.canBack;
		} else if (type === POP) {
			const pathname = get(route, 'pathname');

			if (
				currentButtonIsClicked === 1 &&
				historyStack.canBack &&
				pathname === get(historyStack, 'firstMainStack.pathname')
			) {
				console.log('历史栈 回退');
				historyStack.back();
				isForward = true;
				isBack = historyStack.canBack;
			} else if (
				currentButtonIsClicked === 2 &&
				historyStack.canForward &&
				pathname === get(historyStack, 'firstForwardStack.pathname')
			) {
				console.log('历史栈 前进');
				historyStack.forward();
				isForward = historyStack.canForward;
				isBack = true;
			} else {
				console.error('历史栈错误');
			}
		}
		this.currentButtonIsClicked = 0;
		this.setState({
			isBack,
			isForward
		});
	};

	initForwardAndBack = () => {
		const l = window.location;
		console.log(l);
		historyStack.push({
			hash: '',
			key: 'init_Key',
			pathname: get(l, 'hash', '').replace('#', ''),
			search: get(l, 'search', ''),
			state: undefined
		});
	};

	handleMinimize = () => {
		ipcRenderer.send('ipc-native-minimize');
	};

	handleMaximize = () => {
		ipcRenderer.send('ipc-native-maximize');
	};

	handleClose = () => {
		ipcRenderer.send('ipc-native-close');
	};

	handleWindowSizeChange = (event, state) => {
		const { dispatch } = this.props;
		dispatch({ type: state });
	};

	handleWatchGlobalClick = (e) => {
		let target = e.target;
		while (target) {
			if (target && target.classList && target.classList.contains('_user_click_class')) return;
			target = target.parentNode;
		}
		this.setState({
			isShowTip: false
		});
		window.removeEventListener('click', this.handleWatchGlobalClick);
	};
	handleShowTip = (event) => {
		console.log('event:', event);
		const { isShowTip } = this.state;
		if (isShowTip) return;
		this.setState({
			isShowTip: true
		});

		window.addEventListener('click', this.handleWatchGlobalClick);
	};
	handleBack = () => {
		this.currentButtonIsClicked = 1;
		history.goBack();
	};
	handleForward = () => {
		this.currentButtonIsClicked = 2;
		history.go(1);
	};

	render() {
		const { userInfo } = this.props;
		const { isShowTip, isBack, isForward } = this.state;
		const { handleMinimize, handleMaximize, handleClose } = this;
		// const { historyState } = this.props;
		return (
			<div className={styles['top-nav']}>
				<div className={styles['top-nav-left']}>
					<h1>网易云音乐</h1>
				</div>
				<div className={styles['top-nav-right']}>
					<div className={styles['top-nav-search']}>
						<div className={styles['top-nav-search-btn']}>
							<span
								onClick={isBack ? this.handleBack : noop}
								className={isBack ? styles['back-btn-active'] : styles['back-btn']}
							/>
							<span
								onClick={isForward ? this.handleForward : noop}
								className={isForward ? styles['forward-btn-active'] : styles['forward-btn']}
							/>
						</div>
						<div className={styles['top-nav-search-input']}>
							<input type="text" placeholder="搜索音乐，视频，歌词，电台" />
							<i className={styles['search-btn']} />
						</div>
					</div>
					<div className={styles['top-nav-tool-wrap']}>
						<div
							onClick={this.handleShowTip}
							className={`_user_click_class ${styles['user-info']} ${isShowTip ? styles['active'] : ''}`}
						>
							<div className={styles['user-via']}>
								<img src={get(userInfo, 'profile.avatarUrl')} alt="avatarUrl" />
							</div>
							<div className={styles['user-name']}>{get(userInfo, 'profile.nickname')}</div>
							{isShowTip ? (
								<ul className={styles['user-popup']}>
									<li>退出登入</li>
								</ul>
							) : null}
						</div>
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
		windowState: state.common.windowState,
		userInfo: state.common.userInfo
		// profile

		// historyState: state.common.historyState
	};
}

export default connect(mapStateToProps)(TopNav);
