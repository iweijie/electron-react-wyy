import React, { useEffect, useState } from 'react';
import { useSetState, useMount, usePersistFn } from 'ahooks';
import classnames from 'classnames';
import { times, map, noop } from 'lodash';
import styles from './index.less';

interface IPaginationProps {
  pageSize: number;
  page: number;
  total: number;
  align: 'center' | 'left' | 'right';
  // 只有一页是，是否隐藏分页
  hideOnSinglePage?: boolean;
  onChange?: (page: number, pageSize: number) => any;
}

interface IListItem {
  name: string;
  index: number;
  disabled?: boolean;
  isActived?: boolean;
}

interface IPaginationState {
  page: number;
  list: IListItem[];
  hide: boolean;
}

const limitPage = 5;

const Pagination = (props: IPaginationProps) => {
  const {
    pageSize,
    total,
    onChange,
    align = 'center',
    hideOnSinglePage = false,
  } = props;

  const [state, setState] = useSetState<IPaginationState>({
    page: props.page || 1,
    list: [],
    hide: false,
  });

  const page = props.page || state.page;

  const handleChange = usePersistFn((page, pageSize) => {
    setState(page);
    if (typeof onChange === 'function') {
      onChange(page, pageSize);
    }
  });

  useEffect(() => {
    // 一共多少页
    const pages = Math.ceil(total / pageSize);
    const center = limitPage / 2;

    const data: any = {
      list: [],
    };
    // 判断是否需要隐藏
    if (hideOnSinglePage && pages <= 1) {
      data.hide = true;
    }

    if (pages <= limitPage) {
      times(pages, (index) => {
        const current = index + 1;
        data.list.push({
          name: `${current}`,
          index: current,
          disabled: current === page,
          isActived: current === page,
        });
      });
    } else {
      let startNum: number;
      let endNum: number;

      if (page - center > 0 && page + center <= pages) {
        startNum = Math.ceil(page - center);
      } else if (page - center <= 0) {
        startNum = 1;
      } else {
        startNum = pages - limitPage + 1;
      }

      endNum = startNum + limitPage - 1;

      if (startNum >= 2) {
        data.list.push({
          name: '1',
          index: 1,
          disabled: false,
          isActived: 1 === page,
        });
      }

      if (startNum >= 3) {
        data.list.push({
          name: '...',
          index: Number.MIN_SAFE_INTEGER,
          disabled: true,
          isActived: false,
        });
      }
      times(limitPage, (index) => {
        const i = startNum + index;
        data.list.push({
          name: `${i}`,
          index: i,
          disabled: i === page,
          isActived: i === page,
        });
      });

      if (pages - endNum >= 2) {
        data.list.push({
          name: '...',
          index: Number.MAX_SAFE_INTEGER,
          disabled: true,
          isActived: false,
        });
      }

      if (pages - endNum >= 1) {
        data.list.push({
          name: pages,
          disabled: false,
          isActived: pages === page,
        });
      }
    }

    setState(data);
  }, [page, pageSize, total, hideOnSinglePage]);

  return (
    <ul
      className={classnames(styles.wrap, {
        [styles.center]: align === 'center',
        [styles.left]: align === 'left',
        [styles.right]: align === 'right',
      })}
    >
      <li
        className={classnames({
          [styles.disabled]: page === 1,
        })}
        key="icon-left"
      >
        <i className="iconicon-test4 iconfont" />
      </li>
      {map(state.list, (item) => {
        return (
          <li
            className={classnames(styles.num,{
              [styles.disabled]: item.disabled,
              [styles.active]: item.isActived,
            })}
            key={item.index}
            onClick={
              item.disabled ? noop : () => handleChange(item.index, pageSize)
            }
          >
            {item.name}
          </li>
        );
      })}
      <li
        className={classnames({
          [styles.disabled]: page === Math.ceil(total / pageSize),
        })}
        key="icon-right"
      >
        <i className="iconicon-test6 iconfont" />
      </li>
    </ul>
  );
};

export default Pagination;
