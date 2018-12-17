import React from "react";
import ScrollAnimation from 'react-animate-on-scroll';

const HowToStep2 = (props) => {
  return (
    <div className={"howToStep stepActive"}>

      <ScrollAnimation key={props.step} animateIn="fadeIn" animateOut="fadeOut" animateOnce={true} offset={50}>

      <div className="content">
        <div className="embelish left-background"></div>

        <div className="visible-xs">
          <div className="col col-left">
            <div className="image"><img className="animate" src="http://staging.mountainrush.co.uk/static-assets/images/temp/step2.png" /></div>
          </div>
          <div className="col col-right">
            <div className="text">
              <div className="animate">
              <h1>{props.stepContent.title}</h1>
              <h2>{props.stepContent.subtitle}</h2>
              {props.stepContent.description.replace('%s', props.defContent.strava_app)}
              </div>
            </div>
          </div>
        </div>

        <div className="hidden-xs">
          <div className="col col-left">
            <div className="text">
              <div className="animate">
              <h1>{props.stepContent.title}</h1>
              <h2>{props.stepContent.subtitle}</h2>
              {props.stepContent.description.replace('%s', props.defContent.strava_app)}
              </div>
            </div>
          </div>
          <div className="col col-right">
            <div className="image"><img className="animate" src="http://staging.mountainrush.co.uk/static-assets/images/temp/step2.png" /></div>
          </div>
        </div>

      </div>

      </ScrollAnimation>
    </div>
  );
};
export default HowToStep2;
