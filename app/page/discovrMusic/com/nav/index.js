import React from 'react';
import { Link } from 'react-router-dom';
import { navList } from '../../contain/link';
import styles from './index.less';

export default (props) => {
	const { match } = props;
	console.log("match",match)
	return (
		<ul className={styles['ul']}>
			{navList.map((item) => {
				const isActive = match.url === item.path;
				console.log(match.url , item.path)
				return (
					<li key={item.path} className={isActive ? styles.active : ''}>
						<Link to={item.path}>{item.name}</Link>
					</li>
				);
			})}
		</ul>
	);
};
