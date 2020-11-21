import React, {
  Context,
  useState,
  useMemo,
  useCallback,
  useEffect,
} from 'react';
import { useSetState } from 'ahooks';
import classnames from 'classnames';
import { isEmpty, noop, get, map, find, first } from 'lodash';
import styles from './index.less';

export interface ITabs {
  activeKey?: string;
  onChange?: (key: string) => any;
  children?: any;
  className?: string;
}
export interface ITabPane {
  tabKey: string;
  tabName: string;
  children?: any;
}

export interface IState {
  active: string;
  isControlled: boolean;
}

export const TabPane = (props: ITabPane) => {
  const { children, tabKey } = props;
  return <div key={tabKey}>{children}</div>;
};

const Tabs = ({
  children,
  activeKey: key,
  onChange = noop,
  className,
}: ITabs) => {
  // TODO useSetState 不造咋设置 返回值 类型
  const initState = useCallback(() => {
    let active: string;
    let isControlled = false;
    if (key !== undefined) {
      active = key;
      isControlled = true;
    } else if (isEmpty(children)) {
      active = '0';
    } else if (!Array.isArray(children)) {
      active = get(children, 'props.tabKey');
    } else {
      active = get(first(children), 'props.tabKey');
    }
    return { active, isControlled };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [state, setState] = useSetState<IState>(initState());

  const { active, isControlled } = state;

  const cList = useMemo(() => {
    return React.Children.map(children, (child) => {
      if (child && child.type === TabPane) return child;
      return undefined;
    }).filter(Boolean);
  }, [children]);

  const tabList = useMemo(() => {
    if (isEmpty(cList)) return [];
    return map(cList, (child, index) => {
      return {
        tabKey: get(child, 'props.tabKey', index.toString()),
        tabName: get(child, 'props.tabName', ''),
      };
    });
  }, [cList]);

  const activeChild = useMemo(() => {
    if (isEmpty(cList)) return null;
    return find(cList, (c) => get(c, 'props.tabKey') === active);
  }, [cList, active]);

  const handleOnChange = useCallback(
    (activeKey: string) => {
      setState({ active: activeKey });
      onChange(activeKey);
    },
    [onChange, setState]
  );

  useEffect(() => {
    if (!isControlled) return;
    setState({ active: key });
  }, [key, setState]);

  return (
    <div
      className={classnames(styles['tabs-wrap'], {
        [(className as string)]: !!className,
      })}
    >
      <ul className={styles['tab-wrap']}>
        {map(tabList, ({ tabKey, tabName }: ITabPane) => {
          return (
            <li
              onClick={() => handleOnChange(tabKey)}
              key={tabKey}
              className={classnames({
                [styles.active]: active === tabKey,
              })}
            >
              {tabName}
            </li>
          );
        })}
      </ul>
      <div className={styles.solt}>{activeChild}</div>
    </div>
  );
};

Tabs.TabPane = TabPane;

export default Tabs;
