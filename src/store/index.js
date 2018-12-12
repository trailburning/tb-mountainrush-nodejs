import reducer from "../reducers";
import { createStore, combineReducers } from "redux";
import literals from "./literals.js";

const rootReducer = combineReducers({
  literals,
  reducer
});

const initialState = { tech: "React" };
//export const store = createStore(reducer, initialState);
export const store = createStore(rootReducer);
