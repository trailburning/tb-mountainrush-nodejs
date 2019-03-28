import React from "react";
import ScrollAnimationCustom from './ScrollAnimationCustom';
const reactStringReplace = require('react-string-replace');

export default class HowToStep extends React.Component {
  dispatchSignupBtnAction(e) {
    this.props.callbackSignupBtnClicked();
  }

  dispatchChallengeBtnAction(e) {
    this.props.callbackChallengeBtnClicked();
  }

  ctaContent() {
    // last step renders cta
    if (this.props.last) {
      return (
        <div className="btn-ctas">
          <div className="btn-cta action signup-action">
          <button className="btn mr-btn btn-primary double" onClick={this.dispatchSignupBtnAction.bind(this)}>
          <div>{this.props.content.defs.signup}</div><div><i className="fa fa-arrow-right"></i></div>
          </button>
          </div>
          <div className="btn-cta action challenge-action">
          <button className="btn mr-btn btn-primary double" onClick={this.dispatchChallengeBtnAction.bind(this)}>
          <div>{this.props.content.defs.challenge.create}</div><div><i className="fa fa-arrow-right"></i></div>
          </button>
          </div>
        </div>
      )
    }
  }

  stepContent() {
    if (this.props.toggle) {
      return (
        <div className="content">
          <div className="embelish left-background"></div>
          <div className="visible-xs">
            <div className="col col-left">
              <div className="image"><img className="animate" src={"/static-assets/images/wwf-uk/how-to-guide/" + this.props.step + ".png"} /></div>
            </div>
            <div className="col col-right">
              <div className="text">
                <div className="animate">
                <h1>{this.props.stepContent.title}</h1>
                <h2>{this.props.stepContent.subtitle}</h2>
                {reactStringReplace(this.props.stepContent.description, '%s', (match, i) => (
                  <a key={i} href="https://www.strava.com/mobile" className="link" target="_blank">{this.props.content.defs.strava_app}</a>
                ))}
                {this.ctaContent()}
                </div>
              </div>
            </div>
          </div>

          <div className="hidden-xs">
            <div className="col col-left">
              <div className="text">
                <div className="animate">
                <h1>{this.props.stepContent.title}</h1>
                <h2>{this.props.stepContent.subtitle}</h2>
                {reactStringReplace(this.props.stepContent.description, '%s', (match, i) => (
                  <a key={i} href="https://www.strava.com/mobile" className="link" target="_blank">{this.props.content.defs.strava_app}</a>
                ))}
                {this.ctaContent()}
                </div>
              </div>
            </div>
            <div className="col col-right">
              <div className="image"><img className="animate" src={"/static-assets/images/wwf-uk/how-to-guide/" + this.props.step + ".png"} /></div>
            </div>
          </div>
        </div>
      )
    }
    else {
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
  }

  render() {
    let className = "howToStep " + this.props.step;
    let delay = 0, offset = 0;

    return (
      <div className={className}>
        <ScrollAnimationCustom key={this.props.step} animateIn="fadeIn" animateOut="fadeOut" animateOnce={false} delay={delay} offset={offset}>
        {this.stepContent()}
        </ScrollAnimationCustom>
      </div>
    );
  }
}
