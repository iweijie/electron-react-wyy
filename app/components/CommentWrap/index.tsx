import React, { Component, useCallback, useEffect } from 'react';
import { useSetState, useMount, useUpdateEffect } from 'ahooks';
import { map, get, join, trim, isEmpty, split } from 'lodash';
import classnames from 'classnames';
import Comment from '../Comment';
import Pagination from '../Pagination';
import { formatDate, getFormatCount } from '../../utils/index';
import Api from '../../request/index';
import styles from './index.less';
interface ICommentWrapProps {
  id: number | string;
  title?: string;
  hasTotal?: boolean;
}

// hotComments: (3) [{…}, {…}, {…}]
// commentBanner: null
// code: 200
// comments: (20) [{…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}]
// total: 47

const CommentWrap = (props: ICommentWrapProps) => {
  const { id } = props;
  // 普通评论
  // const [state, setState] = useSetState({
  //   list: [],
  //   limit: 20,
  //   page: 1,
  //   total: 0,
  // });
  // // 热门评论
  // const [hotState, setHotState] = useSetState({
  //   list: [],
  //   limit: 20,
  //   page: 1,
  //   more: false,
  // });

  // const { list, limit, page, total } = state;

  // const handleGetPlaylistComments = useCallback(
  //   (page, limit) => {
  //     if (total < limit * page) return;
  //     Api.requestPlaylistComments({
  //       id,
  //       limit: limit,
  //       offset: (page - 1) * limit,
  //     }).then((data) => {
  //       if (data.code !== 200) throw data;
  //       setState({
  //         list: data.comments || [],
  //         page: page + 1,
  //         total: data.total,
  //       });
  //     });
  //   },
  //   [total]
  // );

  // const handleGetHotComments = useCallback(
  //   (page, limit) => {
  //     if (!hotState.more) return;
  //     Api.requestGetHotComment({
  //       id,
  //       type: 2,
  //       limit: limit,
  //       offset: (page - 1) * limit,
  //     }).then((data) => {
  //       if (data.code !== 200) throw data;
  //       setHotState({
  //         list: data.comments || [],
  //         page: page + 1,
  //         more: data.more,
  //       });
  //     });
  //   },
  //   [hotState.more]
  // );

  // useMount(() => {
  //   Api.requestPlaylistComments({ id }).then((data) => {
  //     if (data.code !== 200) throw data;
  //     setState({
  //       list: data.comments || [],
  //       total: data.total || 0,
  //     });

  //     setHotState({
  //       more: data.moreHot,
  //       list: data.hotComments || [],
  //     });
  //   });
  // });
  // console.log('state', state);
  return (
    <div>
      {/* {hotState.list.length ? (
        <div>
          <div className={styles.title}>精彩评论</div>
          <Comment list={hotState.list} />
        </div>
      ) : null} */}
      <div>
        {/* <div className={styles.title}>最新评论({total})</div> */}
        {/* <Comment list={list} /> */}
        <Pagination
          // pageSize={limit}
          // page={page}
          // total={total}
          // onChange={handleGetPlaylistComments}
          pageSize={10}
          page={1}
          total={70}
        />
      </div>
    </div>
  );
};

export default CommentWrap;
