import { useSetState } from 'ahooks';
import React, { Context, useState } from 'react';

interface ITabs {
  activeKey?: string;
  onChange?: (key: string) => any;
  children: React.ReactNode;
  TabPane: React.ReactNode;
}
interface ITabPane {
  key: string;
  tab: string;
}

export const TabPane: React.FC<ITabPane> = (props) => {
  const { children, key } = props;
  return <div>{children}</div>;
};

const Tabs = ({ children, activeKey }: ITabs) => {
  const list = React.Children.map(children, (child) => {
    if (child === null) return;
    if (!('type' in child)) return;
    // && child.type === TabPane
  });

  const [active, setActive] = useState();

  return <div>{children}</div>;
};

Tabs.TabPane = TabPane;

export default Tabs;

//   <Tabs type="card">
//   <TabPane tab="Tab Title 1" key="1">
//     <p>Content of Tab Pane 1</p>
//     <p>Content of Tab Pane 1</p>
//     <p>Content of Tab Pane 1</p>
//   </TabPane>
//   <TabPane tab="Tab Title 2" key="2">
//     <p>Content of Tab Pane 2</p>
//     <p>Content of Tab Pane 2</p>
//     <p>Content of Tab Pane 2</p>
//   </TabPane>
//   <TabPane tab="Tab Title 3" key="3">
//     <p>Content of Tab Pane 3</p>
//     <p>Content of Tab Pane 3</p>
//     <p>Content of Tab Pane 3</p>
//   </TabPane>
// </Tabs>
