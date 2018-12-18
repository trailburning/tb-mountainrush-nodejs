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
      <HowToStep1 key={1} step={1} content={store.getState().literals} />,
      <HowToStep2 key={2} step={2} content={store.getState().literals} />,
      <HowToStep3 key={3} step={3} content={store.getState().literals} callbackBtnClicked={this.props.callbackSignupBtnClicked} />
    ];
  }
}

export default HowToGuide;
