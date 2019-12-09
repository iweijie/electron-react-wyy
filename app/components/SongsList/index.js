import React, { Component } from 'react';
import styles from './index.less';
import { getFormatTime } from '../../utils';
import { isEmpty, map, join, get } from 'lodash';

export default class Songslist extends Component {
	state = {
		activeItemIdex: -1
	};

	render() {
		const { activeItemIdex } = this.state;
		const { songslist = [] } = this.props;
		const len = songslist.length;
		return (
			<div className={styles['songs-list']}>
				<ul>
					{map(songslist, (item, index) => {
						const { name, artists, alias, album = {}, id, mvid, duration } = item;
						return (
							<li
								className={activeItemIdex === index ? styles['active'] : ''}
								key={id}
								onClick={() => this.handleClick(item, index)}
							>
								<div className={styles.oreder}>{this.getOreder(index + 1, len)}</div>
								<div className={styles.name}>
									<div className={styles.title}>
										<span>{name}</span>
										{!isEmpty(alias) && <span className={styles.alias}>（{join(alias, '，')}）</span>}
									</div>
									<div className={styles['name-icon']}>
										{!!mvid && <i className="iconfont iconmv" />}
									</div>
								</div>
								<div className={styles.artists}>
									{!isEmpty(artists) && join(map(artists, (item) => item.name), '/')}
								</div>
								<div className={styles.album}>
									{get(album, 'name')}{' '}
									{!isEmpty(album.alias) && (
										<span className={styles.alias}>（{join(album.alias, '，')}）</span>
									)}
								</div>
								<div className={styles.duration}>{getFormatTime(duration / 1000)}</div>
							</li>
						);
					})}
				</ul>
			</div>
		);
	}

	getOreder = (num, length) => {
		num = String(num);
		const len = String(length).length;
		while (num.length < len) {
			num = '0' + num;
		}
		return num;
	};

	handleClick = (item, index) => {
		this.setState({
			activeItemIdex: index
		});
	};
}
