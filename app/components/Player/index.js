import React, { Component } from 'react';
import electron, { ipcRenderer, remote } from 'electron';
import { CSSTransition } from 'react-transition-group';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Toast from 'components/Toast';
import observer from '../../utils/observer';
import { get, isNaN, isEmpty, join, map, first } from 'lodash';
import { loopCallback, getFormatTime } from '../../utils';
import { getContainerBounds } from '../../utils/mainInfo';

import requestMap from '../../request/index';
import PlayList from './playList';
import { reducers } from '../../store';
import styles from './index.less';
import './animation.global.less';

const AUDIO_STATUS_IS_PLAY = 1;
const AUDIO_STATUS_IS_PAUSED = 0;
const DEFAULT_TIME = '00:00';

function createAudio() {
	return document.createElement('audio');
}

class Player extends Component {
	constructor(props) {
		super(props);
		this.audio = createAudio();
		this.initAudio();
		this.loopStopCallBack = null;
		this.state = {
			// 是否展示播放野详情
			isShowPlayDetailPage: false,
			// 当前歌单展示状态
			playListStatus: false,
			//音乐播放状态：  0： 暂停 ； 1：播放
			audioPlayStatus: AUDIO_STATUS_IS_PAUSED,
			// 当前歌曲已播放时长
			currentTime: 0,
			// 进度条比例
			runningTimeRatio: 0,
			// 随机播放列表
			randomPlayList: []
		};
	}

	static propTypes = {
		// title: PropTypes.string.isRequired,
		// link: PropTypes.string,
		// child: PropTypes.element
	};

	componentDidMount() {
		console.log(electron.screen.getCursorScreenPoint());
		// Toast.fail('音乐获取失败，请重新尝试',2);
		// Toast.info('普通的Toast我普通的摇！！', 4000);
		observer.on('play-song', this.handlePlay);
		// this.dragSlide(this.progressWrap);
	}

	componentDidUpdate(preProps) {}

	handleGlobalClosePlayList = (event) => {
		const { playListStatus } = this.state;
		if (!playListStatus) return window.removeEventListener('click', this.handleGlobalClosePlayList);
		let target = event.target;
		while (target) {
			if (target && target.classList && target.classList.contains('_player_wrap')) return;
			target = target.parentNode;
		}
		window.removeEventListener('click', this.handleGlobalClosePlayList);
		this.setState({
			playListStatus: false
		});
	};

	render() {
		const { audio } = this;
		const { playListStatus, audioPlayStatus, currentTime, runningTimeRatio } = this.state;
		const { playerList, playMode, currentPlaySongId, changePlayMore, isShowPlayDetailPage } = this.props;
		const currentPlaySong = playerList.find((player) => player.id === currentPlaySongId);
		return (
			<div className={`${styles.player} _player_wrap`}>
				{/* 当有播放歌曲 且 没有展示详情的时候显示 */}
				<CSSTransition
					in={currentPlaySongId && !isShowPlayDetailPage}
					timeout={300}
					classNames="small"
					unmountOnExit
					// onEnter={() => setShowButton(false)}
					// onExited={() => setShowButton(true)}
				>
					<div className={styles.song}>
						<div className={styles['small-song']}>
							<div className={styles['small-song-img']}>
								<div className={styles.mask} onClick={this.handleShowDetail}>
									<i className="iconzhankaiquanpingkuozhan iconfont" />
								</div>
								<img src={this.getSmallSongImg(currentPlaySong)} alt="" />
							</div>
							<div className={styles['small-song-name']}>
								<p className={styles.name}>{get(currentPlaySong, 'name')}</p>
								<p className={styles.artists}>
									{join(map(get(currentPlaySong, 'album.artists'), (item) => item.name), '/')}
								</p>
							</div>
						</div>
					</div>
				</CSSTransition>
				<div className={styles.control}>
					<div className={styles.btns}>
						<button>
							<i className="iconfont iconSanMiAppglyphico" />
						</button>
						<button onClick={this.handleSwitchAudioPlayStatus}>
							{audioPlayStatus ? (
								<i className="iconfont iconbofangzanting" />
							) : (
								<i className="iconfont iconbofang1" />
							)}
						</button>
						<button>
							<i className="iconfont iconSanMiAppglyphico1" />
						</button>
					</div>
					<div className={styles['time-progress']}>
						<div className={styles['time-running']}>
							{isEmpty(playerList) ? DEFAULT_TIME : getFormatTime(currentTime)}
						</div>
						<div ref={(dom) => (this.progressWrap = dom)} className={styles.progress}>
							<span className={styles['progress-mask']} style={{ width: `${runningTimeRatio}%` }}>
								<i className={styles.drag} />
							</span>
						</div>
						<div className={styles['time-end']}>
							{isEmpty(playerList) ? DEFAULT_TIME : getFormatTime(audio.duration)}
						</div>
					</div>
					<div className={styles['sound-progress']}>
						<div className={styles['sound-control']}>
							<i className="iconfont iconshengyin" />
						</div>
						<div ref={(dom) => (this.volumeWrap = dom)} className={styles.progress}>
							<span className={styles['progress-mask']} style={{ width: `${audio.volume * 100}%` }}>
								<i className={styles.drag} />
							</span>
						</div>
					</div>
					<div
						onClick={this.handleChangeMode}
						className={styles['play-mode']}
						title={playMode === 1 ? '循环播放' : playMode === 2 ? '随机播放' : '单曲循环'}
					>
						{playMode === 1 && <i className="iconfont iconxunhuan1" />}
						{playMode === 2 && <i className="iconfont iconsuiji1" />}
						{playMode === 3 && (
							<i className="iconfont iconxunhuan">
								<span>1</span>
							</i>
						)}
						<span />
					</div>
					<div className={styles['songs-list-btn']} onClick={this.handleChangePlayListStatus} title="歌单">
						<i className="iconfont iconRectangleCopy" />
					</div>
				</div>
				<div style={{ display: playListStatus ? 'block' : 'none' }}>
					<PlayList
						handleClearPlayList={this.handleClearPlayList}
						playerList={playerList}
						currentPlaySongId={currentPlaySongId}
						handleClose={this.handleChangePlayListStatus}
						handleDoubleClick={this.handlePlay}
					/>
				</div>
			</div>
		);
	}

