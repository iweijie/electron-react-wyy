import React, { useEffect, useState } from 'react';
import { useSetState, useMount, usePersistFn } from 'ahooks';
import classnames from 'classnames';
import { times, map } from 'lodash';
import styles from './index.less';

interface IPaginationProps {
  pageSize: number;
  page: number;
  total: number;
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
  leftDisabled: boolean;
  rightDisabled: boolean;
  hide: boolean;
}

const limitPage = 7;

const Pagination = (props: IPaginationProps) => {
  const { pageSize, total, onChange, hideOnSinglePage = false } = props;

  const [state, setState] = useSetState<IPaginationState>({
    page: props.page || 1,
    list: [],
    leftDisabled: false,
    rightDisabled: false,
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
    const center = Math.floor(limitPage / 2);

    const data: any = {
      list: [],
    };
    // 判断是否需要隐藏
    if (hideOnSinglePage && pages <= 1) {
      data.hide = true;
    }

    if (pages <= limitPage) {
      times(limitPage, (index) => {
        data.list.push({
          name: `${index + 1}`,
          index: index + 1,
          disabled: false,
          isActived: index + 1 === page,
        });
      });
    } else {
      if (page > center) {
        data.list.push({
          name: '1',
          index: 1,
          disabled: false,
          isActived: 1 === page,
        });
      }

      if (page <= center + 1) {
        data.list.push({
          name: '...',
          disabled: true,
          isActived: false,
        });
      }

      times(limitPage, (index) => {
        const i = page - index;
        data.list.push({
          name: i,
          disabled: false,
          isActived: i === page,
        });
      });

      if (page < pages - center) {
        data.list.push({
          name: pages,
          disabled: false,
          isActived: pages === page,
        });
      }

      console.log(data);
    }

    setState(data);
  }, [page, pageSize, total, hideOnSinglePage]);

  return (
    <ul className={classnames(styles.wrap)}>
      <li
        className={classnames({
          [styles.disabled]: state.leftDisabled,
        })}
      >
        <i className="iconicon-test4 iconfont" />
      </li>
      {map(state.list, (item) => {
        return (
          <li
            className={classnames({
              [styles.disabled]: item.disabled,
              [styles.active]: item.isActived,
            })}
            onClick={() => handleChange(item.index, pageSize)}
          >
            {item.name}
          </li>
        );
      })}
      <li
        className={classnames({
          [styles.disabled]: state.rightDisabled,
        })}
      >
        <i className="iconicon-test6 iconfont" />
      </li>
    </ul>
  );
};

export default Pagination;
