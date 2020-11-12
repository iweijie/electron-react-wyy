import React, { Component } from 'react';
import { get, map, noop } from 'lodash';
import { reducers } from '../../store/index';
import styles from './index.less';

const getCommentItem = (item, index) => {
	const avatarUrl = get(item, 'user.avatarUrl');
	const nickname = get(item, 'user.nickname');
	const content = get(item, 'content');
	const likedCount = get(item, 'likedCount');
	const time = get(item, 'time');

	return (
		<li>
			<div />
			<div>
				<p>
					<span>{nickname}:</span>
					{content}
				</p>
				<div>
					<span>{time}</span>
					<span>{likedCount}</span>
				</div>
			</div>
		</li>
	);
};

export default (props = {}) => {
	const { list, pageSize, pageData, totle, handleCallback = noop } = props;
	// const list = get(props, 'list', []);
	return <ul className={styles['commet-wrap']}>{map(list, getCommentItem)}</ul>;
};
