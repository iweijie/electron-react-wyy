/**
 * 歌单下拉选择框
 * author: 许佩文
 * time: 2019-12-18 24:00
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Icon from '../Icon/index';

import styles from './index.less';

class Select extends Component<{}> {
  static propTypes = {
    value: PropTypes.string,
    visible: PropTypes.bool,
    handleClose: PropTypes.func,
  };

  static defaultProps = {
    value: '',
  };

  constructor(props: Readonly<{}>) {
    super(props);
    this.state = {};
  }

  componentDidUpdate(preProps: any) {
    if (this.props.visible !== preProps) {
      if (this.props.visible) {
        window.addEventListener('click', this.handleSelectorOutRangeClick);
      } else {
        window.removeEventListener('click', this.handleSelectorOutRangeClick);
      }
    }
  }

  componentWillUnmount() {
    window.removeEventListener('click', this.handleSelectorOutRangeClick);
  }

  handleSelectorOutRangeClick = (e) => {
    let target = e.target;
    let isFind = false;
    while (target) {
      if (target && target.dataset && target.dataset.id === 'selectorWrap') {
        isFind = true;
        return;
      }
      target = target.parentNode;
    }
    if (!isFind) {
      this.props.handleClose();
    }
  };

  render() {
    // console.log(this.props, 'props')
    const { value, visible } = this.props;
    return (
      <div className={styles.selectorWrap} data-id="selectorWrap">
        <div
          className={styles.selector}
          onClick={this.props.handleSelectorClick}
        >
          <span>{value}</span>
          <Icon type="arrowDown" className={styles.arrowDown} />
        </div>
        <div
          className={classNames(styles.menuContent, {
            [styles.menulistShow]: visible,
          })}
        >
          <div className={styles.addLabel} data-id="selectorWrap">
            添加标签
          </div>
          <div className={styles.menulist}>{this.props.children}</div>
        </div>
      </div>
    );
  }
}

export default Select;
