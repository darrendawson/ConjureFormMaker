import React, { Component } from 'react';
import './ConjureFormComponent.css';

class ConjureFormItemComponent extends Component {

  constructor() {
    super();
  }

  render() {
    return (
      <div id="ConjureFormItemComponent">
        <p>ITEM: {this.props.itemID}</p>
      </div>
    );
  }
}

export default ConjureFormItemComponent;
