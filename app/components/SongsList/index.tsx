import React, { Component } from 'react';
import { connect } from 'react-redux';
import styles from './index.less';
import classnames from 'classnames';
import observer from '../../utils/observer';
import { getFormatTime } from '../../utils';
import { reducers } from '../../store';
import { isEmpty, map, join, get } from 'lodash';

interface ISong {
  name: string;
  id: number;
  artists: any[];
  alias: any[];
  duration: number;
  album: string;
  mvid?: number;
}

interface ISongListProps {
  songsList: ISong[];
  loading?: boolean;
  currentPlaySongId: number;
  changePlayMore: (params: any) => any;
}

class SongList extends Component<ISongListProps> {
  state = {
    activeItemIndex: -1,
  };

  render() {
    const { activeItemIndex } = this.state;
    const { songsList = [], loading = false, currentPlaySongId } = this.props;
    const len = songsList.length;
    return (
      <div className={styles['songs-list']}>
        {loading ? (
          <div className={styles.loading}>
            <i className="iconfont iconxingzhuang" />
          </div>
        ) : null}
        <ul>
          <li className={styles['ul-title']}>
            <div className={styles.order}> </div>
            <div className={styles.name}>音乐标题</div>
            <div className={styles.artists}>歌手</div>
            <div className={styles.album}>专辑</div>
            <div className={styles.duration}>时长</div>
          </li>
          {map(songsList, (item, index) => {
            const {
              name,
              artists,
              alias,
              album = {},
              id,
              mvid,
              duration,
            } = item;
            return (
              // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
              <li
                className={classnames({
                  [styles.active]: currentPlaySongId === id,
                })}
                key={id}
                onDoubleClick={() => this.handleDoubleClick(item)}
              >
                <div className={styles.order}>
                  {currentPlaySongId === id ? (
                    <i className="iconfont iconyinlianglabashengyin" />
                  ) : (
                    this.getOrder(index + 1, len)
                  )}
                </div>
                <div className={styles.name}>
                  <div className={styles.title}>
                    <span>{name}</span>
                    {!isEmpty(alias) && (
                      <span className={styles.alias}>
                        （{join(alias, '，')}）
                      </span>
                    )}
                  </div>
                  <div className={styles['name-icon']}>
                    {!!mvid && <i className="iconfont iconmv" />}
                  </div>
                </div>
                <div className={styles.artists}>
                  {!isEmpty(artists) &&
                    join(
                      // eslint-disable-next-line no-shadow
                      map(artists, (item) => item.name),
                      '/'
                    )}
                </div>
                <div className={styles.album}>
                  {get(album, 'name')}
                  {!isEmpty(album.alias) && (
                    <span className={styles.alias}>
                      （{join(album.alias, '，')}）
                    </span>
                  )}
                </div>
                <div className={styles.duration}>
                  {getFormatTime(duration / 1000)}
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    );
  }

  getOrder = (num: any, length: any) => {
    num = String(num);
    const len = String(length).length;
    while (num.length < len) {
      num = `0${num}`;
    }
    return num;
  };

  handleDoubleClick = (item: any) => {
    const { changePlayMore, songsList } = this.props;
    changePlayMore({
      playerList: [...songsList],
      tabIndex: 1,
    });
    observer.emit('play-song', item);
  };
}

function mapStateToProps(
  state: { player: { currentPlaySongId: any } },
  own = {}
) {
  return {
    ...own,
    // currentIndex: state.player.currentIndex,
    currentPlaySongId: state.player.currentPlaySongId,
  };
}

function mapDispatchToProps() {
  return {
    changePlayMore: reducers.player.changePlayMore,
  };
}
export default connect(mapStateToProps, mapDispatchToProps)(SongList);
