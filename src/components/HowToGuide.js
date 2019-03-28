import React, { Component } from "react";
import { store } from "../store";
import '../static-assets/css/how_to_guide.css';
import HowToStep from "./HowToStep";

import { loadLiterals } from "../reducers/literals";
import loadLang from "../locales";

class HowToGuide extends Component {
  constructor(props) {
    super(props);
    this.state = {lang: 'en'};
  }

  updateLang() {
    const lang = loadLang(this.state.lang);
    store.dispatch(loadLiterals(lang));
  }

  dispatchReduxBtnAction(e) {
    switch (this.state.lang) {
      case 'en':
        this.setState({lang: 'de'}, () => this.updateLang());
        break;

      case 'de':
        this.setState({lang: 'en'}, () => this.updateLang());
        break;
    }
  }

  render() {
    let guide = Object.keys(store.getState().literals.how_to_guide);
    let callbackSignupBtnClicked = this.props.callbackSignupBtnClicked;
    let callbackChallengeBtnClicked = this.props.callbackChallengeBtnClicked;

    return (
      <div>
      {guide.map(function(key, index){
        return <HowToStep key={index} step={key} first={(index ? false : true)} last={index == guide.length-1 ? true : false} toggle={index % 2} stepContent={store.getState().literals.how_to_guide[key]} content={store.getState().literals} callbackSignupBtnClicked={callbackSignupBtnClicked} callbackChallengeBtnClicked={callbackChallengeBtnClicked} />;
      })}
      { /*<button onClick={this.dispatchReduxBtnAction.bind(this)}>Toggle Language</button> */}
      </div>
    );
  }
}

export default HowToGuide;
