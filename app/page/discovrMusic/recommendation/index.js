import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import styles from './index.less';
import { reducers } from 'store';
import { weekList } from '../contain';
import Slideshow from '../../../components/Slideshow/index';
import PlaylistTitle from 'components/PlaylistTitle/index';
import { request } from '../../../request/index';
import { from } from 'rxjs';


class Recommendation extends Component {
	constructor(props) {
		super(props);
		this.state = {
			...this.getTodayInfo()
		};
	}

	componentDidMount() {
		const { getBanner, getPersonalized } = this.props;
		getBanner();
		getPersonalized();
	}
	render() {
		const { week, day } = this.state;
		const { bannerList, personalizedList } = this.props;
		return (
			<div className={styles.container}>
				<div className={styles.pb30}>
					<Slideshow list={bannerList} />
				</div>
				<PlaylistTitle title="推荐歌单" link="/test">
					<ul className={styles.personalized}>
						<li className={styles['recommend-songs']}>
							<div
								className={styles['border-grey']}
								onClick={() => this.goRoute('/discovrMusic/recommendSongs')}
							>
								<div className={styles.tip}>根据您的音乐口味生成，每日推荐</div>
								<p className={styles.week}>星期{week}</p>
								<p className={styles.day}>{day}</p>
							</div>
							<p className={styles.name}>每日歌曲推荐</p>
						</li>
						{personalizedList.map((item) => {
							return (
								<li key={item.id} className={styles['personalized-item']}>
									<div
										className={styles['border-grey']}
										style={{ backgroundImage: `url(${item.picUrl}?param=140y140)` }}
									>
										<div className={styles.tip}>{item.copywriter}</div>
										<p className={styles.playCount}>
											<i className="iconfont iconerji" />
											&nbsp;&nbsp;
											{this.getFormatPlayCount(item.playCount)}
										</p>
										<p />
									</div>
									<p className={styles.name}>{item.name}</p>
								</li>
							);
						})}
					</ul>
				</PlaylistTitle>
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

	getFormatPlayCount(num) {
		if (num > 10 * 10000) {
			return Math.floor(num / 10000) + '万';
		}
		return num;
	}

	goRoute = (path) => {
		const { history } = this.props;
		history.push(path);
	};
}

function mapStateToProps(state) {
	return {
		bannerList: state.recommendation.bannerList,
		personalizedList: state.recommendation.personalizedList
	};
}

function mapDispatchToProps() {
	return {
		getBanner: reducers.recommendation.getBanner,
		getPersonalized: reducers.recommendation.getPersonalized
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(Recommendation);
