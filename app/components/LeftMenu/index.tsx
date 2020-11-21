import React, { Component } from 'react';
import { Link, useRouteMatch, useLocation } from 'react-router-dom';
import { get, map } from 'lodash';
import classnames from 'classnames';
import Icon from '../Icon/index';
import styles from './index.less';

interface IListItem {
  name: string;
  url: string;
}

const list: IListItem[] = [
  {
    name: '发现音乐',
    url: '/discoverMusic/recommendation',
  },
  {
    name: '视频',
    url: '/a',
  },
  {
    name: '朋友',
    url: '/a',
  },
  {
    name: '直播',
    url: '/a',
  },
  {
    name: '私人FM',
    url: '/a',
  },
];

interface ISubItem extends IListItem {
  icon: string;
}

interface IList {
  title: string;
  sub: ISubItem[];
}

const myMusic: IList = {
  title: '我的音乐',
  sub: [
    {
      icon: 'iconwuxianpu',
      name: '本地音乐',
      url: '/',
    },
    {
      icon: 'iconxiazai',
      name: '下载管理',
      url: '/',
    },
    {
      icon: 'iconicon-',
      name: '我的音乐云盘',
      url: '/',
    },
    {
      icon: 'iconfasheta',
      name: '我的电台',
      url: '/',
    },
    {
      icon: 'iconwodexingqiu_shoucangdeshangpin',
      name: '我的收藏',
      url: '/',
    },
  ],
};

const LeftMenu = () => {
  const { pathname } = useLocation();
  return (
    <div className={styles['left-nav']}>
      <div className={styles.list}>
        {map(list, (item, index) => {
          return (
            <Link key={index} to={item.url}>
              <div
                className={classnames(styles['list-item'], {
                  [styles.active]: pathname === item.url,
                })}
              >
                {item.name}
              </div>
            </Link>
          );
        })}
      </div>
      <div className={styles['sub-wrap']}>
        <p>{myMusic.title}</p>
        <div className={styles.list}>
          {map(myMusic.sub, (item: ISubItem, index) => {
            return (
              <Link to={item.url} key={index}>
                <div
                  className={classnames(styles['list-item'], {
                    [styles.active]: pathname === item.url,
                  })}
                >
                  <i className={classnames('iconfont', item.icon)} />
                  <span>{item.name}</span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default LeftMenu;
