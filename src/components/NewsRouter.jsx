import React, { useState, useEffect } from 'react'
import { Route, Switch, Redirect } from 'react-router-dom'
import axios from 'axios'
//引入自己写的组件
import Home from '../views/NewsSandBox/home'
import UserList from '../views/NewsSandBox/user-manage'
import RoleList from '../views/NewsSandBox/right-manage/role'
import RightList from '../views/NewsSandBox/right-manage/right'
import NoPermission from '../views/NewsSandBox/nopermission'
import NewsAdd from '../views/NewsSandBox/news-manage/NewsAdd'
import NewsDraft from '../views/NewsSandBox/news-manage/NewsDraft'
import NewsCategory from '../views/NewsSandBox/news-manage/NewsCategory'
import NewsPreview from '../views/NewsSandBox/news-manage/NewsPreview'//预览
import NewsUpdate from '../views/NewsSandBox/news-manage/NewsUpdate'//更新
import Audit from '../views/NewsSandBox/audit-manage/Audit'
import AuditList from '../views/NewsSandBox/audit-manage/AuditList'
import Unpublished from '../views/NewsSandBox/publish-manage/Unpublished'
import Published from '../views/NewsSandBox/publish-manage/Published'
import Sunset from '../views/NewsSandBox/publish-manage/Sunset'


const LocalRouterMap = {
  "/home": Home,
  "/user-manage/list": UserList,
  "/right-manage/role/list": RoleList,
  "/right-manage/right/list": RightList,
  "/news-manage/add": NewsAdd,
  "/news-manage/draft": NewsDraft,
  "/news-manage/category": NewsCategory,
  "/news-manage/preview/:id": NewsPreview,
  "/news-manage/update/:id": NewsUpdate,
  "/audit-manage/audit": Audit,
  "/audit-manage/list": AuditList,
  "/publish-manage/unpublished": Unpublished,
  "/publish-manage/published": Published,
  "/publish-manage/sunset": Sunset
}
export default function NewsRouter() {
  const [BankRouteList, setBankRouteList] = useState([])
  useEffect(() => {
    Promise.all([
      axios.get(`/rights`),
      axios.get(`/children`)
    ]).then(res => {
      // console.log('合并', res);
      setBankRouteList([...res[0].data, ...res[1].data])
    })
  }, [])
  const { role: { rights } } = JSON.parse(sessionStorage.getItem("token"))
  const checkRoute = (item) => {
    return LocalRouterMap[item.key] && (item.pagepermisson || item.routepermisson)//本地路由和pagepermisson
  }
  const checkUserPermission = (item) => {
    //当前用户权限列表是否包含
    return rights.includes(item.key)
  }
  return (
    <Switch>
      {/* <Route path="/home" component={Home} />
      <Route path="/user-manage/list" component={UserList} />
      <Route path="/right-manage/role/list" component={RoleList} />
      <Route path="/right-manage/right/list" component={RightList} /> */}
      {
        BankRouteList.map(item => {
          // console.log(BankRouteList);
          if (checkRoute(item) && checkUserPermission(item)) {
            return <Route path={item.key} key={item.key} component={LocalRouterMap[item.key]} exact></Route>
          }
          return null
        })
      }
      {/* exact 精确匹配 */}
      <Redirect from="/" to="/home" exact />
      {/* 都不满足走此路由 */}
      {
        BankRouteList.length > 0 && <Route path="*" component={NoPermission} />
      }
    </Switch>
  )
}
