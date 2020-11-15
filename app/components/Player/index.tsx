import React, { Component } from 'react';
// import electron, { screen, ipcRenderer, remote } from 'electron';
import { CSSTransition } from 'react-transition-group';
import { connect } from 'react-redux';
// import PropTypes from 'prop-types';
// import { Link } from 'react-router-dom';
import Toast from '../Toast/index';
import observer from '../../utils/observer';
import { get, isEmpty, join, map } from 'lodash';
import { loopCallback, getFormatTime } from '../../utils';

import requestMap from '../../request/index';
import PlayList from './playList';
import { reducers } from '../../store';
import styles from './index.less';
import './animation.global.less';

// const AudioStatus.PLAY = 1;
// const PAUSED = 0;
const DEFAULT_TIME = '00:00';

enum AudioStatus {
  PAUSED,
  PLAY,
}

// 0: 循环 1: 顺序 ； 2 随机； 3 单曲
enum PlayMode {
  random,
  order,
  loop,
  single,
}

const PlayModeIcon = ({ mode }: { mode: PlayMode }) => {
  switch (mode) {
    case PlayMode.loop:
      return <i className="iconfont iconxunhuan1" />;
    case PlayMode.random:
      return <i className="iconfont iconsuiji1" />;
    case PlayMode.single:
      return (
        <i className="iconfont iconxunhuan">
          <span>1</span>
        </i>
      );
    case PlayMode.order:
      return <i className="iconfont iconRectangleCopy" />;
    default:
      throw new Error('PlayMode 类型错误');
  }
};

function createAudio() {
  return document.createElement('audio');
}

interface IPlayerProps {
  playerList: any[];
  playMode: PlayMode;
  currentPlaySongId: number;
  changePlayMore: (params: any) => void;
  isShowPlayDetailPage: boolean;
}

interface IPlayerState {
  playListStatus: boolean;
  audioPlayStatus: AudioStatus;
  // 当前歌曲已播放时长
  currentTime: number;
  // 进度条比例
  runningTimeRatio: number;
  // 播放列表
  currentPlayerList: any[];
}

class Player extends Component<IPlayerProps, IPlayerState> {
  audio: HTMLAudioElement;
  loopStopCallBack: null | (() => any);

  volumeRef: React.RefObject<HTMLDivElement>;
  progressRef: React.RefObject<HTMLDivElement>;
  wrapRef: React.RefObject<HTMLDivElement>;

  constructor(props: IPlayerProps) {
    super(props);
    this.audio = createAudio();
    this.initAudio();
    this.loopStopCallBack = null;
    // 容器
    this.wrapRef = React.createRef();
    // 进度
    this.progressRef = React.createRef();
    // 音量
    this.volumeRef = React.createRef();

    this.state = {
      // 是否展示播放野详情
      // isShowPlayDetailPage: false,
      // 当前歌单展示状态
      playListStatus: false,
      // 音乐播放状态：  0： 暂停 ； 1：播放
      audioPlayStatus: AudioStatus.PAUSED,
      // 当前歌曲已播放时长
      currentTime: 0,
      // 进度条比例
      runningTimeRatio: 0,
      // 顺序播放列表
      currentPlayerList: [],
    };
  }

  static propTypes = {
    // title: PropTypes.string.isRequired,
    // link: PropTypes.string,
    // child: PropTypes.element
  };

  componentDidMount() {
    console.log(this.state, this.props);
    // console.log(remote.screen.getCursorScreenPoint());
    // Toast.fail('音乐获取失败，请重新尝试',2);
    // Toast.info('普通的Toast我普通的摇！！', 4000);
    observer.on('play-song', this.handlePlay);
    // this.dragSlide(this.progressWrap);
  }

