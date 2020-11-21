import React from 'react';
import { Link, useLocation, matchPath } from 'react-router-dom';
import { map } from 'lodash';
import classnames from 'classnames';
import styles from './index.less';

interface INavItem {
  name: string;
  url: string;
}

const navList: INavItem[] = [
  {
    name: '个性推荐',
    url: '/discoverMusic/recommendation',
  },
  {
    name: '歌单',
    url: '/a',
  },
  {
    name: '主播电台',
    url: '/b',
  },
  {
    name: '排行榜',
    url: '/c',
  },
  {
    name: '歌手',
    url: '/d',
  },
  {
    name: '最新音乐',
    url: '/e',
  },
];

const DiscoverTopNav = () => {
  const { pathname } = useLocation();
  return (
    <div className={styles.list}>
      {map(navList, (item) => {
        return (
          <Link to={item.url} key={item.url}>
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
  );
};

export default DiscoverTopNav;
