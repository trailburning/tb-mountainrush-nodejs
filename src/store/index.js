import reducer from "../reducers";
import { createStore } from "redux";

const initialState = { tech: "React" };
export const store = createStore(reducer, initialState);
