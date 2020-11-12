import React, { Component } from 'react';
import { ipcRenderer } from 'electron';
import { get, noop } from 'lodash';
import styles from './index.less';
import historyStack from '../../utils/historyStack';
import history from '../../utils/history';

const POP = 'POP';
const REPLACE = 'REPLACE';
const PUSH = 'PUSH';

window.a = historyStack;

class HistoryStack extends Component {
  currentButtonIsClicked;

  constructor(props: any) {
    super(props);
    // 1：后退 ； 2 前进 ； 0 ： 空
    this.currentButtonIsClicked = 0;
  }

  state = {
    isBack: false,
    isForward: false,
  };

  componentDidMount() {
    this.initForwardAndBack();
    history.listen(this.handleListenHistory);
  }

  handleListenHistory = (route, type, ...other) => {
    console.log(route, type, other);
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

  handleBack = () => {
    this.currentButtonIsClicked = 1;
    history.goBack();
  };
  handleForward = () => {
    this.currentButtonIsClicked = 2;
    history.go(1);
  };

  render() {
    const { isBack, isForward } = this.state;
    return (
      <div className={styles['top-nav-search-btn']}>
        <span
          onClick={isBack ? this.handleBack : noop}
          className={isBack ? styles['back-btn-active'] : styles['back-btn']}
        />
        <span
          onClick={isForward ? this.handleForward : noop}
          className={
            isForward ? styles['forward-btn-active'] : styles['forward-btn']
          }
        />
      </div>
    );
  }
}

export default HistoryStack;
