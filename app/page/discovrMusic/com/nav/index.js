import React from 'react';
import { Link } from 'react-router-dom';
import { navList } from '../../contain';
import styles from './index.less';

export default (props) => {
	const { match } = props;
  const isActiveItem = navList.find((item) => match.url === item.path);
	return isActiveItem ? (
		<ul className={styles['ul']}>
			{navList.map((item) => {
				const isActive = match.url === item.path;
				return (
					<li key={item.path} className={isActive ? styles.active : ''}>
						<Link to={item.path}>{item.name}</Link>
					</li>
				);
			})}
		</ul>
	) : null;
};
