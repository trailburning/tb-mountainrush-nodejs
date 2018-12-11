import React, { Component } from "react";
import HelloWorld from "./HelloWorld";

class App extends Component {
  render() {
    return [
      <HelloWorld key={1} tech={this.props.tech} />,
    ];
  }
}

export default App;