  handleGlobalClosePlayList = (event: any): void => {
    const { playListStatus } = this.state;
    if (!playListStatus) {
      window.removeEventListener('click', this.handleGlobalClosePlayList);
      return;
    }
    let { target } = event;
    while (target) {
      if (this.wrapRef.current === target) {
        return;
      }

      target = target.parentNode;
    }
    window.removeEventListener('click', this.handleGlobalClosePlayList);
    this.setState({
      playListStatus: false,
    });
  };

  getPlayerModeText = () => {
    const { playMode } = this.props;
    switch (playMode) {
      case PlayMode.loop:
        return '循环播放';
      case PlayMode.random:
        return '随机播放';
      case PlayMode.single:
        return '单曲循环';
      case PlayMode.order:
        return '顺序播放';
      default:
        return '';
    }
  };

  render() {
    const { audio } = this;
    const {
      playListStatus,
      audioPlayStatus,
      currentTime,
      runningTimeRatio,
    } = this.state;
    const {
      playerList,
      playMode,
      currentPlaySongId,
      isShowPlayDetailPage,
    } = this.props;
    const currentPlaySong = playerList.find(
      (player) => player.id === currentPlaySongId
    );
    return (
      <>
        <div className={`${styles.player} _player_wrap`} ref={this.wrapRef}>
          {/* 当有播放歌曲 且 没有展示详情的时候显示 */}
          <div className={styles['small-play-detail']}>
            <CSSTransition
              in={!!currentPlaySongId && !isShowPlayDetailPage}
              timeout={300}
              classNames="small"
              unmountOnExit
            >
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
                    {join(
                      map(
                        get(currentPlaySong, 'album.artists'),
                        (item) => item.name
                      ),
                      '/'
                    )}
                  </p>
                </div>
                <div className={styles.love}>
                  <i className="iconfont iconlove" />
                </div>
              </div>
            </CSSTransition>
          </div>
          {/* 音乐控制功能 */}
          <div className={styles.control}>
            {/* 控制按钮 */}
            <div className={styles.btns}>
              {/* 播放方式 */}
              <div
                className={styles['play-mode']}
                onClick={this.handleChangeMode}
                title={this.getPlayerModeText()}
              >
                <PlayModeIcon mode={playMode} />
              </div>
              <button type="button" className={styles['switch-song']}>
                <i className="iconfont iconSanMiAppglyphico" />
              </button>
              <button
                className={styles['play-btn']}
                type="button"
                onClick={this.handleSwitchAudioPlayStatus}
              >
                {audioPlayStatus ? (
                  <i className="iconfont iconbofangzanting" />
                ) : (
                  <i className="iconfont iconbofang1" />
                )}
              </button>
              <button type="button" className={styles['switch-song']}>
                <i className="iconfont iconSanMiAppglyphico1" />
              </button>
              <button type="button">词</button>
            </div>
            {/* 音乐进度条 */}
            <div className={styles['time-progress']}>
              <div className={styles['time-running']}>
                {isEmpty(playerList)
                  ? DEFAULT_TIME
                  : getFormatTime(currentTime)}
              </div>
              <div ref={this.progressRef} className={styles.progress}>
                <span
                  className={styles['progress-mask']}
                  style={{ width: `${runningTimeRatio}%` }}
                >
                  <i className={styles.drag} />
                </span>
              </div>
              <div className={styles['time-end']}>
                {isEmpty(playerList)
                  ? DEFAULT_TIME
                  : getFormatTime(audio.duration)}
              </div>
            </div>
          </div>
          <div className={styles['control-right']}>
            <div className={styles['sound-progress']}>
              <div className={styles['sound-control']}>
                <i className="iconfont iconshengyin" />
              </div>
              <div ref={this.volumeRef} className={styles.progress}>
                <span
                  className={styles['progress-mask']}
                  style={{ width: `${audio.volume * 100}%` }}
                >
                  <i className={styles.drag} />
                </span>
              </div>
            </div>
            <div
              className={styles['songs-list-btn']}
              onClick={() => this.handleChangePlayListStatus(!playListStatus)}
              title="歌单"
            >
              <i className="iconfont iconbofangliebiao" />
            </div>
          </div>
        </div>

        {/* 歌单列表 */}
        <div style={{ display: playListStatus ? 'block' : 'none' }}>
          <PlayList
            handleClearPlayList={this.handleClearPlayList}
            playerList={playerList}
            currentPlaySongId={currentPlaySongId}
            handleClose={this.handleChangePlayListStatus}
            handleDoubleClick={this.handlePlay}
          />
        </div>
      </>
    );
  }

