import React from "react";
import ScrollAnimation from 'react-animate-on-scroll';

const HowToStep = (props) => {
  return (
    <div className="howToStep">
      <div className="content">
        <div className="text">
        <h1>{props.title}</h1>
        <h2>{props.subtitle}</h2>
        {props.description}
        </div>
        <div className="image">
        <ScrollAnimation key={props.step} animateIn="fadeIn" animateOut="fadeOut">
        <img src="https://www.mountainrush.co.uk/static-assets/images/wwf-uk/mobile_big.png" />
        </ScrollAnimation>
        </div>
      </div>
    </div>
  );
};

export default HowToStep;
