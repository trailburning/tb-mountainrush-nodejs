import React from 'react';
import ReactDOM from 'react-dom';
import { store } from "./store";
import { loadLiterals } from "./store/literals";
import loadLang from "./locales";
import HowToGuide from './HowToGuide';

let selLag = 'en';
if (typeof CAMPAIGN_SEL_LANGUAGE !== 'undefined') {
  selLag = CAMPAIGN_SEL_LANGUAGE;
}

const lang = loadLang(selLag);
store.dispatch(loadLiterals(lang));

const render = function() {
  ReactDOM.render(
    <HowToGuide className="howToGuide" tech={store.getState().tech} />, 
    document.getElementById('howToGuide')
  );  
}
render();

store.subscribe(render);