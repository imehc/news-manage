import React from "react";
import IndexRouter from "./router/indexRouter";
import "./App.css";
import { Provider } from "react-redux";
import { store, persistor } from "./redux/store";
import { PersistGate } from "redux-persist/integration/react"; //引入持久化状态

export default function App() {
  return (
    //将Provider包裹住整个跟组件
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <IndexRouter />;
      </PersistGate>
    </Provider>
  );
}
