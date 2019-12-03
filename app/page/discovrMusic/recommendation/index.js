import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import styles from './index.less';
import { reducers } from 'store';
import Slideshow from '../../../components/Slideshow/index';

class Recommendation extends Component {
  componentDidMount() {
    const { getBanner } = this.props;
    getBanner();
  }
  render() {
    const { bannerList } = this.props;
    return (
      <div className={styles.container}>
        <Slideshow list={bannerList} />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    bannerList: state.recommendation.bannerList
  };
}

function mapDispatchToProps() {
  return {
    getBanner: reducers.recommendation.getBanner
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Recommendation);
