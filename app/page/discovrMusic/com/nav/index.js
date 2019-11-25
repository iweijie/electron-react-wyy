import React from 'react';
import { Link } from 'react-router-dom';
import styles from './index.less';

const rootpath = '/discovrMusic';

const navList = [
	{ name: '个性推荐', path: `${rootpath}/recommendation` },
	{ name: '歌单', path: '1111' },
	{ name: '主播电台', path: '1111' },
	{ name: '排行榜', path: '1111' },
	{ name: '歌手', path: '1111' },
	{ name: '最新音乐', path: '1111' }
	// 推荐排行榜歌单主播电台歌手新碟上架
];

export default (props) => {
	const { match } = props;
	return (
		<ul className={styles['ul']}>
			{navList.map((item) => {
				const isActive = match.path === item.path;

				
				return (
					<li className={isActive ? styles.active : ''}>
						<Link to={item.path}>{item.name}</Link>
					</li>
				);
			})}
		</ul>
	);
};
