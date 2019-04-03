import React from "react";
import ScrollAnimationCustom from './ScrollAnimationCustom';
const reactStringReplace = require('react-string-replace');

export default class HowToStep2 extends React.Component {
  stepContent() {
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

  render() {
    let className = "howToStep " + this.props.step;

    return (
      <div className={className}>
        <ScrollAnimationCustom key={this.props.step} animateIn="fadeIn" animateOut="fadeOut" animateOnce={false} delay={0} offset={0}>
        {this.stepContent()}
        </ScrollAnimationCustom>
      </div>
    );
  }
}
