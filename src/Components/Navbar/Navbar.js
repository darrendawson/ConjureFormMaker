import React, { Component } from 'react';
import './Navbar.css';

class Navbar extends Component {

  constructor() {
    super();
  }

  render() {
    let colors = this.props.colors;

    return (
      <div id="Navbar" style={colors.getColor1('background-color', 3)}>
        <h1 style={colors.getColor1('color', 'text-bright')}>Conjure</h1>
      </div>
    );
  }
}

export default Navbar;
