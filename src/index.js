import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

const render = function() {
  ReactDOM.render(
    <App tech={'Woohoo!'} />, 
    document.getElementById('root')
  );  
}
render();