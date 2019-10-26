import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import styles from './index.less';

export default class TopNav extends Component {
  render() {
    return (
      <div className='top-nav'>
        <div className='top-nav-left top-nav-icon'>
          网易云音乐
        </div>
        <div className='top-nav-rigth'>
          1223
        </div>
      </div>
    );
  }
}
