import React, { Component } from "react";
import { store } from "./store";
import './static-assets/css/HowToGuide.css';
import HowToStep1 from "./HowToStep1";
import HowToStep2 from "./HowToStep2";
import HowToStep3 from "./HowToStep3";

import { loadLiterals } from "./reducers/literals";
import loadLang from "./locales";

class HowToGuide extends Component {
  render() {
    return [
      <HowToStep1 key={1} step={1} title={store.getState().literals.how_to_guide.step1.title} subtitle={store.getState().literals.how_to_guide.step1.subtitle} description={store.getState().literals.how_to_guide.step1.description} />,
      <HowToStep2 key={2} step={2} title={store.getState().literals.how_to_guide.step2.title} subtitle={store.getState().literals.how_to_guide.step2.subtitle} description={store.getState().literals.how_to_guide.step2.description} />,
      <HowToStep3 key={3} step={3} callbackBtnClicked={this.props.callbackSignupBtnClicked} hostURL={this.props.hostURL} title={store.getState().literals.how_to_guide.step3.title} subtitle={store.getState().literals.how_to_guide.step3.subtitle} description={store.getState().literals.how_to_guide.step3.description} />
    ];
  }
}
/*
function dispatchBtnAction(e) {
  const lang = loadLang('de');
  store.dispatch(loadLiterals(lang));
}
*/
export default HowToGuide;