	initAudio = () => {
		const audio = this.audio;
		const { playMode } = this.props;
		if (!audio) return;
		audio.loop = false;
		audio.removeEventListener('canplay', this.handleCanplay);
		audio.removeEventListener('ended', this.handleEnded);
		audio.removeEventListener('error', this.handleError);
		audio.addEventListener('canplay', this.handleCanplay);
		audio.addEventListener('error', this.handleError);
		audio.addEventListener('ended', this.handleEnded);
	};

	getAudioCurrentTime() {
		return this.audio.currentTime;
	}

	handleCanplay = (event) => {
		this.handlePlayAudio();
	};

	handleEnded = (event) => {
		// 1: 循环 ； 2 随机； 3 单曲
		const { playMode } = this.props;
		switch (playMode) {
			case 1:
				return this.loopMode();
			case 2:
				return this.randomMode();
			case 3:
				return;
			default:
				return this.loopMode();
		}
	};

	// 循环播放模式
	loopMode = () => {
		const { playerList, changePlayMore, currentPlaySongId } = this.props;
		if (!playerList.length) return;
		const currentIndex = playerList.findIndex((player) => currentPlaySongId === player.id);
		this.handlePlay(playerList[(currentIndex + 1) % playerList.length]);
	};

	// 随机播放模式
	randomMode = () => {
		let { randomPlayList } = this.state;
		const { currentPlaySongId, playerList } = this.props;
		if (!playerList.length) return;
		// 随机列表存在曲目 ， 直接 获取
		if (!randomPlayList.length) {
			randomPlayList = this.getRandomList();
		}
		let item = randomPlayList.pop();
		this.setState({
			randomPlayList
		});
		this.handlePlay(item);
	};

	handleError(e) {
		Toast.fail('音乐获取失败，请重新尝试');
	}
	// 切换 播放 与 暂停
	handleSwitchAudioPlayStatus = () => {
		const { playerList, currentPlaySongId } = this.props;
		if (!playerList.length) return;
		let { audioPlayStatus } = this.state;
		if (audioPlayStatus === AUDIO_STATUS_IS_PLAY) {
			this.handleStopAudio();
		} else {
			if (!currentPlaySongId) {
				this.handlePlay(playerList[0]);
			} else {
				this.handlePlayAudio();
			}
		}
	};

	handleSwitchSong = (src, id) => {
		const { changePlayMore } = this.props;
		const audio = this.audio;
		this.handleStopAudio();
		changePlayMore({
			// 当前列表播放歌曲id
			currentPlaySongId: id
		});
		audio.src = src;
	};

	handlePlayAudio = () => {
		const { currentPlaySongId } = this.props;
		if (!currentPlaySongId) return;
		const audio = this.audio;
		if (audio.paused) {
			audio.play();
		}
		this.handleStopLoopCallBack();
		this.loopStopCallBack = loopCallback(() => {
			const currentTime = audio.currentTime;
			const duration = audio.duration || 0;
			// 满进度100 ；   保留两位小数
			const runningTimeRatio = Math.max(Math.floor(currentTime / duration * 10000) / 100, 0);
			this.setState({
				currentTime,
				runningTimeRatio
			});
		}, 100);
		this.setState({ audioPlayStatus: AUDIO_STATUS_IS_PLAY, currentTime: audio.currentTime });
	};

