import React, { Component } from "react";
import { store } from "./store";
import './HowToGuide.css';
import HelloWorld from "./HelloWorld";
import ButtonGroup from "./ButtonGroup";
import HowToStep from "./HowToStep";

class HowToGuide extends Component {
  render() {
    return [
      <HelloWorld key={1} tech={store.getState().tech} />,
      <ButtonGroup key={2} technologies={["React", "React-Redux"]} />,      
      <HowToStep key={3} step={1} title={'Step 1'} description={'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus at massa nisi. Maecenas scelerisque commodo pretium. Integer dapibus massa ut lacus elementum tristique.'} />,
      <HowToStep key={4} step={2} title={'Step 2'} description={'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus at massa nisi. Maecenas scelerisque commodo pretium. Integer dapibus massa ut lacus elementum tristique.'}/>,
      <HowToStep key={5} step={3} title={'Step 3'} description={'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus at massa nisi. Maecenas scelerisque commodo pretium. Integer dapibus massa ut lacus elementum tristique.'} />      
    ];
  }
}

export default HowToGuide;



