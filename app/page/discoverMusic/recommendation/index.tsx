import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import classnames from 'classnames';
import { History } from 'history';
import styles from './index.less';
import { getFormatCount } from '../../../utils/index';
import { reducers } from '../../../store/index';
import { weekList } from '../contain';
import Slideshow from '../../../components/Slideshow/index';
import ListTitle from '../../../components/ListTitle/index';

const getTodayInfo = () => {
  const date = new Date();
  return {
    day: date.getDate(),
    week: weekList[date.getDay()] || '日',
  };
};

interface IRecommendationProps {
  getBanner: () => void;
  getPersonalized: () => void;
  bannerList: any[];
  personalizedList: any[];
  history: History;
}

interface IRecommendationState {
  day: number;
  week: string;
}

class Recommendation extends Component<
  IRecommendationProps,
  IRecommendationState
> {
  constructor(props: IRecommendationProps) {
    super(props);
    this.state = {
      ...getTodayInfo(),
    };
  }

  componentDidMount() {
    const { getBanner, getPersonalized } = this.props;
    getBanner();
    getPersonalized();
  }

  render() {
    const { day } = this.state;
    const { bannerList, personalizedList, history } = this.props;
    return (
      <div className={styles.container}>
        <div className={styles.pb30}>
          <Slideshow list={bannerList} />
        </div>
        <ListTitle title="推荐歌单" link="/test">
          <ul className={styles.personalized}>
            <li className={styles['recommend-songs']}>
              <div
                className={styles['border-grey']}
                onClick={() => history.push('/recommendedDaily')}
              >
                <div className={styles.tip}>根据您的音乐口味生成，每日推荐</div>
                {/* <p className={styles.week}>星期{week}</p> */}
                <div className={styles.bg} />
                <div className={styles.day}>
                  <i className="iconfont iconcalendar-" />
                  {day}
                </div>
                <div className={styles['play-icon']}>
                  <i className="iconfont iconbofang1" />
                </div>
              </div>
              <p className={styles.name}>每日歌曲推荐</p>
            </li>
            {personalizedList.map((item) => {
              return (
                <li
                  key={item.id}
                  className={styles['personalized-item']}
                  onClick={() => this.handleGoDetail(item.id)}
                >
                  <div
                    className={styles['border-grey']}
                    style={{
                      backgroundImage: `url(${item.picUrl}?param=140y140)`,
                    }}
                  >
                    <div className={styles.tip}>{item.copywriter}</div>
                    <p className={styles.playCount}>
                      <i className="iconfont iconbofangsanjiaoxing" />
                      &nbsp;&nbsp;
                      {getFormatCount(item.playCount)}
                    </p>
                    <div className={classnames(styles['play-icon'])}>
                      <i className="iconfont iconbofang1" />
                    </div>
                  </div>
                  <p className={styles.name}>{item.name}</p>
                </li>
              );
            })}
          </ul>
        </ListTitle>
      </div>
    );
  }

  handleGoDetail = (id: number) => {
    const { history } = this.props;
    history.push(`/songListDaily/${id}`);
  };
}

function mapStateToProps(state: any) {
  return {
    bannerList: state.recommendation.bannerList,
    personalizedList: state.recommendation.personalizedList,
  };
}

function mapDispatchToProps() {
  return {
    getBanner: reducers.recommendation.getBanner,
    getPersonalized: reducers.recommendation.getPersonalized,
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Recommendation);
