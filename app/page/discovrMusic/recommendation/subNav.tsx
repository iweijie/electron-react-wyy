import React from 'react';
import { Link, useLocation } from 'react-router-dom';
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
    url: '/discovrMusic/recommendation',
  },
  {
    name: '歌单',
    url: '/a',
  },
  {
    name: '主播电台',
    url: '/a',
  },
  {
    name: '排行榜',
    url: '/a',
  },
  {
    name: '歌手',
    url: '/a',
  },
  {
    name: '最新音乐',
    url: '/a',
  },
];

const SubNav = () => {
  const { pathname } = useLocation();
  return (
    <div className={styles['nav-list']}>
      {map(navList, (item) => {
        return (
          <Link to={item.url}>
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

export default SubNav;
