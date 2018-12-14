import React from "react";
import ScrollAnimation from 'react-animate-on-scroll';

const HowToStep1 = (props) => {
  return (
    <div className={"howToStep stepChallenge"}>

      <ScrollAnimation key={props.step} animateIn="fadeIn" animateOut="fadeOut" animateOnce={true} delay={500} offset={0}>

      <div className="content">
        <div className="embelish left-background"></div>

        <div className="col col-left">
          <div className="image"><img className="animate animate-left" src="http://localhost:8000/static-assets/images/temp/step1.png" /></div>
        </div>
        <div className="col col-right">
          <div className="text">
            <div className="animate animate-right">
            <h1>{props.title}</h1>
            <h2>{props.subtitle}</h2>
            {props.description}
            </div>
          </div>
        </div>

        <div className="embelish left-foreground"></div>
      </div>

      </ScrollAnimation>

    </div>
  );
};
export default HowToStep1;
