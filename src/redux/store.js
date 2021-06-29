import { createStore, combineReducers } from "redux"; //combineReducers 合并多个reducer
import { CollApsedReducer } from "./reducers/CollApsedReducer";

const reducer = combineReducers({
  CollApsedReducer,
});
const store = createStore(reducer);

export default store;

/*
store.dispatch  分发
store.subsribr()
*/
