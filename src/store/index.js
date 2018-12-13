import { createStore, combineReducers } from "redux";
import literals from "../reducers/literals.js";

const rootReducer = combineReducers({
  literals
});

export const store = createStore(rootReducer);
