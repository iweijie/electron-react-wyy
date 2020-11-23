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
  // 播放列表
  currentPlayerList: any[];
}

interface IPlayerState {
  playListStatus: boolean;
  audioPlayStatus: AudioStatus;
  // 当前歌曲已播放时长
  currentTime: number;
  // 进度条比例
  runningTimeRatio: number;
}

class Player extends Component<IPlayerProps, IPlayerState> {
  audio: HTMLAudioElement;
  loopStopCallBack: null | (() => any);

  volumeRef: React.RefObject<HTMLDivElement>;
  progressRef: React.RefObject<HTMLDivElement>;
  wrapRef: React.RefObject<HTMLDivElement>;
  playListWrapRef: React.RefObject<HTMLDivElement>;

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
    // 当前播放歌单列表容器
    this.playListWrapRef = React.createRef();

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
      document.removeEventListener('click', this.handleGlobalClosePlayList);
      return;
    }
    let { target } = event;
    while (target) {
      if (this.playListWrapRef.current === target) {
        return;
      }

      target = target.parentNode;
    }
    document.removeEventListener('click', this.handleGlobalClosePlayList);
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
          <div className={styles['small-play-detail']}>
            <CSSTransition
              in={!!currentPlaySongId}
              timeout={300}
              classNames="small"
              unmountOnExit
            >
              <div className={styles['small-song']}>
                <div className={styles['small-song-img']}>
                  <div className={styles.mask} onClick={this.handleShowDetail}>
                    {isShowPlayDetailPage ? (
                      <i className="iconzhankaiquanpingkuozhan iconfont" />
                    ) : (
                      <i className="iconzhankaiquanpingkuozhan iconfont" />
                    )}
                  </div>
                  <img src={this.getSmallSongImg(currentPlaySong)} alt="" />
                </div>
                <div className={styles['small-song-name']}>
                  <p className={styles.name}>{get(currentPlaySong, 'name')}</p>
                  <p className={styles.artists}>
                    {join(
                      map(
                        get(currentPlaySong, 'artists'),
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
        <div
          ref={this.playListWrapRef}
          style={{ display: playListStatus ? 'block' : 'none' }}
        >
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
    let { currentPlayerList } = this.props;
    const { playerList } = this.props;
    if (!playerList.length) return;
    // 1: 循环 ； 2 随机； 3 单曲, 4: 顺序
    const { playMode } = this.props;
    let item: any;

    if (playMode === PlayMode.random) {
      item = currentPlayerList.pop();
      if (!item) {
        currentPlayerList = this.randomMode();
        item = currentPlayerList.pop();
      }
    } else if (playMode === PlayMode.order) {
      item = currentPlayerList.pop();
      if (!item) {
        this.handleStopAudio();
        this.setState({
          runningTimeRatio: 0,
        });
        // eslint-disable-next-line no-useless-return
        return;
      }
    } else if (playMode === PlayMode.loop) {
      item = this.loopMode();
    } else if (PlayMode.single) {
      console.log('单曲循环的人儿呀');
    } else {
      throw new Error('模式错误');
    }

    this.handlePlay(item);
  };

  // 循环播放模式
  loopMode = () => {
    const { playerList, currentPlaySongId } = this.props;
    const currentIndex = playerList.findIndex(
      (player) => currentPlaySongId === player.id
    );
    const playItem = playerList[(currentIndex + 1) % playerList.length];
    return playItem;
  };

  // 随机播放模式
  randomMode = () => {
    let { currentPlayerList } = this.props;
    const { playerList, changePlayMore } = this.props;
    if (!isEmpty(playerList)) {
      currentPlayerList = [];
    } else {
      currentPlayerList = this.getRandomList();
    }
    changePlayMore({ currentPlayerList });
    return currentPlayerList;
  };
  // 单曲循环
  singleMode = () => {
    const { audio } = this;
    audio.loop = true;
  };

  // 顺序播放模式
  orderMode = () => {
    let currentPlayerList: any[];
    const { playerList, currentPlaySongId, changePlayMore } = this.props;
    if (!playerList.length) {
      currentPlayerList = [];
    } else {
      const findIndex = playerList.findIndex(
        (item) => item.id === currentPlaySongId
      );
      currentPlayerList = playerList.slice(findIndex + 1);
    }
    changePlayMore({
      currentPlayerList,
    });
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
        document.addEventListener('click', this.handleGlobalClosePlayList);
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
  handleChangePlayModeCall = (mode: PlayMode): any => {
    const { audio } = this;
    audio.loop = false;
    switch (mode) {
      case PlayMode.loop:
        this.loopMode();
        break;
      case PlayMode.random:
        this.randomMode();
        break;
      case PlayMode.single:
        audio.loop = true;
        break;
      case PlayMode.order:
        this.orderMode();
        return;
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
    });
    changePlayMore({
      currentPlayerList: [],
      playerList: [],
      currentPlaySongId: '',
    });
  };

  getSmallSongImg = (item: any) => {
    const url = get(item, 'album.picUrl', '');
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
    currentPlayerList: state.player.currentPlayerList,
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