	handleStopAudio = () => {
		const audio = this.audio;
		if (!audio.paused) {
			audio.pause();
		}
		this.handleStopLoopCallBack();
		this.setState({ audioPlayStatus: AUDIO_STATUS_IS_PAUSED });
	};

	handleStopLoopCallBack = () => {
		if (this.loopStopCallBack) {
			this.loopStopCallBack();
			this.loopStopCallBack = null;
		}
	};

	handleChangePlayListStatus = (event, status) => {
		event;
		const { playListStatus } = this.state;
		status = status === undefined ? !playListStatus : status;

		if (status) {
			setTimeout(() => {
				window.addEventListener('click', this.handleGlobalClosePlayList);
			}, 100);
		}
		this.setState({
			playListStatus: status
		});
	};

	// 获取歌曲信息，包含当前歌曲资源链接
	getSongInfo = async (id) => {
		return requestMap.requestGetSong({ id });
	};

	handlePlay = async (item) => {
		const { currentPlaySongId } = this.props;
		const id = get(item, 'id');
		if (!id || currentPlaySongId === id) return;
		const data = await this.getSongInfo(id);
		if (!get(data, 'id') || !get(data, 'url')) return;
		this.handleSwitchSong(get(data, 'url'), get(data, 'id'));
	};

	getRandomList = () => {
		const { randomPlayList } = this.state;
		const { currentPlaySongId, playerList } = this.props;
		let list = [ ...playerList ];
		if (!list.length) return list;
		if (currentPlaySongId) {
			list = list.filter((item) => item.id !== currentPlaySongId);
		}
		return this.disorder(list, 3);
	};

	disorder = (arr, l = 2) => {
		l = l || 1;
		for (var i = l - 1; i >= 0; i--) {
			arr.sort(function() {
				return 0.5 - Math.random();
			});
		}
		return arr;
	};
	// 切换播放模式后的 处理程序
	handleChangePlayModeCall = (mode) => {
		const audio = this.audio;
		const { playerList, currentPlaySongId } = this.props;
		switch (mode) {
			case 1:
				audio.loop = false;
				break;
			case 2:
				break;
			case 3:
				audio.loop = true;
				this.setState({
					randomPlayList: []
				});
		}
	};
	// 切换播放模式
	handleChangeMode = () => {
		const { changePlayMore, playMode } = this.props;
		const mode = playMode + 1 > 3 ? 1 : playMode + 1;
		changePlayMore({
			playMode: mode
		});
		this.handleChangePlayModeCall(mode);
	};

	// 清空播放列表
	handleClearPlayList = () => {
		const { changePlayMore } = this.props;
		this.handleStopAudio();
		this.setState({
			currentTime: 0,
			randomPlayList: []
		});
		changePlayMore({
			playerList: [],
			currentPlaySongId: ''
		});
	};

	getSmallSongImg = (item) => {
		const url = get(item, 'album.blurPicUrl', '');
		if (url) return `${url}?param=140y140`;
		return url;
	};

	handleShowDetail = () => {
		const { changePlayMore } = this.props;
		changePlayMore({
			isShowPlayDetailPage: true
		});
	};

	// handleMouseEvent = () => {
	// 	const { x, y } = electron.screen.getCursorScreenPoint();
	// 	console.log(x, y);
	// };

	// dragSlide(wrap) {
	// 	const progress = first(wrap.getElementsByTagName('span'));
	// 	const drag = first(wrap.getElementsByTagName('i'));
	// 	if (!progress || !drag) return;
	// 	wrap.addEventListener('mousedown', () => {
	// 		const { x, y } = electron.screen.getCursorScreenPoint();
	// 		document.addEventListener('mousemove', this.handleMouseEvent);
	// 	});
	// 	document.addEventListener('mouseup', () => {
	// 		document.removeEventListener('mousemove', this.handleMouseEvent);
	// 	});
	// }
}

function mapStateToProps(state) {
	return {
		playerList: state.player.playerList,
		playMode: state.player.playMode,
		isShowPlayDetailPage: state.player.isShowPlayDetailPage,
		currentPlaySongId: state.player.currentPlaySongId
		// 测试数据
		// playerList: state.recommendation.recommendSongsList
	};
}
// getSongInfo

function mapDispatchToProps() {
	return {
		changePlayMore: reducers.player.changePlayMore
	};
}
export default connect(mapStateToProps, mapDispatchToProps)(Player);
