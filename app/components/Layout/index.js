import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import TopNav from '../TopNav/index';
import LeftMenu from '../LeftMenu/index';
import Routes from '../../Routes';
import './index.less';

export default class Home extends Component {
  render() {
    console.log("layout",this.props)
    return (
      <div className='global-layout'>
        <TopNav />
        <div className="global-container">
          <LeftMenu />
          <Routes />
        </div>
      </div>
    );
  }
}
