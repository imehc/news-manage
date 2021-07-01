import React, { useEffect, useState } from 'react'
//高阶组件
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';//引入react-redux容器组件，包裹需要状态管理的组件
import './index.css'

import { Layout, Menu } from 'antd';
import {
  UserOutlined,
  HomeOutlined,
  TeamOutlined,
  ControlOutlined,
  NodeIndexOutlined,
  ShareAltOutlined,
  SnippetsOutlined,
  EditOutlined,
  RestOutlined,
  CopyOutlined,
  MonitorOutlined,
  ReconciliationOutlined,
  ProfileOutlined,
  CloudOutlined,
  CloudServerOutlined,
  CloudUploadOutlined,
  CloudSyncOutlined
  // VideoCameraOutlined,
  // UploadOutlined,
} from '@ant-design/icons';
import axios from "axios";
const { Sider } = Layout;
const { SubMenu } = Menu;

const iconList = {
  "/home": <HomeOutlined />,
  "/user-manage": <UserOutlined />,
  "/user-manage/list":<TeamOutlined />,
  "/right-manage": <ControlOutlined />,
  "/right-manage/role/list": <NodeIndexOutlined />,
  "/right-manage/right/list":<ShareAltOutlined />,
  "/news-manage": <SnippetsOutlined />,
  "/news-manage/add": <EditOutlined />,
  "/news-manage/draft": <RestOutlined />,
  "/news-manage/category": <CopyOutlined />,
  "/audit-manage":<MonitorOutlined />,
  "/audit-manage/audit": <ReconciliationOutlined />,
  "/audit-manage/list": <ProfileOutlined />,
  "/publish-manage": <CloudServerOutlined />,
  "/publish-manage/unpublished":<CloudSyncOutlined />,
  "/publish-manage/published": <CloudUploadOutlined />,
  "/publish-manage/sunset": <CloudOutlined />,
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
    <Sider trigger={null} collapsible collapsed={props.isCollapsed}>
      <div style={{ display: "flex", height: "100%", "flexDirection": "column" }}>
        {
          props.isCollapsed ? <div className="logo" >News</div> : <div className="logo">News Publishing System</div>
        }
        <div style={{ flex: 1, "overflow": "auto" }}>
          <Menu theme="dark" mode="inline" selectedKeys={selectKeys} defaultOpenKeys={openKeys}>
            {renderMenu(meun)}
          </Menu>
        </div>
      </div>
    </Sider>
  )
}
const mapStateToProps = ({ CollApsedReducer: { isCollapsed } }) => ({
  isCollapsed//就一个函数体可以省略return 但是要加上小括号，否则会被认为是对象
})
export default connect(mapStateToProps)(withRouter(SideMenu))