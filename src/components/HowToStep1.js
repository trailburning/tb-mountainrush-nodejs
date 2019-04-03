import React from "react";
import ScrollAnimationCustom from './ScrollAnimationCustom';
const reactStringReplace = require('react-string-replace');

export default class HowToStep1 extends React.Component {
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
