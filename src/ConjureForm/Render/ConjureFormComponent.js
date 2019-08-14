import React, { Component } from 'react';
import './ConjureFormComponent.css';

class ConjureFormComponent extends Component {

  constructor() {
    super();
  }


  getID = () => {
    if (this.props.formID in this.props.idConversionTable) {
      return this.props.idConversionTable[this.props.formID];
    }
    return this.props.formID;
  }

  // onClick -------------------------------------------------------------------

  // this function acts as an intermediary to this.props.onClick_selectForm
  // this prevents cascading onClicks when the user clicks a nested <ConjureFormComponent/>
  onClick_selectForm = (e) => {
    e.stopPropagation();
    this.props.onClick_selectForm(this.getID());
  }


  // render --------------------------------------------------------------------


  // returns the correct CSS class name tags for the container
  getContainerCSS = (containerType) => {

    if (containerType === "page") {
      return "container_type_page";
    } else if (containerType === "card") {
      return "container_type_card";
    } else {
      return "";
    }
  }

  // box-shadow and backgroundColor are dynamically inserted using html style
  getContainerStyling = (containerType) => {

    let style = {'background-color': this.props.backgroundColor};
    if (containerType === "card") {
      style['box-shadow'] = "5px 10px 15px " + this.props.shadowColor + "";
    }
    return style;
  }


  // if this form doesn't have any children, render an empty div instead to make the object large enough to click
  renderEmptySpace = () => {
    if (Object.keys(this.props.subforms).length === 0 && Object.keys(this.props.items).length === 0) {
      return (
        <div id="empty_space"></div>
      );
    }
  }


  // if a ConjureForm is actually supposed to be an array of other ConjureForms, then we want to render an "add new" button
  // that the user can click to create a new subform in the array
  renderAddNewButton = () => {
    if (this.props.formDetails.maxForms > 1) {
      let formOutputObject = this.props.formOutput.get(this.getID());
      if (
        (Array.isArray(formOutputObject) && formOutputObject.length === 1) ||
        (this.props.lastInArray && this.props.formDetails.maxForms > formOutputObject.length)
      ) {
        return (
          <div id="new_array_subform_button_container">
            <button
              id="new_array_subform_button"
              style={{'background-color': this.props.titleColor, 'color': this.props.backgroundColor}}
              onClick={() => this.props.onClick_addNewSubformToArray(this.getID())}>
              {this.props.formDetails.newSubformButtonText}
            </button>
          </div>
        );
      }
    }
  }

  // render <ConjureFormComponent/>
  // - because ConjureForm can have ConjureForms and ConjureFormItems as children,
  //      we need to call their render functions as well:
  //      <ConjureForm
  //        {children}
  //      />
  //
  // - objects in this.props.subforms and this.props.items are ConjureForm and ConjureFormItem classes
  //      they ARE NOT <ConjureFormComponent/> or <ConjureFormItemComponent/>
  render() {

    let childrenToRender = [];

    // for each child, call their render function
    for (let i = 0; i < this.props.order.length; i++) {


      // get full child object from this.subforms or this.items
      let childID = this.props.order[i]["id"];
      let child;
      if (this.props.order[i]["type"] === "ConjureForm") {
        child = this.props.subforms[childID];
      } else if (this.props.order[i]["type"] === "ConjureFormItem"){
        child = this.props.items[childID];
      }

      let childOutput = this.props.formOutput.get(childID);


      // handle case that child is an array of subforms AND has multiple forms active in output
      if (this.props.order[i]["type"] === "ConjureForm" &&
          child.formDetails.maxForms > 1 &&
          childOutput !== false &&
          Array.isArray(childOutput) &&
          childOutput.length > 1
        ) {

        // iterate over the output and add items for each
        for (let i = 0; i < childOutput.length; i++) {

          let formOutput = this.props.formOutput;
          let idConversionTable = formOutput.getIDConversionTable(childOutput[i]);
          let selectForm = this.props.onClick_selectForm;
          let devModeOn = this.props.devModeOn;
          let answerInput = this.props.onInput_answerFormQuestion;
          let answerMC = this.props.onClick_answerMultipleChoiceQuestion;
          let addNewSubformToArray = this.props.onClick_addNewSubformToArray;
          let lastInArray = (i + 1 === childOutput.length) ? true : false;
          let rendered = child.render(formOutput, selectForm, devModeOn, this.props.selectedID, answerInput, answerMC, addNewSubformToArray, idConversionTable, lastInArray);
          childrenToRender.push(rendered);
        }

      // otherwise, just render the child normally
      } else {
        let formOutput = this.props.formOutput;
        let idConversionTable = this.props.idConversionTable;
        let selectForm = this.props.onClick_selectForm;
        let devModeOn = this.props.devModeOn;
        let answerInput = this.props.onInput_answerFormQuestion;
        let answerMC = this.props.onClick_answerMultipleChoiceQuestion;
        let addNewSubformToArray = this.props.onClick_addNewSubformToArray;
        let rendered = child.render(formOutput, selectForm, devModeOn, this.props.selectedID, answerInput, answerMC, addNewSubformToArray, idConversionTable, false);
        childrenToRender.push(rendered);
      }
    }


    // determine border styling
    let borderCSS;
    if (this.props.devModeOn) {
      if (this.props.selectedID === this.getID()) {
        borderCSS = "dev_mode_selected";
      } else {
        borderCSS = "dev_mode_hover";
      }
    } else {
      borderCSS = "dev_mode_off_border";
    }


    return (
      <div
        id="ConjureFormComponent"
        className={borderCSS}
        onClick={this.onClick_selectForm}>
        <div
          className={this.getContainerCSS(this.props.containerType)}
          style={this.getContainerStyling(this.props.containerType)}>
          {childrenToRender}
          {this.renderEmptySpace()}
        </div>
        {this.renderAddNewButton()}

      </div>
    );
  }
}

export default ConjureFormComponent;
