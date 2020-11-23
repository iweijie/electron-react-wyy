import React, { Component } from 'react';
import { connect } from 'react-redux';
import { reducers } from 'store';
import classNames from 'classnames';
import Select from 'components/Select';
import Icon from '../../../components/Icon';

import styles from './index.less';

class Playlist extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectValue: '全部歌单',
      menulistShow: false,
    };
  }

  componentDidMount() {
    this.props.getTaglist();
    this.props.getPlaylist();
  }

  handleSelect = (selectValue) => {
    this.setState({
      selectValue,
      menulistShow: false,
    });
  };

  handleClose = () => {
    this.setState({ menulistShow: false });
  };

  handleHotTagClick = (tagValue) => {
    this.setState({ selectValue: tagValue });
  };

  handleSelectorClick = () => {
    this.setState({ menulistShow: true });
  };

  render() {
    // console.log(this.props, 'props')
    const { selectValue, menulistShow } = this.state;
    const { taglist } = this.props;
    const { allCategories } = this.props.playlist;
    return (
      <div className={styles.songSheets}>
        <div className={styles.songSortsSelect}>
          <Select
            value={selectValue}
            visible={menulistShow}
            handleSelectorClick={this.handleSelectorClick}
            handleClose={this.handleClose}
          >
            <div
              className={classNames(styles.allMenu, {
                [styles.active]: selectValue === '全部歌单',
              })}
              onClick={() => this.handleSelect('全部歌单')}
            >
              全部歌单
              {selectValue === '全部歌单' ? (
                <Icon
                  type="playlistChecked"
                  className={styles.playlistChecked}
                />
              ) : null}
            </div>
            <div className={styles.otherMenu}>
              {allCategories.map((item) => (
                <div className={styles.largeCategory} key={item.name}>
                  <div className={styles.largeCategoryName}>{item.name}</div>
                  <ul className={styles.smallTagsCategory}>
                    {item.sub.map((ele, index) => (
                      <li
                        key={ele.name}
                        className={classNames(styles.categoryItem, {
                          [styles.active]: selectValue === ele.name,
                          [styles.noBorderTop]: index > 4,
                          [styles.addBorderLeft]: index % 5 === 0,
                        })}
                        onClick={() => this.handleSelect(ele.name)}
                      >
                        <div>{ele.name}</div>
                        {selectValue === ele.name ? (
                          <Icon
                            type="playlistChecked"
                            className={styles.playlistChecked}
                          />
                        ) : null}
                        {/* {ele.hot ? <div>hot</div> : null} */}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </Select>
          <div className={styles.hotTags}>
            <div>热门标签：</div>
            <ul>
              {taglist.map((item) => (
                <li
                  key={item.name}
                  onClick={() => this.handleHotTagClick(item.name)}
                >
                  {item.name}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    taglist: state.playlist.taglist,
    playlist: state.playlist.playlist,
  };
}

function mapDispatchToProps() {
  return {
    getTaglist: reducers.playlist.getTaglist,
    getPlaylist: reducers.playlist.getPlaylist,
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Playlist);
