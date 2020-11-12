import classnames from 'classnames';
import * as React from 'react';
import { noop } from 'lodash';
import Notification from 'rmc-notification';
import './index.global.less';
// import Icon from '../icon';

const SHORT = 3;

// interface IToastConfig {
//   duration: number;
//   mask: boolean;
// }

const config = {
  duration: SHORT,
  mask: true,
  handle: () => {},
};

let messageInstance: any;
let messageNeedHide: any;
const prefixCls = 'am-toast';

function getMessageInstance(mask: boolean, callback: (instance: any) => void) {
  Notification.newInstance(
    {
      prefixCls,
      style: {}, // clear rmc-notification default style
      transitionName: 'am-fade',
      className: classnames({
        [`${prefixCls}-mask`]: mask,
        [`${prefixCls}-nomask`]: !mask,
      }),
    },
    (notification: any) => callback && callback(notification)
  );
}

function notice(
  content: string,
  type: string,
  duration = config.duration,
  onClose = noop,
  mask = config.mask
) {
  // const iconTypes = {
  //   info: '',
  //   success: 'success',
  //   fail: 'fail',
  //   offline: 'dislike',
  //   loading: 'loading',
  // };
  // const iconType = iconTypes[type];
  messageNeedHide = false;
  getMessageInstance(mask, (notification: any) => {
    if (!notification) {
      return;
    }

    if (messageInstance) {
      messageInstance.destroy();
      messageInstance = null;
    }

    if (messageNeedHide) {
      notification.destroy();
      messageNeedHide = false;
      return;
    }

    messageInstance = notification;

    notification.notice({
      duration,
      style: {},
      content: (
        <div
          className={`${prefixCls}-text ${prefixCls}-text-icon`}
          role="alert"
          aria-live="assertive"
        >
          <div className={`${prefixCls}-text-info`}>
            {/* {!!iconType && <Icon type={iconType} size="lg" />} */}
            <span>{content}</span>
          </div>
        </div>
      ),
      closable: true,
      onClose() {
        if (onClose) {
          onClose();
        }
        notification.destroy();
        notification = null;
        messageInstance = null;
      },
    });
  });
}

export default {
  SHORT,
  LONG: 8,
  show(content: string, duration?: number, mask?: boolean) {
    return notice(content, 'info', duration, () => {}, mask);
  },
  info(
    content: string,
    duration?: number,
    onClose?: () => void,
    mask?: boolean
  ) {
    return notice(content, 'info', duration, onClose, mask);
  },
  success(
    content: string,
    duration?: number,
    onClose?: () => void,
    mask?: boolean
  ) {
    return notice(content, 'success', duration, onClose, mask);
  },
  fail(
    content: string,
    duration?: number,
    onClose?: () => void,
    mask?: boolean
  ) {
    return notice(content, 'fail', duration, onClose, mask);
  },
  offline(
    content: string,
    duration?: number,
    onClose?: () => void,
    mask?: boolean
  ) {
    return notice(content, 'offline', duration, onClose, mask);
  },
  loading(
    content: string,
    duration?: number,
    onClose?: () => void,
    mask?: boolean
  ) {
    return notice(content, 'loading', duration, onClose, mask);
  },
  hide() {
    if (messageInstance) {
      messageInstance.destroy();
      messageInstance = null;
    } else {
      messageNeedHide = true;
    }
  },
  config(conf = {}) {
    const {
      duration = SHORT,
      mask,
    }: { duration?: number; mask?: boolean } = conf;
    config.duration = duration;
    if (mask === false) {
      config.mask = false;
    }
  },
};
