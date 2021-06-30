import { createStore, combineReducers } from "redux"; //combineReducers 合并多个reducer
import { CollApsedReducer } from "./reducers/CollApsedReducer";
import { LoadingReducer } from "./reducers/LoadingReducer";

import { persistStore, persistReducer } from "redux-persist"; //持久化存储状态
import storage from "redux-persist/lib/storage"; // defaults to localStorage for web
const persistConfig = {
  key: "persist",//存储的key
  storage,
  blacklist: ['LoadingReducer'] ,// navigation will not be persisted
  // whitelist: ['navigation'] // only navigation will be persisted
};

const reducer = combineReducers({
  CollApsedReducer,
  LoadingReducer,
});

const persistedReducer = persistReducer(persistConfig, reducer); //将reducer进行持久化处理

const store = createStore(persistedReducer,window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());//redux工具扩展
const persistor = persistStore(store);//持久化存储

export { store, persistor };

/*
store.dispatch  分发
store.subsribr()
*/
