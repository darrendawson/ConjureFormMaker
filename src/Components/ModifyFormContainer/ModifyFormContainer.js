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

    let conjureForm = this.props.conjureForm;
    let formOutput = this.props.formOutput;
    let selectForm = this.props.onClick_selectFormSection;
    let devModeOn = this.props.devModeOn;
    let selectedID = this.props.selectedID;
    let onInput_answerFormQuestion = () => {}; // because <ModifyFormContainer/> is for developing the form, it isn't hooked up to a live function for answering the questions

    return (
      <div id="ModifyFormContainer" onClick={this.props.onClick_deselectItem} style={{'background-color': this.props.backgroundColor}}>

        <div id="actions_menu_row">
          {this.renderActionsMenu()}
        </div>

        <div id="form_container">
          {conjureForm.render(formOutput, selectForm, devModeOn, selectedID, onInput_answerFormQuestion)}
        </div>
      </div>
    );
  }
}

export default ModifyFormContainer;
