import React from "react";
import ScrollAnimation from 'react-animate-on-scroll';

const HowToStep = (props) => {
  return (
    <div className="howToStep">
      <h1>{props.title}</h1>
      <h2>{props.description}</h2>

      <ScrollAnimation key={props.step} animateIn="fadeIn" animateOut="fadeOut">

      <img height="380" src="https://www.mountainrush.co.uk/static-assets/images/wwf-uk/mobile_big.png" />

      </ScrollAnimation>

    </div>
  );
};

export default HowToStep;
