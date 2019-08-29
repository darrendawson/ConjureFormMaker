import React, { Component } from 'react';
import './Navbar.css';

import MagicCircle from '../../Images/mc_icon/magic_circle.ico';

class Navbar extends Component {

  constructor() {
    super();
  }

  render() {
    let colors = this.props.colors;

    return (
      <div id="Navbar">
        <div className="navbar_group">
          <img id="conjure_icon" src={MagicCircle}/>
          <h1>Conjure</h1>
        </div>

      </div>
    );
  }
}

export default Navbar;
