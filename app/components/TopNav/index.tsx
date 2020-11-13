import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { ipcRenderer } from 'electron';
import { get, noop } from 'lodash';
import classnames from 'classnames';
import styles from './index.less';
import Icon from '../Icon';
import historyStack from '../../utils/historyStack';
import { reducers } from '../../store';
import history from '../../utils/history';

const POP = 'POP';
const REPLACE = 'REPLACE';
const PUSH = 'PUSH';

interface IHashRoute {
  pathname: string;
  search: string;
  hash: string;
  state: any;
}

window.a = historyStack;

interface ITopNavProps {
  userInfo: any;
}

class TopNav extends Component<ITopNavProps> {
  currentButtonIsClicked: number;

  constructor(props: any) {
    super(props);
    // 1：后退 ； 2 前进 ； 0 ： 空
    this.currentButtonIsClicked = 0;
  }

  state = {
    isShowTip: false,
    isBack: false,
    isForward: false,
  };

  componentDidMount() {
    this.initForwardAndBack();
    history.listen(this.handleListenHistory);
    ipcRenderer.on('window-size-change', this.handleWindowSizeChange);
  }
  handleListenHistory = (
    route: IHashRoute,
    type: 'POP' | 'REPLACE' | 'PUSH'
  ) => {
    console.log('handleListenHistory', '----', type, '----', route);
    const { currentButtonIsClicked } = this;
    const { pathname } = route;
    let isBack = false;
    let isForward = false;

    const mainPathname = get(historyStack, 'firstMainStack.pathname');
    const backPathname = get(historyStack, 'firstForwardStack.pathname');

    if (type === PUSH) {
      if (mainPathname !== pathname) {
        isForward = false;
        isBack = true;
        historyStack.push(route);
      }
    } else if (type === REPLACE) {
      historyStack.replace(route);
      isForward = false;
      isBack = historyStack.canBack;
    } else if (type === POP) {
      if (currentButtonIsClicked === 1 && historyStack.canBack) {
        console.log('历史栈 回退');
        historyStack.back();
        isForward = true;
        isBack = historyStack.canBack;
      } else if (currentButtonIsClicked === 2 && historyStack.canForward) {
        console.log('历史栈 前进');
        historyStack.forward();
        isForward = historyStack.canForward;
        isBack = true;
      } else if (pathname === get(historyStack, 'firstMainStack.pathname')) {
        console.log('重复路由');
      } else {
        console.error('历史栈错误');
      }
    }
    this.currentButtonIsClicked = 0;
    this.setState({
      isBack,
      isForward,
    });
  };

  initForwardAndBack = () => {
    const l = window.location;
    historyStack.push({
      hash: '',
      key: 'init_Key',
      pathname: get(l, 'hash', '').replace('#', ''),
      search: get(l, 'search', ''),
      state: undefined,
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
    reducers.common.handleChangeWindowState(state);
  };

  handleWatchGlobalClick = (e) => {
    let target = e.target;
    while (target) {
      if (
        target &&
        target.classList &&
        target.classList.contains('_user_click_class')
      )
        return;
      target = target.parentNode;
    }
    this.setState({
      isShowTip: false,
    });
    window.removeEventListener('click', this.handleWatchGlobalClick);
  };
  handleShowTip = () => {
    const { isShowTip } = this.state;
    if (isShowTip) return;
    this.setState({
      isShowTip: true,
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
    return (
      <div className={styles['top-nav']}>
        <div className={styles['top-nav-left']}>
          <h1>网易云音乐</h1>
          <Link to="/discoverMusic/recommendation">
            <div className={styles['logo-wrap']}>
              <div className={styles.logo}>
                <i className="iconfont iconwangyiyunyinle1" />
              </div>
            </div>
          </Link>
        </div>
        <div className={styles['top-nav-right']}>
          <div className={styles['top-nav-search']}>
            <div className={styles['top-nav-search-btn']}>
              <span
                onClick={isBack ? this.handleBack : noop}
                className={classnames(styles.btn, {
                  [styles.active]: isBack,
                })}
              >
                <i className="iconicon-test4 iconfont" />
              </span>
              <span
                onClick={isForward ? this.handleForward : noop}
                className={classnames(styles.btn, {
                  [styles.active]: isForward,
                })}
              >
                <i className="iconicon-test6 iconfont" />
              </span>
            </div>
            <div className={styles['top-nav-search-input']}>
              <i className="iconsousuo iconfont" />
              <input type="text" placeholder="搜索" />
            </div>
          </div>
          <div className={styles['top-nav-tool-wrap']}>
            <div
              onClick={this.handleShowTip}
              className={`_user_click_class ${styles['user-info']} ${
                isShowTip ? styles.active : ''
              }`}
            >
              <div className={styles['user-via']}>
                <img src={get(userInfo, 'profile.avatarUrl')} alt="avatarUrl" />
              </div>
              <div className={styles['user-name']}>
                {get(userInfo, 'profile.nickname')}
              </div>
              {isShowTip ? (
                <ul className={styles['user-popup']}>
                  <li>退出登入</li>
                </ul>
              ) : null}
            </div>
            <div className={styles['top-nav-tool']}>
              <div onClick={handleMinimize} title="min模式">
                <i className="iconMINIMIZE iconfont" />
              </div>
              <div onClick={handleMinimize} title="最小化">
                <i className="iconzuixiaohua1 iconfont" />
              </div>
              <div onClick={handleMaximize} title="最大化">
                <i className="iconzuidahua1 iconfont" />
              </div>
              <div onClick={handleClose} title="关闭">
                <i className="iconclose iconfont" />
              </div>
              {/* <Icon onClick={handleMinimize} type="mini" />
              <Icon onClick={handleMinimize} type="heng" />
              <Icon onClick={handleMaximize} type="mouth" />
              <Icon onClick={handleClose} type="close" /> */}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state: any) {
  return {
    windowState: state.common.windowState,
    userInfo: state.common.userInfo,
  };
}

export default connect(mapStateToProps)(TopNav);
