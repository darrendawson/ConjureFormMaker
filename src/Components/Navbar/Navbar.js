import React, { Component } from 'react';
import './Navbar.css';

class Navbar extends Component {

  constructor() {
    super();
  }

  render() {
    let colors = this.props.colors;

    return (
      <div id="Navbar">
        <h1>Conjure</h1>
      </div>
    );
  }
}

export default Navbar;
