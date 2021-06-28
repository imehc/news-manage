import React from 'react'
import { HashRouter, Route, Switch, Redirect } from "react-router-dom";
import Login from '../views/Login';
import NewsSandBox from '../views/NewsSandBox';
export default function indexRouter() {
  return (
    <HashRouter>
      <Switch>
        <Route path="/login" component={Login} />
        <Route path="/" component={() =>
          sessionStorage.getItem("token") ? <NewsSandBox /> : <Redirect to="/login" />
        } />
      </Switch>
    </HashRouter>
  )
}
