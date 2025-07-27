import React from "react";
import {
  MessageOutlined,
  UsergroupAddOutlined,
  PhoneOutlined,
} from "@ant-design/icons";
import { Layout, Menu } from "antd";

import type { GetProp, MenuProps } from "antd";

type MenuItem = GetProp<MenuProps, "items">[number];

const { Sider , Footer} = Layout;

const SiderMenu = () => {
  const items: MenuItem[] = [
    {
      key: "1",
      style: {
        display: "flex",
        justifyContent: "center",
        height: 70,
      },

      icon: <MessageOutlined shape="square" style={{ fontSize: 25 }} />,
    },
    {
      key: "2",
      style: {
        display: "flex",
        justifyContent: "center",
        height: 70,
      },
      icon: <UsergroupAddOutlined shape="square" style={{ fontSize: 25 }} />,
    },
    {
      type: "divider",
      style: { fontSize: 25 },
    },
  ];

  return (
    <Sider width={90} theme="light">
      <Menu
        style={{ textAlign: "center", height: "100%" }}
        defaultSelectedKeys={["1"]}
        defaultOpenKeys={["sub1"]}
        theme={"light"}
        items={items}
      />
    </Sider>
  );
};

export default SiderMenu;
