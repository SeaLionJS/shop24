import { combineReducers } from "redux";
import { createStore } from "redux";
import ThemeReducer from "./ThemeReducer";
import MessageBoxReducer from "./MessageBoxReducer";
import PageReducer from "./PageReducer";
import GoodsReducer from "./GoodsReducer";


const rootReducer = combineReducers({
  theme: ThemeReducer,
  messageBox: MessageBoxReducer,
  page: PageReducer,
  goods: GoodsReducer,
});

const store = createStore(rootReducer);
export default store;
