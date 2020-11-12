import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { getFormatTime } from '../../utils';
import { isEmpty, map, join, get, noop } from 'lodash';
import styles from './index.less';

interface IPlayerListProps {
  handleClose: (show: boolean) => void;
  playerList: any[];
  handleDoubleClick: (item: any) => void;
  handleClearPlayList: () => void;
  currentPlaySongId: string;
}
interface IPlayerListState {
  tabIndex: number;
}

interface IArtists {
  name: string;
}

class PlayerList extends Component<IPlayerListProps, IPlayerListState> {
  static propTypes = {
    handleClose: PropTypes.func,
    playerList: PropTypes.array,
    handleDoubleClick: PropTypes.func,
    handleClearPlayList: PropTypes.func,
    currentPlaySongId: PropTypes.string,
  };
  static defaultProps = {
    handleClose: noop,
    handleClearPlayList: noop,
    handleDoubleClick: noop,
    playerList: [],
    currentPlaySongId: undefined,
  };

  state: IPlayerListState = {
    // 1:播放列表；2：历史记录
    tabIndex: 1,
  };

  handleClosePlayList = () => {
    const { handleClose } = this.props;
    handleClose(false);
  };

  render() {
    const { tabIndex } = this.state;
    const {
      playerList,
      currentPlaySongId,
      handleDoubleClick = noop,
      handleClearPlayList,
    } = this.props;
    return (
      <div className={`${styles['player-list-wrap']} _player-list-wrap`}>
        <div className={styles['player-list-head']}>
          <div className={styles.tabs}>
            <button
              type="button"
              className={tabIndex === 1 ? styles.active : ''}
            >
              播放列表
            </button>
            <button
              type="button"
              className={tabIndex === 2 ? styles.active : ''}
            >
              历史记录
            </button>
          </div>
          <div
            className={styles['play-list-close-btn']}
            onClick={this.handleClosePlayList}
          >
            <i className="iconfont iconclose" />
          </div>
        </div>
        <div className={styles['player-list-control']}>
          <div>总{playerList.length}首</div>
          <div onClick={handleClearPlayList} className={styles.icon}>
            <i className="iconfont iconqingkong" /> 清空
          </div>
        </div>
        <ul className={styles['player-list']}>
          {map(playerList, (item) => {
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
              <li
                className={currentPlaySongId === id ? styles.active : ''}
                key={id}
                onDoubleClick={() => handleDoubleClick(item)}
              >
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
                      map(artists, (artist: IArtists) => artist.name),
                      '/'
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
}

export default PlayerList;
