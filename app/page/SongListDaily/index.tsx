import React, { Component, useCallback } from 'react';
import { connect } from 'react-redux';
import { Link, useHistory, useParams } from 'react-router-dom';
import { reducers } from '@store';
import { useSetState, useMount } from 'ahooks';
import { map, get, join, trim, isEmpty, split } from 'lodash';
import classnames from 'classnames';
import Api from '../../request/index';
import Tabs, { TabPane } from '../../components/Tabs';
import Comment from '../../components/CommentWrap';
import Button from '../../components/Button';
import { formatDate, getFormatCount } from '../../utils/index';
import SongsList from '../../components/SongsList';
import styles from './index.less';

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
  tracks: any[];
  trackIds: any[];
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
  playlist: null | IPlaylist;
  songList: any[];
}

interface ISongListDailyURLParams {
  id: string;
}

interface IResponseData {
  code: number;
  playlist: IPlaylist;
  [x: string]: any;
}

const SongListDaily = () => {
  const { id } = useParams<ISongListDailyURLParams>();
  const [otherState, setOtherState] = useSetState({
    showMoreSynopsis: false,
  });
  const { showMoreSynopsis } = otherState;
  const [state, setState] = useSetState<ISongListDailyState>({
    loading: false,
    songList: [],
    relatedVideos: null,
    playlist: null,
  });

  const handleToggleMoreSynopsis = useCallback(() => {
    setOtherState((data) => {
      return {
        ...data,
        showMoreSynopsis: !data.showMoreSynopsis,
      };
    });
  }, [showMoreSynopsis, setOtherState]);

  useMount(() => {
    if (!id) throw new Error('歌单详情错误');
    // Promise.resolve();
    Api.requestSongListDetail({ id }).then((data: IResponseData) => {
      if (data.code !== 200) throw data;
      setState({
        playlist: data.playlist,
      });
      const ids = trim(
        join(
          map(get(data, 'playlist.trackIds', []), (item) => item.id),
          ','
        )
      );
      if (ids) {
        Api.requestSongDetail({ ids }).then((data) => {
          if (isEmpty(data)) return;
          const songList = map(data, (item) => {
            return {
              name: item.name,
              id: item.id,
              artists: item.ar,
              album: item.al,
              alias: item.alia,
            };
          });
          setState({
            songList,
          });
        });
      }
    });
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
            <h3>{get(state, 'playlist.name', '')}</h3>
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
              {get(state, 'playlist.createTime') &&
                formatDate(get(state, 'playlist.createTime'), 'yyyy-MM-dd')}
              创建
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
            <p
              className={classnames(styles['synopsis'], {
                [styles.show]: showMoreSynopsis,
              })}
            >
              <span>
                简介：
                {split(get(state, 'playlist.description', ''), '\n').map(
                  (text) => {
                    return (
                      <>
                        <span>{text}</span>
                        <br />
                      </>
                    );
                  }
                )}
              </span>

              <span
                className={styles['border-down-empty']}
                onClick={handleToggleMoreSynopsis}
              >
                <i />
              </span>
            </p>
          </div>
        </div>
      </div>
      <Tabs className={styles.tab} activeKey="comment">
        <TabPane tabKey="playlist" tabName="歌曲列表">
          <SongsList songsList={state.songList} loading={state.loading} />
        </TabPane>
        <TabPane
          tabKey="comment"
          tabName={`评论(${get(state, 'playlist.commentCount', 0)})`}
        >
          <div className={styles['comment-wrap']}>
            <Comment id={id} />
          </div>
        </TabPane>
        <TabPane tabKey="likes" tabName="收藏者">
          <span>3333</span>
        </TabPane>
      </Tabs>
    </div>
  );
};

function mapStateToProps(state: any) {
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