  initAudio = () => {
    const { audio } = this;
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

  handleCanplay = () => {
    this.handlePlayAudio();
  };

  handleEnded = () => {
    const { audio } = this;
    audio.loop = false;
    // 1: 循环 ； 2 随机； 3 单曲, 4: 顺序
    const { playMode } = this.props;
    switch (playMode) {
      case PlayMode.random:
        return this.randomMode();
      case PlayMode.order:
        return this.orderMode();
      case PlayMode.loop:
        return this.loopMode();
      case PlayMode.single:
        return this.singleMode();
      default:
        return this.loopMode();
    }
  };

  // 循环播放模式
  loopMode = () => {
    const { playerList, currentPlaySongId } = this.props;
    if (!playerList.length) return;
    const currentIndex = playerList.findIndex(
      (player) => currentPlaySongId === player.id
    );
    this.handlePlay(playerList[(currentIndex + 1) % playerList.length]);
  };

  // 随机播放模式
  randomMode = () => {
    let { currentPlayerList } = this.state;
    const { playerList } = this.props;
    if (!playerList.length) return;
    // 随机列表存在曲目 ， 直接 获取
    if (isEmpty(currentPlayerList)) {
      currentPlayerList = this.getRandomList();
    }
    const item = currentPlayerList.pop();
    this.setState({
      currentPlayerList,
    });
    this.handlePlay(item);
  };
  // 单曲循环
  singleMode = () => {
    const { audio } = this;
    audio.loop = true;
  };

  // 顺序播放模式
  orderMode = () => {
    let { currentPlayerList } = this.state;
    const { playerList, currentPlaySongId } = this.props;
    if (!playerList.length) return;
    // 随机列表存在曲目 ， 直接 获取
    if (isEmpty(currentPlayerList)) {
      const findIndex = playerList.findIndex(
        (item) => item.id === currentPlaySongId
      );

      currentPlayerList = playerList.slice(findIndex);
    }
    const item = currentPlayerList.pop();
    this.setState({
      currentPlayerList,
    });
    this.handlePlay(item);
  };

  handleError = () => {
    Toast.fail('音乐获取失败，请重新尝试');
  };
  // 切换 播放 与 暂停
  handleSwitchAudioPlayStatus = () => {
    const { playerList, currentPlaySongId } = this.props;
    if (!playerList.length) return;
    const { audioPlayStatus } = this.state;
    if (audioPlayStatus === AudioStatus.PLAY) {
      // 播放切暂停
      this.handleStopAudio();
    } else if (!currentPlaySongId) {
      // 未播放切播放，将播放 列表第一项
      this.handlePlay(playerList[0]);
    } else {
      // 暂停状态切回播放
      this.handlePlayAudio();
    }
  };

  handleSwitchSong = (src: string, id: string) => {
    const { changePlayMore } = this.props;
    const audio = this.audio;
    this.handleStopAudio();
    changePlayMore({
      // 当前列表播放歌曲id
      currentPlaySongId: id,
    });
    audio.src = src;
  };

  handlePlayAudio = () => {
    const { currentPlaySongId } = this.props;
    if (!currentPlaySongId) return;
    const { audio } = this;
    if (audio.paused) {
      audio.play();
    }
    this.handleStopLoopCallBack();

    this.loopStopCallBack = loopCallback(() => {
      const currentTime = audio.currentTime;
      const duration = audio.duration || 0;
      // 满进度100 ；   保留两位小数
      const runningTimeRatio = Math.max(
        Math.floor((currentTime / duration) * 10000) / 100,
        0
      );
      this.setState({
        currentTime,
        runningTimeRatio,
      });
    }, 100);
    this.setState({
      audioPlayStatus: AudioStatus.PLAY,
      currentTime: audio.currentTime,
    });
  };

  handleStopAudio = () => {
    const { audio } = this;
    if (!audio.paused) {
      audio.pause();
    }
    this.handleStopLoopCallBack();
    this.setState({ audioPlayStatus: AudioStatus.PAUSED });
  };

  handleStopLoopCallBack = () => {
    if (this.loopStopCallBack) {
      this.loopStopCallBack();
      this.loopStopCallBack = null;
    }
  };

  handleChangePlayListStatus = (status: boolean) => {
    const { playListStatus } = this.state;
    status = status === undefined ? !playListStatus : status;

    if (status) {
      setTimeout(() => {
        window.addEventListener('click', this.handleGlobalClosePlayList);
      }, 100);
    }
    this.setState({
      playListStatus: status,
    });
  };

  handlePlay = async (item: any) => {
    const { currentPlaySongId } = this.props;
    const id = get(item, 'id');
    if (!id || currentPlaySongId === id) return;
    // 获取歌曲信息，包含当前歌曲资源链接
    const data = await requestMap.requestGetSong({ id });
    if (!get(data, 'id') || !get(data, 'url')) return;
    this.handleSwitchSong(get(data, 'url'), get(data, 'id'));
  };

  getRandomList = () => {
    const { currentPlaySongId, playerList } = this.props;
    let list = [...playerList];
    if (!list.length) return list;
    if (currentPlaySongId) {
      list = list.filter((item) => item.id !== currentPlaySongId);
    }
    return this.disorder(list, 3);
  };

  disorder = (arr: any[], l = 2) => {
    l = l || 1;
    for (let i = l - 1; i >= 0; i--) {
      arr.sort(function () {
        return 0.5 - Math.random();
      });
    }
    return arr;
  };
  // 切换播放模式后的 处理程序
  handleChangePlayModeCall = (mode: PlayMode) => {
    const { audio } = this;
    audio.loop = false;
    switch (mode) {
      case PlayMode.loop:
        this.randomMode();
        break;
      case PlayMode.random:
        break;
      case PlayMode.single:
        audio.loop = true;
        break;
      case PlayMode.order:
        break;
      default:
        throw new Error('播放模式错误');
    }
  };
  // 切换播放模式
  handleChangeMode = () => {
    const { changePlayMore, playMode } = this.props;
    const mode = (playMode + 1) % 4;
    changePlayMore({
      playMode: mode,
      currentPlayerList: [],
    });
    this.handleChangePlayModeCall(mode);
  };

  // 清空播放列表
  handleClearPlayList = () => {
    const { changePlayMore } = this.props;
    this.handleStopAudio();
    this.setState({
      currentTime: 0,
      currentPlayerList: [],
    });
    changePlayMore({
      playerList: [],
      currentPlaySongId: '',
    });
  };

  getSmallSongImg = (item: any) => {
    const url = get(item, 'album.blurPicUrl', '');
    if (url) return `${url}?param=140y140`;
    return url;
  };

  handleShowDetail = () => {
    const { changePlayMore } = this.props;
    changePlayMore({
      isShowPlayDetailPage: true,
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

function mapStateToProps(state: any) {
  return {
    playerList: state.player.playerList,
    playMode: state.player.playMode,
    isShowPlayDetailPage: state.player.isShowPlayDetailPage,
    currentPlaySongId: state.player.currentPlaySongId,
    // 测试数据
    // playerList: state.recommendation.recommendSongsList
  };
}
// getSongInfo

function mapDispatchToProps() {
  return {
    changePlayMore: reducers.player.changePlayMore,
  };
}
export default connect(mapStateToProps, mapDispatchToProps)(Player);
