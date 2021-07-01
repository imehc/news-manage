import React from 'react'
import { HashRouter, Route, Switch, Redirect } from "react-router-dom";
import News from '../views/news/News';
import Detail from '../views/news/Detail';
import Login from '../views/Login';
import NewsSandBox from '../views/NewsSandBox';
export default function indexRouter() {
  return (
    <HashRouter>
      <Switch>
        <Route path="/news" component={News} />
        <Route path="/detail/:id" component={Detail} />
        <Route path="/login" component={Login} />
        <Route path="/" component={() =>
          sessionStorage.getItem("token") ? <NewsSandBox /> : <Redirect to="/login" />
        } />
      </Switch>
    </HashRouter>
  )
}
