import React, { useEffect, useState } from 'react'
//高阶组件
import { withRouter } from 'react-router-dom';

import './index.css'

import { Layout, Menu } from 'antd';
import {
  UserOutlined,
  // VideoCameraOutlined,
  // UploadOutlined,
} from '@ant-design/icons';
import axios from "axios";
const { Sider } = Layout;
const { SubMenu } = Menu;

const iconList = {
  "/home": <UserOutlined />,
  "/user-manage": <UserOutlined />,
  "/user-manage/list": <UserOutlined />,
  "/right-manage": <UserOutlined />,
  "/right-manage/role/list": <UserOutlined />,
  "/right-manage/right/list": <UserOutlined />,
  "/news-manage": <UserOutlined />,
  "/news-manage/add": <UserOutlined />,
  "/news-manage/add": <UserOutlined />,
  "/news-manage/draft": <UserOutlined />,
  "/news-manage/category": <UserOutlined />,
  "/audit-manage": <UserOutlined />,
  "/audit-manage/audit": <UserOutlined />,
  "/audit-manage/list": <UserOutlined />,
  "/publish-manage": <UserOutlined />,
  "/publish-manage/unpublished": <UserOutlined />,
  "/publish-manage/published": <UserOutlined />,
  "/publish-manage/sunset": <UserOutlined />,
}

function SideMenu(props) {
  const [meun, setMeun] = useState([])
  useEffect(() => {
    axios.get("/rights?_embed=children").then(res => {
      console.log('menu列表', res.data);
      setMeun(res.data)
    })
  }, [])
  const { role: { rights } } = JSON.parse(sessionStorage.getItem("token"))
  const checkPagePermission = (item) => {
    // console.log(item);
    // return item.pagepermisson === 1
    return item.pagepermisson && rights.includes(item.key)
  }
  const renderMenu = (menuList) => {
    return menuList.map(item => {
      if (item.children?.length > 0 && checkPagePermission(item)) {
        return <SubMenu key={item.key} icon={iconList[item.key]} title={item.title}>
          {renderMenu(item.children)}
        </SubMenu>
      }
      return checkPagePermission(item) && <Menu.Item key={item.key} icon={iconList[item.key]} onClick={() => {
        props.history.push(item.key)
      }}>{item.title}</Menu.Item>
    })
  }
  // console.log(props);
  const selectKeys = [props.location.pathname]
  const openKeys = ["/" + props.location.pathname.split('/')[1]]
  return (
    <Sider trigger={null} collapsible>
      <div style={{ display: "flex", height: "100%", "flexDirection": "column" }}>
        <div className="logo" >News Publishing System</div>
        <div style={{ flex: 1, "overflow": "auto" }}>
          <Menu theme="dark" mode="inline" selectedKeys={selectKeys} defaultOpenKeys={openKeys}>
            {renderMenu(meun)}
          </Menu>
        </div>
      </div>
    </Sider>
  )
}

export default withRouter(SideMenu)