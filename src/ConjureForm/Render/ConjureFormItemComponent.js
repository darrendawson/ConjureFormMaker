import React, { Component } from 'react';
import './ConjureFormComponent.css';

class ConjureFormItemComponent extends Component {

  constructor() {
    super();
  }

  // onClick -------------------------------------------------------------------

  // this function acts as an intermediary to prevent cascading onClicks
  onClick_selectItem = (e) => {
    e.stopPropagation();
    this.props.onClick_selectItem(this.props.itemID);
  }

  // render --------------------------------------------------------------------

  render() {
    return (
      <div id="ConjureFormItemComponent" onClick={this.onClick_selectItem}>
        <p>ITEM: {this.props.itemID}</p>
      </div>
    );
  }
}

export default ConjureFormItemComponent;
