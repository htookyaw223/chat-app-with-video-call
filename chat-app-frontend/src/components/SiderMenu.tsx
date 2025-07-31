import React from "react";
import {
  MessageOutlined,
  UsergroupAddOutlined,
  PhoneOutlined,
} from "@ant-design/icons";
import { Layout, Menu } from "antd";

import type { GetProp, MenuProps } from "antd";
import { useNavigate } from "react-router-dom";

type MenuItem = GetProp<MenuProps, "items">[number];

const { Sider , Footer} = Layout;

const SiderMenu = () => {
  const navigate = useNavigate();
  const items: MenuItem[] = [
    {
      key: "1",
      style: {
        display: "flex",
        justifyContent: "center",
        height: 70,
      },
      onClick: () => {navigate("/")},
      icon: <MessageOutlined shape="square" style={{ fontSize: 25 }} />,
    },
    {
      key: "2",
      style: {
        display: "flex",
        justifyContent: "center",
        height: 70,
      },
      onClick: () => {navigate("/friends")},
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
