import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import styles from './index.less';

const PlaylistTitle = (props) => {
	const { title, link, children } = props;
	return (
		<div className={styles['playlist-title']}>
			<div className={styles['head']}>
				<div className={styles['head-title']}>{title}</div>
				<div className={styles['head-more']}>
					{link ? (
						<Link to={link}>
							更多<i className="iconfont iconicon-test6"></i>
						</Link>
					) : null}
				</div>
			</div>
			<div className={styles.container}>{children}</div>
		</div>
	);
};

PlaylistTitle.PropTypes = {
	title: PropTypes.string.isRequired,
	link: PropTypes.string,
	child: PropTypes.element
};

export default PlaylistTitle;
