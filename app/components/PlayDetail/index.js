import React, { Component } from 'react';
import { CSSTransition } from 'react-transition-group';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Toast from 'components/Toast';
import { get, isNaN, isEmpty, join, map, first } from 'lodash';
import './animation.global.less';
import styles from './index.less';
import { reducers } from '../../store';

class Player extends Component {
	constructor(props) {
		super(props);
		this.state = {};
	}

	static propTypes = {
		// title: PropTypes.string.isRequired,
		// link: PropTypes.string,
		// child: PropTypes.element
	};

	componentDidMount() {
		this.props.getSongDetail('210837');
		this.props.getLyric('210837');
		// https://blog.csdn.net/yzy_csdn/article/details/84536646
		// ontimeupdate  onseeked
	}

	componentDidUpdate(preProps) {}

	render() {
		const { currentPlaySongId, isShowPlayDetailPage, info, lyric } = this.props;
		console.log('info:', info);
		const isShowDetail = !!isShowPlayDetailPage && !!currentPlaySongId;
		return (
			<CSSTransition in={isShowDetail} timeout={300} classNames="detail" unmountOnExit>
				<div className={styles['global-container-play-detail-wrap']}>
					<div className={styles['play-detail-lyric-wrap']}>
						{/* <img className={styles.blur} src={get(info, 'al.picUrl', '')} alt="" /> */}
						<div className={styles['play-detail-cd-wrap']}>
							<div className={styles['play-detail-cd']}>
								<img src={get(info, 'al.picUrl', '')} alt="" />
							</div>
							<div className={styles['play-detail-icon']}>
								<div>喜欢</div>
								<div>收藏</div>
								<div>VIP下载</div>
								<div>分享</div>
							</div>
						</div>
						<div className={styles['play-detail-info-wrap']}>
							<h3>{get(info, 'name', '')}</h3>
							<div className={styles['play-detail-info']}>
								<div>专辑：{get(info, 'al.name', '')}</div>
								<div>歌手：{join(map(get(info, 'ar', []), (item) => item.name), '/')}</div>
								<div>来源：搜网页</div>
							</div>
							<ul className={styles['play-detail-lyric']}>
								{map(lyric, (item) => {
									return <li>{get(item, 1, '')}</li>;
								})}
							</ul>
						</div>
					</div>
					<div className="" onClick={this.handleCancle}>
						handleCancle
					</div>
				</div>
			</CSSTransition>
		);
	}

	handleCancle = () => {
		const { isShowPlayDetailPage, changePlayMore } = this.props;
		changePlayMore({
			isShowPlayDetailPage: false
		});
	};
}

function mapStateToProps(state) {
	return {
		lyric: state.playSongDetail.lyric,
		info: state.playSongDetail.info,
		isShowPlayDetailPage: state.player.isShowPlayDetailPage,
		currentPlaySongId: state.player.currentPlaySongId
	};
}

function mapDispatchToProps() {
	return {
		changePlayMore: reducers.player.changePlayMore,
		getSongDetail: reducers.playSongDetail.getSongDetail,
		getLyric: reducers.playSongDetail.getLyric
	};
}
export default connect(mapStateToProps, mapDispatchToProps)(Player);
