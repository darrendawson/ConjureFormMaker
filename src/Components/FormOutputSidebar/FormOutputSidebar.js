import React, { Component } from 'react';
import './FormOutputSidebar.css';

class FormOutputSidebar extends Component {

  constructor() {
    super();
  }

  render() {
    let colors = this.props.colors;

    return (
      <div id="FormOutputSidebar" style={colors.getColor1('background-color', 2)}>
        <div id="sidebar_section" style={colors.getColor1("background-color", 1)}>
          <h1 className="h1" style={colors.getColor1('color', 'text-bright')}>Form Output</h1>
          <p className="p" style={colors.getColor1('color', 'text-bright')}>Filling out the form will result in a JSON object of this structure</p>
        </div>

        <div id="sidebar_section">
          <p style={colors.getColor1('color', 'text-bright')}>{"{}"}</p>
        </div>
      </div>
    );
  }
}

export default FormOutputSidebar;
