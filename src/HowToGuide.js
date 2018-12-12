import React, { Component } from "react";
import { store } from "./store";
import './static-assets/css/HowToGuide.css';
import HowToStep from "./HowToStep";

class HowToGuide extends Component {
  render() {
    return [
      <HowToStep key={1} step={1} title={store.getState().literals.how_to_guide.step1.title} description={store.getState().literals.how_to_guide.step1.description} />,
      <HowToStep key={2} step={2} title={store.getState().literals.how_to_guide.step2.title} description={store.getState().literals.how_to_guide.step2.description} />,
      <HowToStep key={3} step={3} title={store.getState().literals.how_to_guide.step3.title} description={store.getState().literals.how_to_guide.step3.description} />
    ];
  }
}

export default HowToGuide;



