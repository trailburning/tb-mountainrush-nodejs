import React from "react";
import ScrollAnimation from 'react-animate-on-scroll';

export default class HowToStep3 extends React.Component {
  dispatchBtnAction(e) {
    this.props.callbackBtnClicked();
  }

  render() {
    return (
      <div className={"howToStep stepFundraise"}>

        <ScrollAnimation key={this.props.step} animateIn="fadeIn" animateOut="fadeOut" animateOnce={true} offset={50}>

        <div className="content">
          <div className="embelish left-background"></div>

          <div className="col col-left">
            <div className="image"><img className="animate animate-left" src="http://localhost:8000/static-assets/images/temp/step3.png" /></div>
          </div>
          <div className="col col-right">            
            <div className="text">
              <div className="animate animate-right">
                <h1>{this.props.title}</h1>
                <h2>{this.props.subtitle}</h2>
                {this.props.description}
                <div className="btn-cta">
                <button className="btn mr-btn btn-primary double" onClick={this.dispatchBtnAction.bind(this)}>
                <div>Sign up</div><div><i className="fa fa-arrow-right"></i></div>
                </button>
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
