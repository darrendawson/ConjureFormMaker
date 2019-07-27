import React, { Component } from 'react';
import './ModifyFormContainer.css';

class ModifyFormContainer extends Component {

  constructor() {
    super();
  }


  // render --------------------------------------------------------------------

  renderActionsMenu = () => {
    return (
      <div id="actions_menu">
        <h3 className="actions_menu_clickable">&#9654;</h3>
      </div>
    );
  }


  render() {
    return (
      <div id="ModifyFormContainer" style={{'background-color': this.props.backgroundColor}}>

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
