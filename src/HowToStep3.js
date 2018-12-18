import React from "react";
import ScrollAnimation from 'react-animate-on-scroll';

import { store } from "./store";
import { loadLiterals } from "./reducers/literals";
import loadLang from "./locales";

export default class HowToStep3 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {lang: 'en'};
  }

  updateLang() {
    const lang = loadLang(this.state.lang);
    store.dispatch(loadLiterals(lang));
  }

  dispatchBtnAction(e) {
    this.props.callbackBtnClicked();
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
    return (
      <div className={"howToStep stepFundraise"}>

        <ScrollAnimation key={this.props.step} animateIn="fadeIn" animateOut="fadeOut" animateOnce={true} offset={50}>

        <div className="content">
          <div className="embelish left-background"></div>

          <div className="col col-left">
            <div className="image"><img className="animate" src="/static-assets/images/temp/step3.png" /></div>
          </div>
          <div className="col col-right">            
            <div className="text">
              <div className="animate">
                <h1>{this.props.content.how_to_guide.step3.title}</h1>
                <h2>{this.props.content.how_to_guide.step3.subtitle}</h2>
                {this.props.content.how_to_guide.step3.description}
                <div className="btn-cta">
                <button className="btn mr-btn btn-primary double" onClick={this.dispatchBtnAction.bind(this)}>
                <div>{this.props.content.defs.signup}</div><div><i className="fa fa-arrow-right"></i></div>
                </button>
                </div>

                <div className="btn-cta">
                <button className="btn mr-btn" onClick={this.dispatchReduxBtnAction.bind(this)}>Redux Baby!</button>
                </div>
              </div>
            </div>
          </div>

          <div className="embelish right-foreground"></div>
        </div>

        </ScrollAnimation>

      </div>
    );
  }
}
