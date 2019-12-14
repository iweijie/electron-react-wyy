import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { reducers } from 'store';
import { map } from 'lodash';
import SongsList from '../../../components/SongsList';
import { weekList } from '../contain';
import styles from './index.less';

class RecommendSongs extends Component {
	constructor(props) {
		super(props);
		this.state = {
			...this.getTodayInfo()
		};
	}

	componentDidMount() {
		const { getRecommendSongs } = this.props;
		getRecommendSongs();
	}
	render() {
		const { week, day } = this.state;
		const { recommendSongsList } = this.props;
		return (
			<div className={styles.container}>
				<div className={styles.head}>
					<div className={styles['head-container']}>
						<div className={styles['border-grey']}>
							<p className={styles.week}>星期{week}</p>
							<p className={styles.day}>{day}</p>
						</div>
						<div className={styles['cue-words-wrap']}>
							<p className={styles.overday}>每日歌曲推荐</p>
							<p className={styles['cue-words']}>根据你的音乐口味生成，每天6：00更新</p>
						</div>
					</div>
				</div>
				<div className={styles['songs-list-wrap']}>
					<div className={styles['songs-list']}>
						<div className={styles.control}>
							<div className={styles['play-all']} onClick={() => this.handlePlayAll('replace')}>
								<div className={styles.repalace}>
									<i className="iconfont iconbofang2" /> <span>播放全部</span>
								</div>
								<div className={styles.push} onClick={() => this.handlePlayAll('push')}>
									<i className="iconfont iconincrease" />
								</div>
							</div>
						</div>
						<SongsList songslist={recommendSongsList} />
					</div>
				</div>
			</div>
		);
	}

	getTodayInfo() {
		const date = new Date();
		return {
			day: date.getDate(),
			week: weekList[date.getDay()] || '日'
		};
	}
	// replace : 替换正在播放歌单
	// push :  播放列表追加
	handlePlayAll = (mode) => {
		const { recommendSongsList } = this.props;
		console.log(JSON.stringify(this.formatPlayListData(recommendSongsList)))
	};

	formatPlayListData = (list) => {
		return map(list, (item, index) => {
			const { name, id, alias, duration, album, mvid = 0 } = item;
			return { name, id, alias, duration, album, mvid };
		});
	};
}

function mapStateToProps(state) {
	return {
		recommendSongsList: state.recommendation.recommendSongsList
	};
}

function mapDispatchToProps() {
	return {
		getRecommendSongs: reducers.recommendation.getRecommendSongs
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(RecommendSongs);
