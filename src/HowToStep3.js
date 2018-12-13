import React from "react";
import ScrollAnimation from 'react-animate-on-scroll';

export default class HowToStep3 extends React.Component {
  dispatchBtnAction(e) {
    this.props.callbackBtnClicked();
  }

  render() {
    return (
      <div className="howToStep">
        <div className="content">
          <div className="image">
          <ScrollAnimation key={this.props.step} animateIn="fadeIn" animateOut="fadeOut">
          <img src="https://www.mountainrush.co.uk/static-assets/images/wwf-uk/mobile_big.png" />
          </ScrollAnimation>
          </div>
          <div className="text">
            <h1>{this.props.title}</h1>
            <h2>{this.props.subtitle}</h2>
            {this.props.description}
            <div>
            <button className="btn mr-btn btn-primary double" onClick={this.dispatchBtnAction.bind(this)}>
            <div>Sign up</div><div><i className="fa fa-arrow-right"></i></div>
            </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
