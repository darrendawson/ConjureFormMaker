import React, { Component } from 'react';
import './ModifyFormContainer.css';

class ModifyFormContainer extends Component {

  constructor() {
    super();

    this.inputFileRef = React.createRef();
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


  onClick_openFileBrowser = () => {
    this.inputFileRef.current.click();
  };

  onChange_handleNewFile = () => {
    let fileList = this.inputFileRef.current.files;
    if (fileList.length > 0) {
      let file = fileList[0];
      let blob = file.slice();
      this.convertFileToJS(blob);
    }
  }

  async convertFileToJS(blob) {
    let text = await new Response(blob).text()
    let obj = JSON.parse(text);
    this.props.onClick_loadConjureForm(obj);
  }

  // render --------------------------------------------------------------------


  renderActionsMenu = () => {
    return (
      <div id="actions_menu_row">
        {this.renderActionsMenu_ImportButton()}
        {this.renderActionsMenu_ExportButton()}
        {this.renderActionsMenu_RunButton()}
      </div>
    );
  }

  renderActionsMenu_RunButton = () => {
    return (
      <div id="actions_menu" title="Run" onClick={this.onClick_runProductionForm}>
        <h3 className="actions_menu_clickable">&#9654;</h3>
      </div>
    );
  }

  renderActionsMenu_ExportButton = () => {
    return (
      <div id="actions_menu" title="Copy Form to Clipboard" onClick={this.onClick_saveFormExportToClipboard}>
        <h3 className="actions_menu_clickable">&#128427;</h3>
      </div>
    );
  }

  renderActionsMenu_ImportButton = () => {
    return (
      <div>
        <input type='file' id='file' onChange={this.onChange_handleNewFile} ref={this.inputFileRef} style={{display: 'none'}}/>
        <div id="actions_menu" title="Import Form" onClick={this.onClick_openFileBrowser}>
          <h3 className="actions_menu_clickable">&#x2191;</h3>
        </div>
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
