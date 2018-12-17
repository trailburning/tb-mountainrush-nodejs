import React, { Component } from "react";
import { store } from "./store";
import './static-assets/css/how_to_guide.css';
import HowToStep1 from "./HowToStep1";
import HowToStep2 from "./HowToStep2";
import HowToStep3 from "./HowToStep3";

import { loadLiterals } from "./reducers/literals";
import loadLang from "./locales";

class HowToGuide extends Component {
  render() {
    return [
      <HowToStep1 key={1} step={1} defContent={store.getState().literals.defs} stepContent={store.getState().literals.how_to_guide.step1} />,
      <HowToStep2 key={2} step={2} defContent={store.getState().literals.defs} stepContent={store.getState().literals.how_to_guide.step2} />,
      <HowToStep3 key={3} step={3} callbackBtnClicked={this.props.callbackSignupBtnClicked} hostURL={this.props.hostURL} defContent={store.getState().literals.defs} stepContent={store.getState().literals.how_to_guide.step3} />
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
