import React, { Component } from 'react';
import { connect } from 'react-redux';
import styles from './index.less';
import observer from '../../utils/observer';
import { getFormatTime } from '../../utils';
import { reducers } from '../../store';
import { isEmpty, map, join, get } from 'lodash';

interface ISongListProps {
  songslist: any[];
  currentPlaySongId: number;
  changePlayMore: (params: any) => any;
}

class SongList extends Component<ISongListProps> {
  state = {
    activeItemIndex: -1,
  };

  render() {
    const { activeItemIndex } = this.state;
    const { songslist = [], currentPlaySongId } = this.props;
    const len = songslist.length;
    return (
      <div className={styles['songs-list']}>
        <ul>
          <li className={styles['ul-title']}>
            <div className={styles.oreder}> </div>
            <div className={styles.name}>音乐标题</div>
            <div className={styles.artists}>歌手</div>
            <div className={styles.album}>专辑</div>
            <div className={styles.duration}>时长</div>
          </li>
          {map(songslist, (item, index) => {
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
                className={activeItemIndex === index ? styles.active : ''}
                key={id}
                onClick={() => this.handleClick(item, index)}
                onDoubleClick={() => this.handleDoubleClick(item)}
              >
                <div className={styles.oreder}>
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
                      map(artists, (item) => item.name),
                      '/'
                    )}
                </div>
                <div className={styles.album}>
                  {get(album, 'name')}{' '}
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

  handleClick = (item: any, index: any) => {
    this.setState({
      activeItemIndex: index,
    });
  };

  handleDoubleClick = (item: any) => {
    const { changePlayMore, songslist } = this.props;
    changePlayMore({
      playerList: [...songslist],
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
