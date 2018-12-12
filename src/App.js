import React, { Component } from "react";
import { store } from "./store";
import HelloWorld from "./HelloWorld";
import ButtonGroup from "./ButtonGroup";

class App extends Component {
  render() {
    return [
      <HelloWorld key={1} tech={store.getState().tech} />,
      <ButtonGroup key={2} technologies={["React", "React-Redux"]} />
    ];
  }
}

export default App;



