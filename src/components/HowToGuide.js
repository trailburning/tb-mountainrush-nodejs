import React, { Component } from "react";
import { store } from "../store";
import '../static-assets/css/how_to_guide.css';
import HowToStep1 from "./HowToStep1";
import HowToStep2 from "./HowToStep2";
import HowToStep3 from "./HowToStep3";

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
    let callbackBtnClicked = this.props.callbackBtnClicked;

    return (
      <div>
        <HowToStep1 key={0} step={'challenge'} toggle={0} stepContent={store.getState().literals.how_to_guide['challenge']} content={store.getState().literals} callbackBtnClicked={callbackBtnClicked} />
        <HowToStep2 key={1} step={'active'} toggle={1} stepContent={store.getState().literals.how_to_guide['active']} content={store.getState().literals} callbackBtnClicked={callbackBtnClicked} />
        <HowToStep3 key={2} step={'fundraise'} toggle={0} stepContent={store.getState().literals.how_to_guide['fundraise']} content={store.getState().literals} callbackBtnClicked={callbackBtnClicked} />
      { /*<button onClick={this.dispatchReduxBtnAction.bind(this)}>Toggle Language</button> */}
      </div>
    );
  }
}

export default HowToGuide;
