import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { store } from "./store";
import App from './App';

const render = function() {
  ReactDOM.render(
    <App tech={store.getState().tech} />, 
    document.getElementById('root')
  );  
}
render();

store.subscribe(render);