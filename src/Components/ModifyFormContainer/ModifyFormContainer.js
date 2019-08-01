import React, { Component } from 'react';
import './ModifyFormContainer.css';

class ModifyFormContainer extends Component {

  constructor() {
    super();
  }

  // onClick -------------------------------------------------------------------

  onClick_runProductionForm = (e) => {
    e.stopPropagation();
    this.props.onClick_setDevModeActive(false);
  }

  // render --------------------------------------------------------------------

  renderActionsMenu = () => {
    return (
      <div id="actions_menu" onClick={this.onClick_runProductionForm}>
        <h3 className="actions_menu_clickable">&#9654;</h3>
      </div>
    );
  }


  render() {
    return (
      <div id="ModifyFormContainer" onClick={this.props.onClick_deselectItem} style={{'background-color': this.props.backgroundColor}}>

        <div id="actions_menu_row">
          {this.renderActionsMenu()}
        </div>

        <div id="form_container">
          {this.props.conjureForm.render()}
        </div>
      </div>
    );
  }
}

export default ModifyFormContainer;
