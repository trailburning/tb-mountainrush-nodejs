import React from "react";
import ScrollAnimation from 'react-animate-on-scroll';
const reactStringReplace = require('react-string-replace');

export default class HowToStep2 extends React.Component {
  render() {  
    return (
      <div className={"howToStep stepActive"}>

        <ScrollAnimation key={this.props.step} animateIn="fadeIn" animateOut="fadeOut" animateOnce={true} offset={50}>

        <div className="content">
          <div className="embelish left-background"></div>

          <div className="visible-xs">
            <div className="col col-left">
              <div className="image"><img className="animate" src="/static-assets/images/wwf-uk/how-to-guide/step2.png" /></div>
            </div>
            <div className="col col-right">
              <div className="text">
                <div className="animate">
                <h1>{this.props.content.how_to_guide.step2.title}</h1>
                <h2>{this.props.content.how_to_guide.step2.subtitle}</h2>
                {this.props.content.how_to_guide.step2.description.replace('%s', this.props.content.defs.strava_app)}
                </div>
              </div>
            </div>
          </div>

          <div className="hidden-xs">
            <div className="col col-left">
              <div className="text">
                <div className="animate">
                <h1>{this.props.content.how_to_guide.step2.title}</h1>
                <h2>{this.props.content.how_to_guide.step2.subtitle}</h2>
                {reactStringReplace(this.props.content.how_to_guide.step2.description, '%s', (match, i) => (
                  <a key={i} href="https://www.strava.com/mobile" className="link" target="_blank">{this.props.content.defs.strava_app}</a>
                ))}
                </div>
              </div>
            </div>
            <div className="col col-right">
              <div className="image"><img className="animate" src="/static-assets/images/wwf-uk/how-to-guide/step2.png" /></div>
            </div>
          </div>

        </div>

        </ScrollAnimation>
      </div>
    )
  }
};
