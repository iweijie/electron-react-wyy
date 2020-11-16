import React from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import styles from './index.less';
import classnames from 'classnames';
// afterChange	切换面板的回调	function(current)	无
// autoplay	是否自动切换	boolean	false
// beforeChange	切换面板的回调	function(from, to)	无
// dotPosition	面板指示点位置，可选 top bottom left right	string	bottom	3.17.0	3.17.0
// dots	是否显示面板指示点	boolean	true
// easing	动画效果	string	linear

const EMPTY = 0;
const MIDDLE = 1;
const STARE = 2;
const END = 3;

interface ISlideshowProps {
  list: any;
  autoplay?: boolean;
  delay?: number;
}
interface ISlideshowState {
  imgListState: any[];
  imgList: any;
  current: number;
}

class Slideshow extends React.Component<ISlideshowProps, ISlideshowState> {
  static propTypes = {
    // afterChange: PropTypes.func,
    // beforeChange: PropTypes.func,
    autoplay: PropTypes.bool,
    // dots: PropTypes.bool,
    delay: PropTypes.number,
    list: PropTypes.any,
  };

  static defaultProps = {
    list: [],
    autoplay: true,
    delay: 8,
  };

  timerId: any;

  constructor(props: ISlideshowProps) {
    super(props);
    const list = props.list || [];
    const { length } = list;
    this.timerId = 0;
    this.state = {
      // afterChange: props.afterChange || noop,
      // beforeChange: props.beforeChange || noop,
      // dots: props.dots === undefined ? true : !!props.dots,
      imgListState: length >= 3 ? this.setImgListState(list) : [],
      imgList: length >= 3 ? list : list[0] || '',
      current: 0,
    };
  }

  componentDidMount() {
    this.handleStartLoop();
  }

  componentDidUpdate(preProps: ISlideshowProps, state: ISlideshowState) {
    const { list } = this.props;
    if (preProps.list !== list) {
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState(
        {
          imgListState: this.setImgListState(list),
          imgList: list,
          current: 0,
        },
        this.handleStartLoop
      );
    }
  }

  componentWillUnmount() {
    this.handleClearLoop();
  }

  handleStartLoop = () => {
    const { autoplay } = this.props;
    const { imgList } = this.state;
    if (autoplay && imgList.length > 3) {
      this.handleAutoplay();
    }
  };

  handleClearLoop = () => {
    clearInterval(this.timerId);
  };

  handleAutoplay = () => {
    const { delay } = this.props;
    this.handleClearLoop();
    this.timerId = setInterval(() => {
      console.log('setInterval:');
      const { current, imgList } = this.state;
      const nextCUrrent = (current + 1) % imgList.length;
      this.handleClickPoint(nextCUrrent);
    }, (delay as number) * 1000);
  };

  setImgListState = (list: any[]) => [
    MIDDLE,
    STARE,
    ...list.slice(3).map(() => EMPTY),
    END,
  ];

  getClassName = (item: any) => {
    switch (item) {
      case EMPTY:
        return '';
      case MIDDLE:
        return styles.middle;
      case STARE:
        return styles.start;
      case END:
        return styles.end;
      default:
        return '';
    }
  };

  handleClickPoint(index: number) {
    const { current, imgListState } = this.state;
    console.log(index, current, imgListState);
    if (index < current) {
      for (let i = 0; i < current - index; i += 1) {
        const shift = imgListState.shift();
        imgListState.push(shift);
      }
    } else if (index > current) {
      for (let i = 0; i < index - current; i += 1) {
        const pop = imgListState.pop();
        imgListState.unshift(pop);
      }
    }
    this.setState({ imgListState, current: index });
  }

  handleClickSlide = (name: number) => {
    if (name === MIDDLE) return;
    const { imgListState } = this.state;
    // console.log(key, current, imgListState, name);
    if (name === STARE) {
      const shift = imgListState.shift();
      imgListState.push(shift);
    } else if (name === END) {
      const pop = imgListState.pop();
      imgListState.unshift(pop);
    }
    const current = imgListState.findIndex((item) => item === MIDDLE);
    this.setState({ imgListState, current });
  };

  handleNext = (type: number) => {
    this.handleClickSlide(type);
  };

  render() {
    const { imgListState, imgList } = this.state;
    return (
      <div
        className={styles['slide-wrap']}
        onMouseEnter={this.handleClearLoop}
        onMouseLeave={this.handleStartLoop}
      >
        <div className={styles.slideBox}>
          {imgListState.map((item, key) => (
            <div
              // eslint-disable-next-line react/no-array-index-key
              key={key}
              className={`${styles.slide} ${this.getClassName(item)}`}
            >
              <div className={styles['img-wrap']}>
                <img src={imgList[key].imageUrl} alt="图片" />
                <span
                  style={{
                    backgroundColor:
                      get(imgList[key], 'titleColor') === 'red'
                        ? '#cc4a4a'
                        : '#4a79cc',
                  }}
                >
                  {imgList[key].typeTitle}
                </span>
              </div>
              <div
                className={item === MIDDLE ? '' : styles.masking}
                onClick={() => this.handleClickSlide(item)}
              />
            </div>
          ))}

          <span
            onClick={() => this.handleNext(STARE)}
            className={classnames(styles.btn, styles['btn-left'])}
          >
            <i className="iconicon-test4 iconfont" />
          </span>
          <span
            onClick={() => this.handleNext(END)}
            className={classnames(styles.btn, styles['btn-right'])}
          >
            <i className="iconicon-test6 iconfont" />
          </span>
        </div>
        <div className={styles.point}>
          {imgListState.map((item, key) => (
            // 根据图片数量进行循环
            <div
              // eslint-disable-next-line react/no-array-index-key
              key={key}
              className={styles['point-item']}
              onMouseEnter={() => {
                this.handleClickPoint(key);
              }}
            >
              <span
                className={item === MIDDLE ? styles.active : ''} // 给予当前显示的按钮样式变化
              />
            </div>
          ))}
        </div>
      </div>
    );
  }
}

export default Slideshow;
