import React, { useEffect } from 'react'
//引入自己写的组件
import SideMenu from '../../components/SideMenu'
import TopHeader from '../../components/TopHeader'
//引入ant css
import './index.css'
//引入进度条插件
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
//引入ant组件
import { Layout } from 'antd';
import NewsRouter from '../../components/NewsRouter';
const { Content } = Layout;
export default function NewsSandBox() {
  NProgress.start();
  useEffect(() => {
    NProgress.done();
  })
  return (
    <Layout>
      <SideMenu></SideMenu>
      <Layout className="site-layout">
        <TopHeader></TopHeader>
        <Content
          className="site-layout-background"
          style={{
            margin: '24px 16px',
            padding: 24,
            minHeight: 280,
            overflow: "auto"
          }}
        >
          <NewsRouter />
        </Content>
      </Layout>
    </Layout>
  )
}
