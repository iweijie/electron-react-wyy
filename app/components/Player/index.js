import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Toast from 'components/Toast';
import { get, isNaN } from 'lodash';
import { loopCallback, getFormatTime } from '../../utils';
import requestMap from '../../request/index';
import PlayList from './playList';
import styles from './index.less';
import { reducers } from '../../store';

class Player extends Component {
	constructor(props) {
		super(props);
		this.audio = document.createElement('audio');
		this.initAudio();
		this.loopStopCallBack = null;
		this.state = {
			// 当前歌单展示状态
			playListStatus: false,
			//音乐播放状态：  0： 暂停 ； 1：播放
			audioPlayStatus: 0,
			// 当前歌曲已播放时长
			currentTime: 0
		};
	}

	static propTypes = {
		// title: PropTypes.string.isRequired,
		// link: PropTypes.string,
		// child: PropTypes.element
	};

	render() {
		const { audio } = this;
		const { playListStatus, audioPlayStatus, currentTime } = this.state;
		const { currentIndex, playerList } = this.props;
		return (
			<div className={styles.player}>
				<div className={styles.song} />
				<div className={styles.control}>
					<div className={styles.btns}>
						<button>
							<i className="iconfont iconshangyishou" />
						</button>
						<button onClick={this.handleSwitchAudioPlayStatus}>
							{audioPlayStatus ? (
								<i className="iconfont iconzanting" />
							) : (
								<i className="iconfont iconbofang" />
							)}
						</button>
						<button>
							<i className="iconfont iconxiayishou" />
						</button>
					</div>
					<div className={styles['time-progress']}>
						<div className={styles['time-running']}>{getFormatTime(currentTime)}</div>
						<div className={styles.progress}>
							<span
								className={styles['progress-mask']}
								style={{ width: `${this.getAudioProgressRatio()}%` }}
							>
								<i className={styles.drag} />
							</span>
						</div>
						<div className={styles['time-end']}>{getFormatTime(audio.duration)}</div>
					</div>
					<div className={styles['sound-progress']}>
						<div className={styles['sound-control']}>
							<i className="iconfont iconshengyin" />
						</div>
						<div className={styles.progress}>
							<span className={styles['progress-mask']} />
						</div>
					</div>
					<div className={styles['play-mode']} title="模式">
						<i className="iconfont iconxunhuan1" />
					</div>
					<div className={styles['songs-list-btn']} onClick={this.handleChangePlayListStatus} title="歌单">
						<i className="iconfont iconRectangleCopy" />
					</div>
				</div>
				<div style={{ display: playListStatus ? 'block' : 'none' }}>
					<PlayList
						playerList={playerList}
						currentIndex={currentIndex}
						handleClose={this.handleChangePlayListStatus}
						handleDoubleClick={this.handlePlayListDoubleClick}
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
	// 满进度100 ；   保留两位小数
	getAudioProgressRatio = () => {
		const { currentTime } = this.state;
		const duration = this.audio.duration;
		if (!duration || !currentTime) return 0;
		return Math.floor(currentTime / duration * 10000) / 100;
	};

	handleCanplay = (event) => {
		this.handlePlay();
	};

	handleEnded = (event) => {
		// 1: 循环 ； 2 随机； 3 单曲
		const { playMode } = this.props;
		switch (playMode) {
			case 1:
				return this.loopMode();
			case 2:
				return this.loopMode();
			case 3:
				return this.loopMode();
			default:
				return this.loopMode();
		}
		if (playMode == 1) {
			// audio.addEventListener('ended', this.ended);
		} else if (playMode == 1) {
			// audio.addEventListener('ended', this.randomended);
		} else if (playMode == 2) {
			audio.loop = true;
		}
	};

	loopMode = () => {
		const { currentIndex, playerList, changePlayMore } = this.props;
		const nextIndex = (currentIndex + 1) % playerList.length;
		this.handlePlayListDoubleClick(playerList[nextIndex], nextIndex);
	};

	handleError(e) {
		Toast('音乐获取失败，请重新尝试');
		// this.changePlayInfo({
		// 	type: [ 3 ],
		// 	state: true
		// });
		// this.changeAudio({
		// 	type: [ 2, 3 ],
		// 	flag: false,
		// 	sign: true
		// });
	}

	handleSwitchAudioPlayStatus = () => {
		let { audioPlayStatus } = this.state;
		if (audioPlayStatus === 1) {
			this.handleStop();
		} else {
			this.handlePlay();
		}
	};

	handleSwitchSong = (src, id, index) => {
		const { changePlayMore } = this.props;
		const audio = this.audio;
		this.handleStop();
		changePlayMore({
			currentIndex: index,
			// 当前列表播放歌曲id
			currentPlaySongId: id
		});
		audio.src = src;
	};

	handlePlay = () => {
		const { currentPlaySongId } = this.props;
		if (!currentPlaySongId) return;
		const audio = this.audio;
		if (audio.paused) {
			audio.play();
		}
		if (this.loopStopCallBack) {
			this.loopStopCallBack();
		}
		this.loopStopCallBack = loopCallback(() => {
			this.setState({
				currentTime: this.getAudioCurrentTime()
			});
		}, 100);
		this.setState({ audioPlayStatus: 1, currentTime: audio.currentTime });
	};

	handleStop = () => {
		const audio = this.audio;
		if (!audio.paused) {
			audio.pause();
		}
		this.setState({ audioPlayStatus: 0 });
	};

	handleChangePlayListStatus = () => {
		const { playListStatus } = this.state;
		this.setState({
			playListStatus: !playListStatus
		});
	};
	// 获取歌曲信息，包含当前歌曲资源链接
	getSongInfo = async (id) => {
		return requestMap.requestGetSong({ id });
	};

	handlePlayListDoubleClick = async (item, index) => {
		const id = get(item, 'id');
		if (!id) return;
		const data = await this.getSongInfo(id);
		if (!get(data, 'id') || !get(data, 'url')) return;
		this.handleSwitchSong(get(data, 'url'), get(data, 'id'), index);
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
}

function mapStateToProps(state) {
	return {
		playerList: state.player.playerList,
		playMode: state.player.playMode,
		currentIndex: state.player.currentIndex,
		currentPlaySongId: state.player.currentPlaySongId,
		// 测试数据
		playerList: state.recommendation.recommendSongsList
	};
}
// getSongInfo

function mapDispatchToProps() {
	return {
		changePlayMore: reducers.player.changePlayMore
	};
}
export default connect(mapStateToProps, mapDispatchToProps)(Player);
