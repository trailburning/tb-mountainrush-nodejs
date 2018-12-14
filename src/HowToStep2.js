import React from "react";
import ScrollAnimation from 'react-animate-on-scroll';

const HowToStep2 = (props) => {
  return (
    <div className={"howToStep stepActive"}>

      <ScrollAnimation key={props.step} animateIn="fadeIn" animateOut="fadeOut" animateOnce={true} offset={50}>

      <div className="content">
        <div className="embelish left-background"></div>

        <div className="col col-left">
          <div className="text">
            <div className="animate animate-left">
            <h1>{props.title}</h1>
            <h2>{props.subtitle}</h2>
            {props.description}
            </div>
          </div>
        </div>
        <div className="col col-right">
          <div className="image"><img className="animate animate-right" src="http://localhost:8000/static-assets/images/temp/step2.png" /></div>
        </div>
      </div>

      </ScrollAnimation>
    </div>
  );
};
export default HowToStep2;
