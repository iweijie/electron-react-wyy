/**
 *作者: weijie
 *功能描述: 页面
 *参数说明:
 *时间: 2018/4/16 10:47
 */
import React from 'react';
import './css.css';
import { Link } from 'react-router-dom';
// import { connect } from 'react-redux';
import history from '@utils/history';

class NotFound extends React.Component {
  // 返回按钮
  returnprev = () => {
    history.goBack();
  };

  render() {
    return (
      <div className="error">
        <h2>404</h2>
        <h3>
          咦？页面<span className="text-danger">出错了</span>？
        </h3>
        <p>
          您可以尝试
          <a onClick={this.returnprev}>返回上一页</a>,或者
          <Link to="/">跳转至首页</Link>。
        </p>
      </div>
    );
  }
}

export default NotFound;
