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


  onClick_saveFormExportToClipboard = (e) => {
    e.stopPropagation();
    let conjureJSON = this.props.conjureForm.export();
    navigator.clipboard.writeText(conjureJSON);
  }

  // render --------------------------------------------------------------------


  renderActionsMenu = () => {
    return (
      <div id="actions_menu_row">
        {this.renderActionsMenu_ExportButton()}
        {this.renderActionsMenu_RunButton()}
      </div>
    );
  }

  renderActionsMenu_RunButton = () => {
    return (
      <div id="actions_menu" onClick={this.onClick_runProductionForm}>
        <h3 className="actions_menu_clickable">&#9654;</h3>
      </div>
    );
  }

  renderActionsMenu_ExportButton = () => {
    return (
      <div id="actions_menu" onClick={this.onClick_saveFormExportToClipboard}>
        <h3 className="actions_menu_clickable">&#128427;</h3>
      </div>
    );
  }


  // render ConjureForm --------------------------------------------------------


  renderConjureForm = () => {

    let conjureForm = this.props.conjureForm;
    let formOutput = this.props.formOutput;
    let selectForm = this.props.onClick_selectFormSection;
    let devModeOn = this.props.devModeOn;
    let selectedID = this.props.selectedID;

    // because <ModifyFormContainer/> is for developing the form, it isn't hooked up to a live function for answering the questions
    // these are initialized as empty variables/functions here in order to prevent there being a desync in ConjureForm.render()
    //  - between <ModifyFormContainer/> and <ProductionFormContainer/>
    //  - render technically works without these being passed into ConjureForm.render(),
    //      but it might be confusing when adding functionality in the future if the render functions are different
    let onInput_answerFormQuestion = () => {};
    let answerMC = () => {};
    let addNewSubformToArray = () => {};
    let removeSubform = () => {};
    let conditionalRenderLookup = {};
    let moveToPage = () => {};

    return conjureForm.render(formOutput, selectForm, devModeOn, selectedID, onInput_answerFormQuestion, answerMC, addNewSubformToArray, {}, -1, removeSubform, conditionalRenderLookup, moveToPage);
  }

  // render <ModifyFormContainer/> ---------------------------------------------

  render() {
    return (
      <div id="ModifyFormContainer" onClick={this.props.onClick_deselectItem} style={{'background-color': this.props.backgroundColor}}>

        {this.renderActionsMenu()}

        <div id="form_container">
          {this.renderConjureForm()}
        </div>
      </div>
    );
  }
}

export default ModifyFormContainer;
