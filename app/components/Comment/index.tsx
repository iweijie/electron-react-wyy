import React, { Component } from 'react';
import { get, map, noop } from 'lodash';
import classnames from 'classnames';
import placeholder from 'static/images/placeholder.jpg'
import { SimpleImg } from 'react-simple-img';
import { formatDate } from '../../utils/index';
import { reducers } from '../../store/index';
import styles from './index.less';

interface IBasicComment {
  user: {
    nickname: string;
    avatarUrl: string;
  };
  beRepliedCommentId: number;
  content: string;
}

type IBeReplied = IBasicComment[];

interface ICommentItemProps extends IBasicComment {
  beReplied: IBeReplied;
  time: number;
  likedCount: number;
  liked: boolean;
}

const getFormatTime = (time: number): string => {
  const today = new Date(formatDate(new Date(), 'yyyy-MM-dd') + ' 00:00:00');
  const thisYear = new Date(formatDate(new Date(), 'yyyy') + '-1-1 00:00:00');
  const todayTimestamp = today.getTime();
  const tomorrowTimestamp = todayTimestamp - 24 * 60 * 60 * 1000;

  if (time >= todayTimestamp) {
    return formatDate(time, 'hh:mm');
  } else if (time >= tomorrowTimestamp) {
    return `昨天 ${formatDate(time, 'hh:mm')}`;
  } else if (time >= thisYear.getTime()) {
    return formatDate(time, 'MM-dd hh:mm');
  }
  return formatDate(time, 'yyyy-MM-dd hh:mm');
};

const getCommentItem = (item: ICommentItemProps) => {
  const commentId = get(item, 'commentId');
  const avatarUrl = get(item, 'user.avatarUrl');
  const nickname = get(item, 'user.nickname');
  const content = get(item, 'content');
  const likedCount = get(item, 'likedCount');
  const time = get(item, 'time');
  const liked = get(item, 'liked');
  const beReplied = get(item, 'beReplied', []);
  // style={{ backgroundImage: `url(${avatarUrl})` }}>
  return (
    <li key={commentId} className={styles['comment-item']}>
      <div className={styles.avatar}>
        <SimpleImg height={36} width={36} src={`${avatarUrl}?param=50y50`} placeholder={placeholder} />
      </div>
      <div className={styles['comment-content']}>
        <p className={styles.content}>
          <span className={styles.nickname}>{nickname}：</span>
          {content}
        </p>
        {map(beReplied, (item) => {
          return (
            <p
              key={item.beRepliedCommentId}
              className={classnames(styles.content, styles.grey)}
            >
              <span className={styles.nickname}>@{item.user.nickname}：</span>
              {item.content}
            </p>
          );
        })}
        <div className={styles.footer}>
          <time className={styles.time}>{getFormatTime(time)}</time>
          <div className={styles.icon}>
            <span
              className={classnames({
                [styles.liked]: liked,
              })}
            >
              <i className="iconfont icondianzan" />
              {likedCount}
            </span>
            <span>
              <i className="iconfont iconshare" />
            </span>
            <span>
              <i className="iconfont iconpinglun1" />
            </span>
          </div>
        </div>
      </div>
    </li>
  );
};

interface ICommentProps {
  list: ICommentItemProps[];
  // limit: number;
  // offset: number;
  // total: number;
}

export default (props: ICommentProps) => {
  const { list } = props;

  return (
    <div className={styles.wrap}>
      <ul className={styles['comment-wrap']}>{map(list, getCommentItem)}</ul>
    </div>
  );
};
