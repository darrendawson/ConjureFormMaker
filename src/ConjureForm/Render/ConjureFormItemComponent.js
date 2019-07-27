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

    // determine border styling
    let borderCSS = "dev_mode_hover";
    if (this.props.selected) {
      borderCSS = "dev_mode_selected";
    }

    return (
      <div
        id="ConjureFormItemComponent"
        className={borderCSS}
        onClick={this.onClick_selectItem}>
        <p>ITEM: {this.props.itemID}</p>
      </div>
    );
  }
}

export default ConjureFormItemComponent;
