import React from "react";
import IndexRouter from "./router/indexRouter";
import "./App.css";
import { Provider } from "react-redux";
import store from "./redux/store";

export default function App() {
  return (
    //将Provider包裹住整个跟组件
    <Provider store={store}>
      <IndexRouter />;
    </Provider>
  );
}
