import React from "react";
import ScrollAnimationCustom from './ScrollAnimationCustom';

export default class HowToStep1 extends React.Component {
  render() {  
    return (
      <div className={"howToStep stepChallenge"}>

        <ScrollAnimationCustom key={this.props.step} animateIn="fadeIn" animateOut="fadeOut" animateOnce={false} delay={1000} offset={0}>

        <div className="content">
          <div className="embelish left-background"></div>

          <div className="col col-left">
            <div className="image"><img className="animate" src="/static-assets/images/wwf-uk/how-to-guide/step1.png" /></div>
          </div>
          <div className="col col-right">
            <div className="text">
              <div className="animate">
              <h1>{this.props.content.how_to_guide.step1.title}</h1>
              <h2>{this.props.content.how_to_guide.step1.subtitle}</h2>
              {this.props.content.how_to_guide.step1.description}
              </div>
            </div>
          </div>

          <div className="embelish left-foreground"></div>
        </div>

        </ScrollAnimationCustom>

      </div>
    )
  }
};
