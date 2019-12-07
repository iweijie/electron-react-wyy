import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import styles from './index.less';

const Player = (props) => {
	const { title, link, children } = props;
	return (
		<div className={styles.player}>
			<div className={styles.song} />
			<div className={styles.control}>
				<div className={styles.btns}>
					<button>
						<i className="iconfont iconshangyishou" />
					</button>
					<button>
						<i className="iconfont iconbofang" />
					</button>
					<button>
						<i className="iconfont iconxiayishou" />
					</button>
				</div>
				<div className={styles['time-progress']}>
					<div className={styles['time-running']}>00:55</div>
					<div className={styles.progress}>
						<span className={styles['progress-mask']}>
              <i className={styles.drag}></i>
            </span>
					</div>
					<div className={styles['time-end']}>00:55</div>
				</div>
				<div className={styles['sound-progress']}>
					<div className={styles['sound-control']}>
						<i className="iconfont iconshengyin" />
					</div>
					<div className={styles.progress}>
						<span className={styles['progress-mask']} />
					</div>
				</div>
				<div className={styles['play-mode']} title="模式">
					<i className="iconfont iconxunhuan1" />
				</div>
				<div className={styles['songs-list-btn']} title="歌单">
					<i className="iconfont iconcategory" />
				</div>
			</div>
		</div>
	);
};

Player.PropTypes = {
	title: PropTypes.string.isRequired,
	link: PropTypes.string,
	child: PropTypes.element
};

export default Player;
