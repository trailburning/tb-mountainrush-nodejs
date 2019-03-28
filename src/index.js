import React from 'react';
import ReactDOM from 'react-dom';
import { store } from "./store";
import { loadLiterals } from "./reducers/literals";
import loadLang from "./locales";
import HowToGuide from './components/HowToGuide';

let hostURL = '';
if (typeof HOST_URL !== 'undefined') {
  hostURL = HOST_URL;
}

let campaignID = '';
if (typeof CAMPAIGN_ID !== 'undefined') {
  campaignID = CAMPAIGN_ID;
}

let selLag = 'en';
if (typeof CAMPAIGN_SEL_LANGUAGE !== 'undefined') {
  selLag = CAMPAIGN_SEL_LANGUAGE;
}

const lang = loadLang(selLag);
store.dispatch(loadLiterals(lang));

function onBtnClicked(param) {
  console.log(param);
  switch (param) {
    case 'signup':
      location = hostURL + '/campaign/' + campaignID + '/register';
      break;

    case 'challenge':
      location = hostURL + '/campaign/' + campaignID + '/gamecreate';
      break;
  }
}

const render = function() {
  ReactDOM.render(
    <HowToGuide className="howToGuide" callbackBtnClicked={onBtnClicked} />, 
    document.getElementById('howToGuide')
  );  
}
render();

store.subscribe(render);