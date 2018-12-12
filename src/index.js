import React from 'react';
import ReactDOM from 'react-dom';
import { store } from "./store";
import HowToGuide from './HowToGuide';

const render = function() {
  ReactDOM.render(
    <HowToGuide className="howToGuide" tech={store.getState().tech} />, 
    document.getElementById('howToGuide')
  );  
}
render();

store.subscribe(render);