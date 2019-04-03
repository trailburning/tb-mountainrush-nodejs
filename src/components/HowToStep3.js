import React from "react";
import ScrollAnimationCustom from './ScrollAnimationCustom';
const reactStringReplace = require('react-string-replace');

export default class HowToStep3 extends React.Component {
  dispatchBtnAction(param) {
    this.props.callbackBtnClicked(param);
  }

  ctaContent() {
    return (
      <div className="btn-ctas">
        <div className="btn-cta visible-player-inactive">
        <button className="btn mr-btn btn-primary double" onClick={this.dispatchBtnAction.bind(this, 'signup')}>
        <div>{this.props.content.defs.signup}</div><div><i className="fa fa-arrow-right"></i></div>
        </button>
        </div>
        <div className="btn-cta visible-player-active">
        <button className="btn mr-btn btn-primary double" onClick={this.dispatchBtnAction.bind(this, 'challenge')}>
        <div>{this.props.content.defs.challenge.create}</div><div><i className="fa fa-arrow-right"></i></div>
        </button>
        </div>
      </div>
    )
  }

  stepContent() {
    return (
      <div className="content">
        <div className="embelish left-background"></div>
        <div className="col col-left">
          <div className="image"><img className="animate" src={"/static-assets/images/wwf-uk/how-to-guide/" + this.props.step + ".png"} /></div>
        </div>
        <div className="col col-right">
          <div className="text">
            <div className="animate">
            <h1>{this.props.stepContent.title}</h1>
            <h2>{this.props.stepContent.subtitle}</h2>
            {this.props.stepContent.description}
            {this.ctaContent()}
            </div>
          </div>
        </div>
        <div className="embelish left-foreground"></div>
      </div>
    )  
  }

  render() {
    let className = "howToStep " + this.props.step;

    return (
      <div className={className}>
        <ScrollAnimationCustom key={this.props.step} animateIn="fadeIn" animateOut="fadeOut" animateOnce={false}>
        {this.stepContent()}
        </ScrollAnimationCustom>
      </div>
    );
  }
}
