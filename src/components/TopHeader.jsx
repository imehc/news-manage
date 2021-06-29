import React, { useState } from 'react'
import { connect } from 'react-redux';//引入connect

import { Layout, Dropdown, Menu, Avatar } from 'antd';
import { withRouter } from 'react-router-dom';
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  UserOutlined
} from '@ant-design/icons';
const { Header } = Layout;

function TopHeader(props) {
  console.log(props);//查看redux返回的值
  // 引入hooks
  const [collapsed, setCollapsed] = useState(false)
  const changeCollapsed = () => {
    setCollapsed(!collapsed)
  }
  const { role: { roleName }, username } = JSON.parse(sessionStorage.getItem("token"))
  const menu = (
    <Menu>
      <Menu.Item key={roleName}>
        {roleName}
      </Menu.Item>
      <Menu.Item key="logon" danger onClick={() => {
        sessionStorage.removeItem("token")
        console.log(props);
        props.history.replace('/login')
      }}>退出</Menu.Item>
    </Menu>
  );
  return (
    <Header className="site-layout-background" style={{ padding: "0 16px" }}>
      {
        collapsed ? <MenuUnfoldOutlined onClick={changeCollapsed} /> : <MenuFoldOutlined onClick={changeCollapsed} />
      }
      <div style={{ float: "right" }}>
        <span>欢迎<span style={{ color: 'rgb(135, 206, 235)' }}>{username}</span>回来</span>
        <Dropdown overlay={menu} >
          <Avatar size="large" icon={<UserOutlined />} style={{ marginLeft: 10 }} />
        </Dropdown>
      </div>
    </Header>
  )
}
/*
connect(
  //mapStateToProps
  //mapDispatchToProps
)(被包装的组件)
*/

const mapStateToProps = ({ CollApsedReducer: { isCollapsed } }) => {
  // console.log('redux的值', state);
  return {
    isCollapsed
  }
}

export default connect(mapStateToProps)(withRouter(TopHeader))
