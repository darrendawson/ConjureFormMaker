import React, { Component } from 'react';
import './FormSidebar.css';

class FormSidebar extends Component {

  constructor() {
    super();
  }

  render() {

    if (this.props.selectedID === false) {
      return (
        <div id="FormSidebar">
          <div id="title_bar">
            <h1 className="title_bar_text">Form Output</h1>
          </div>
        </div>
      );
    } else {
      return (
        <div id="FormSidebar">
          <div id="title_bar">
            <h1 className="title_bar_text">Selected</h1>
            <h1 className="title_bar_text_clickable" onClick={this.props.onClick_deselectItem}>X</h1>
          </div>
          <h1>Selected: {this.props.selectedID}</h1>
        </div>
      );
    }

  }
}

export default FormSidebar;
