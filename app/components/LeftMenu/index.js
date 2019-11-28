import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { get } from 'lodash';
import Icon from '../Icon/index';
import styles from './index.less';

const getMenuList = (menuList) => {
	return menuList.map((item) => {
		const { chalidren = [] } = item;
		return (
			<div className={styles['sub-nav']} key={item.title}>
				<div className={styles['sub-nav-title']}>{item.title}</div>
				<ul>
					{chalidren.map((child) => {
						return (
							<li key={child.link} className={styles['sub-nav-item']}>
								<Link to={child.link}>
									<Icon
										type={child.iconType}
										style={child.iconStyle}
										className={styles['sub-nav-item-icon']}
									/>
									{child.title}
								</Link>
							</li>
						);
					})}
				</ul>
			</div>
		);
	});
};
export default (props) => {
	const { menu = [] } = props;
	return <div className={styles['left-nav']}>{getMenuList(menu)}</div>;
};
