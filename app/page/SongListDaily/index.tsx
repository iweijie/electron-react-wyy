import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link, useHistory, useParams } from 'react-router-dom';
import { reducers } from 'store';
import { useSetState, useMount } from 'ahooks';
import { map, get } from 'lodash';
import Api from '../../request/index';
import Tabs, { TabPane } from '../../components/Tabs';
import Button from '../../components/Button';
import { formatDate, getFormatCount } from '../../utils/index';
import SongsList from '../../components/SongsList';
import styles from './index.less';
import json from './test.json';

interface IPlaylist {
  // 封面图片
  coverImgUrl: string;
  // 标题
  name: string;
  // 描述
  description: string;
  // 分享数量
  shareCount: number;
  // 播放数量
  playCount: number;
  // 评论数量
  commentCount: number;
  // 创建时间
  createTime: number;
  // 歌单歌曲数量
  trackCount: number;
  // 收藏
  subscribedCount: number;
  // tag
  tags: string[];
  creator: {
    avatarUrl: string;
    nickname: string;
    [x: string]: any;
  };
  subscribers: any[];
  [x: string]: any;
}

interface ISongListDailyState {
  loading: boolean;
  relatedVideos: null | string;
  playlist: IPlaylist;
}

interface ISongListDailyURLParams {
  id: string;
}

const SongListDaily = () => {
  const { id } = useParams<ISongListDailyURLParams>();
  console.log(id);
  const [state, setState] = useSetState<ISongListDailyState>({
    loading: false,
    ...json,
  });

  useMount(() => {
    if (!id) throw new Error('歌单详情错误');
    // Promise.resolve();
    // Api.requestSongListDetail({ id });
  });

  return (
    <div className={styles.wrap}>
      <div className={styles.header}>
        <div
          className={styles.via}
          style={{
            backgroundImage: `url(${get(state, 'playlist.coverImgUrl')})`,
          }}
        />
        <div className={styles['header-right']}>
          <div className={styles.title}>
            <div className={styles.type}>歌单</div>
            <h3>{state.playlist.name}</h3>
          </div>
          <div className={styles.creator}>
            <span
              className={styles['creator-via']}
              style={{
                backgroundImage: `url(${get(
                  state,
                  'playlist.creator.avatarUrl'
                )})`,
              }}
            />
            <span className={styles.nickname}>
              {get(state, 'playlist.creator.nickname')}
            </span>
            <span>
              {formatDate(state.playlist.createTime, 'yyyy-MM-dd')}创建
            </span>
          </div>
          <div className={styles.btns}>
            <Button
              text="播放全部"
              prefix="iconbofang1"
              suffix="iconjia"
              primary
            />
            <Button
              text={`收藏(${getFormatCount(
                get(state, 'playlist.subscribedCount', 0)
              )})`}
              prefix="iconCollection"
            />
            <Button
              text={`分享(${getFormatCount(
                get(state, 'playlist.shareCount', 0)
              )})`}
              prefix="iconshare"
            />
            <Button text="下载全部" prefix="iconxiazai" />
          </div>
          <div className={styles.description}>
            <p className={styles.tags}>
              标签：<span>{get(state, 'playlist.tags', []).join('，')}</span>
            </p>
            <p className={styles['play-count']}>
              <span>
                歌曲：{getFormatCount(get(state, 'playlist.trackCount', 0))}
              </span>
              <span>
                播放：{getFormatCount(get(state, 'playlist.playCount', 0))}
              </span>
            </p>
            <p className={styles['play-count']}>
              <span>简介：{get(state, 'playlist.description', '')}</span>
            </p>
          </div>
        </div>
      </div>
      <Tabs>
        <TabPane key="1" tab="歌曲列表">
          <span>1233</span>
        </TabPane>
        <TabPane key="2" tab="评论(2898394)">
          <span>1233</span>
        </TabPane>
        <TabPane key="3" tab="收藏者">
          <span>1233</span>
        </TabPane>
      </Tabs>

      <SongsList
        songsList={get(state, 'playlist.subscribers', [])}
        loading={state.loading}
      />
    </div>
  );
};

// class RecommendSongs extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       ...this.getTodayInfo(),
//     };
//   }

//   componentDidMount() {
//     const { getRecommendSongs } = this.props;
//     getRecommendSongs();
//   }
//   render() {
//     const { week, day } = this.state;
//     const { recommendSongsList } = this.props;
//     return (
//       <div className={styles.container}>
//         <div className={styles.head}>
//           <div className={styles['head-container']}>
//             <div className={styles['border-grey']}>
//               <p className={styles.week}>星期{week}</p>
//               <p className={styles.day}>{day}</p>
//             </div>
//             <div className={styles['cue-words-wrap']}>
//               <p className={styles.overday}>每日歌曲推荐</p>
//               <p className={styles['cue-words']}>
//                 根据你的音乐口味生成，每天6：00更新
//               </p>
//             </div>
//           </div>
//         </div>
//         <div className={styles['songs-list-wrap']}>
//           <div className={styles['songs-list']}>
//             <div className={styles.control}>
//               <div
//                 className={styles['play-all']}
//                 onClick={() => this.handlePlayAll('replace')}
//               >
//                 <div className={styles.repalace}>
//                   <i className="iconfont iconbofang2" /> <span>播放全部</span>
//                 </div>
//                 <div
//                   className={styles.push}
//                   onClick={() => this.handlePlayAll('push')}
//                 >
//                   <i className="iconfont iconincrease" />
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   getTodayInfo() {
//     const date = new Date();
//     return {
//       day: date.getDate(),
//       week: weekList[date.getDay()] || '日',
//     };
//   }
//   // replace : 替换正在播放歌单
//   // push :  播放列表追加
//   handlePlayAll = (mode) => {
//     const { recommendSongsList } = this.props;
//     console.log(JSON.stringify(this.formatPlayListData(recommendSongsList)));
//   };

//   formatPlayListData = (list) => {
//     return map(list, (item, index) => {
//       const { name, id, alias, duration, album, mvid = 0 } = item;
//       return { name, id, alias, duration, album, mvid };
//     });
//   };
// }

function mapStateToProps(state) {
  return {
    recommendSongsList: state.recommendation.recommendSongsList,
  };
}

function mapDispatchToProps() {
  return {
    getRecommendSongs: reducers.recommendation.getRecommendSongs,
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(SongListDaily);
