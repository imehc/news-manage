import { createStore, combineReducers } from "redux"; //combineReducers 合并多个reducer
import { CollApsedReducer } from "./reducers/CollApsedReducer";
import { LoadingReducer } from "./reducers/LoadingReducer";

import { persistStore, persistReducer } from "redux-persist"; //持久化存储状态
import storageSession from "redux-persist/lib/storage/session"; // defaults to localStorage for web
import { devToolsEnhancer } from "redux-devtools-extension";
const persistConfig = {
  key: "persist", //存储的key
  storage: storageSession, //存放位置
  blacklist: ["LoadingReducer"], // navigation will not be persisted
  // whitelist: ['navigation'] // only navigation will be persisted
};

const reducer = combineReducers({
  CollApsedReducer,
  LoadingReducer,
});

const persistedReducer = persistReducer(persistConfig, reducer); //包装reducer

const store = createStore(
  persistedReducer,
  // window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__();//redux工具扩展
  devToolsEnhancer() //redux扩展工具
);
const persistor = persistStore(store); //持久化存储

export { store, persistor };

/*
store.dispatch  分发
store.subsribr()
*/
