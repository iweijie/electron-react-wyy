import React, { ReactChildren } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import styles from './index.less';

interface IListTitle {
  title: string;
  link?: string;
  children: JSX.Element;
}

const ListTitle = (props: IListTitle) => {
  const { title, link, children } = props;
  return (
    <div className={styles['playlist-title']}>
      <div className={styles.head}>
        {link ? (
          <Link to={link}>
            <div className={styles['head-title']}>
              {title} <i className="iconfont iconarrow-right" />
            </div>
          </Link>
        ) : (
          <div className={styles['head-title']}>
            {title} <i className="iconfont iconarrow-right" />
          </div>
        )}
      </div>
      <div className={styles.container}>{children}</div>
    </div>
  );
};

ListTitle.propTypes = {
  title: PropTypes.string.isRequired,
  link: PropTypes.string,
  children: PropTypes.element,
};

export default ListTitle;
