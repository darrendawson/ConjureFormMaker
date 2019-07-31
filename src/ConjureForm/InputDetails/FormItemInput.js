/*
  Gets used by <FormSidebar/> to modify the details of a ConjureFormItem object
*/

import React, { Component } from 'react';
import './FormInput.css';

import RenderFormOutputObject from './RenderFormOutputObject/RenderFormOutputObject.js';

class FormItemInput extends Component {

  constructor() {
    super();
  }


  // onInput -------------------------------------------------------------------

  // when a user types into an <input/> that would modify a ConjureFormItem.itemDefinition parameter,
  // this function makes that update happen
  onInput_updateItemDetail = (detailType, e) => {
    let updatedItemDetails = this.props.itemDetails;
    updatedItemDetails[detailType] = e.target.value;
    this.props.onClick_updateFormSectionDetails(this.props.selectedID, updatedItemDetails);
  }


  // render --------------------------------------------------------------------

  // renders <input/>s for a ConjureFormItem.text type
  // - sectionTitleText
  // - titleText
  // - descriptionText
  renderFormItemText = () => {
    if (this.props.itemType === "text") {
      return (
        <div className="form_input_container">

          <h1 className="section_title">Text Details</h1>

          <div className="input_row">
            <h3 className="input_title">Section Title</h3>
            <input
              className="form_input"
              value={this.props.itemDetails.sectionTitleText}
              onChange={this.onInput_updateItemDetail.bind(this, "sectionTitleText")}
            />
          </div>

          <div className="input_row">
            <h3 className="input_title">Title</h3>
            <input
              className="form_input"
              value={this.props.itemDetails.titleText}
              onChange={this.onInput_updateItemDetail.bind(this, "titleText")}
            />
          </div>

          <div className="input_row">
            <h3 className="input_title">Description</h3>
            <input
              className="form_input"
              value={this.props.itemDetails.descriptionText}
              onChange={this.onInput_updateItemDetail.bind(this, "descriptionText")}
            />
          </div>
        </div>
      );
    }
  }


  renderFormItemQuestion = () => {
    if (this.props.itemType === "question") {
      return (
        <div className="form_input_container">

          <h1 className="section_title">Question Details</h1>
          <div className="input_row">
            <h3 className="input_title">Question Title</h3>
            <input
              className="form_input"
              value={this.props.itemDetails.questionTitle}
              onChange={this.onInput_updateItemDetail.bind(this, "questionTitle")}
            />
          </div>

          <div className="input_row">
            <h3 className="input_title">Description</h3>
            <input
              className="form_input"
              value={this.props.itemDetails.questionDescription}
              onChange={this.onInput_updateItemDetail.bind(this, "questionDescription")}
            />
          </div>
        </div>
      );
    }
  }



  // function that determines whether a given formID is in the form output object
  checkIfFormIDInOutput = (formID = this.props.selectedID, formOutputObject = this.props.formOutputObject) => {
    for (let key in formOutputObject) {
      if (key === formID) {
        return true;
      } else {
        let childResult = this.checkIfFormIDInOutput(formID, formOutputObject[key]);
        if (childResult === true) {
          return true;
        }
      }
    }
    return false;
  }

  renderFormOutputDetails = () => {

    // don't render Output details if the currently selected form isn't in output
    // ex: a selected ConjureFormItem with type text is not in output
    if (this.checkIfFormIDInOutput(this.props.selectedID, this.props.formOutputObject) === false) {
      return;
    }

    return (
      <div className="form_input_container">
        <h1 className="section_title">Output Object</h1>


        <div className="input_row">
          <h3 className="input_title">Key</h3>
          <input
            className="form_input"
            value={this.props.itemDetails.outputID}
            onChange={this.onInput_updateItemDetail.bind(this, "outputID")}
          />
        </div>


        <div className="input_row">
          <RenderFormOutputObject
            selectedID={this.props.selectedID}
            formOutputObject={this.props.formOutputObject}
            formDetailsLookup={this.props.formDetailsLookup}
            onClick_selectFormSection={this.props.onClick_selectFormSection}
          />
        </div>

      </div>
    );
  }

  render() {
    return (
      <div id="FormItemInput">
        {this.renderFormOutputDetails()}
        {this.renderFormItemText()}
        {this.renderFormItemQuestion()}
      </div>
    );
  }
}

export default FormItemInput;
