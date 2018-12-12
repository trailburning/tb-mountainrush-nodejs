import React, { Component } from "react";
import { store } from "./store";
import './HowToGuide.css';
import HowToStep from "./HowToStep";

class HowToGuide extends Component {
  render() {
    return [
      <HowToStep key={1} step={1} title={store.getState().literals.welcome.title} description={store.getState().literals.welcome.description} />,
      <HowToStep key={2} step={2} title={store.getState().literals.welcome.title} description={store.getState().literals.welcome.description} />,
      <HowToStep key={3} step={3} title={store.getState().literals.welcome.title} description={store.getState().literals.welcome.description} />      
    ];
  }
}

export default HowToGuide;



