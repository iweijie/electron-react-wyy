import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { get } from 'lodash';
import requestMap from '../../request/index';
import PlayList from './playList';
import styles from './index.less';

class Player extends Component {
	constructor(props) {
		super(props);
		this.audio = document.createElement('audio');
		this.initAudio();
		this.state = {
			// 当前歌单展示状态
			playListStatus: false
		};
	}

	static propTypes = {
		// title: PropTypes.string.isRequired,
		// link: PropTypes.string,
		// child: PropTypes.element
	};

	render() {
		const { playListStatus } = this.state;
		const { currentIndex, playerList } = this.props;
		return (
			<div className={styles.player}>
				<div className={styles.song} />
				<div className={styles.control}>
					<div className={styles.btns}>
						<button>
							<i className="iconfont iconshangyishou" />
						</button>
						<button>
							<i className="iconfont iconbofang" />
						</button>
						<button>
							<i className="iconfont iconxiayishou" />
						</button>
					</div>
					<div className={styles['time-progress']}>
						<div className={styles['time-running']}>00:55</div>
						<div className={styles.progress}>
							<span className={styles['progress-mask']}>
								<i className={styles.drag} />
							</span>
						</div>
						<div className={styles['time-end']}>00:55</div>
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
		audio.removeEventListener('canplaythrough', this.handleCanplaythrough);
		audio.removeEventListener('ended', this.handleEnded);
		audio.removeEventListener('error', this.handleError);
		audio.addEventListener('canplaythrough', this.handleCanplaythrough);
		audio.addEventListener('error', this.handleError);
		audio.addEventListener('ended', this.handleEnded);
	};

	handleCanplaythrough = (event) => {
		const audio = this.audio;
		if (audio) {
			audio.play();
		}
	};

	handleEnded = (event) => {
		// 1: 循环 ； 2 随机； 3 单曲
		const { playMode } = this.props;
		if (type == 0) {
			audio.addEventListener('ended', this.ended);
		} else if (type == 1) {
			audio.addEventListener('ended', this.randomended);
		} else if (type == 2) {
			audio.loop = true;
		}
	};

	handleError(e) {
		this.show('音乐获取失败，请重新尝试');
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

	switchsong = (src) => {
		const audio = this.audio;
		if (!audio.paused) {
			audio.pause();
		}
		audio.src = src;
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

	handleChangePlayListStatus = () => {
		const { playListStatus } = this.state;
		this.setState({
			playListStatus: !playListStatus
		});
	};

	getSongInfo = async (id) => {
		return requestMap.requestGetSong({ id });
	};

	handlePlayListDoubleClick = async (item, index) => {
		const id = get(item, 'id');
		if (!id) return;
		const data = await this.getSongInfo(id);
		const { url } = data;
		if (!get(data, 'id')) return;

		// http://m7.music.126.net/20191208180615/c83e022d79442dd434a0db86b2a54ddc/ymusic/545b/0708/535b/c1d7f5b6540b12556a69d1145fe26d1f.mp3
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

// function mapDispatchToProps() {
// 	return {
// 		getRecommendSongs: reducers.com.getSongInfo
// 	};
// }
export default connect(mapStateToProps)(Player);
