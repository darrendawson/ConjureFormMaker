/*
  Gets used by <FormSidebar/> to modify the details of a ConjureFormItem object
*/

import React, { Component } from 'react';
import './FormInput.css';

import RenderFormOutputObject from './RenderFormOutputObject/RenderFormOutputObject.js';
import MultipleChoiceMaker from './MultipleChoiceMaker/MultipleChoiceMaker';

import ConjureFormConstants from '../ConjureFormConstants.js';
const __conjureConstants = new ConjureFormConstants();

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

  // same as this.onInput_updateItemDetail(), but with a direct value passed in (instead of an event)
  onClick_updateItemDetail = (detailType, detailValue) => {
    let updatedItemDetails = this.props.itemDetails;
    updatedItemDetails[detailType] = detailValue;
    this.props.onClick_updateFormSectionDetails(this.props.selectedID, updatedItemDetails);
  }

  onClick_convertQuestionType = (newQuestionType) => {
    let newItem = this.props.selectedSection;
    newItem.convertQuestionType(newQuestionType);
    this.props.onClick_updateWholeSection(newItem);
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


  // render Question -----------------------------------------------------------

  renderFormItemQuestion = () => {

    if (this.props.itemType !== "question") { return; }

    let questionTypeInput_CSS;
    let questionTypeMC_CSS;
    if (this.props.itemDetails.questionType === "input") {
      questionTypeInput_CSS = "button_selected";
      questionTypeMC_CSS = "button";
    } else if (this.props.itemDetails.questionType === "multipleChoice") {
      questionTypeInput_CSS = "button";
      questionTypeMC_CSS = "button_selected";
    }


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

        <div className="input_row">
          <h3 className="input_title">Question Type</h3>
          <button className={questionTypeInput_CSS} onClick={() => this.onClick_convertQuestionType("input")}>Input</button>
          <button className={questionTypeMC_CSS} onClick={() => this.onClick_convertQuestionType("multipleChoice")}>Multiple Choice</button>
        </div>

        {this.renderQuestionInput()}
        {this.renderQuestionMultipleChoice()}
      </div>
    );
  }


  // renders item details for when questionType = input
  renderQuestionInput = () => {
    if (this.props.itemDetails.questionType !== "input") { return; }

    let inputString_CSS = "button";
    let inputInt_CSS = "button";
    if (this.props.itemDetails.inputType === "string") {
      inputString_CSS = "button_selected";
    } else if (this.props.itemDetails.inputType === "number") {
      inputInt_CSS = "button_selected";
    }


    return (
      <div className="form_input_container">
        <div className="input_row">
          <h3 className="input_title">Input Type</h3>
          <button className={inputString_CSS} onClick={() => this.onClick_updateItemDetail("inputType", "string")}>string</button>
          <button className={inputInt_CSS} onClick={() => this.onClick_updateItemDetail("inputType", "number")}>number</button>
        </div>

        <div className="input_row">
          <h3 className="input_title">Default Value</h3>
          <input
            className="form_input"
            value={this.props.itemDetails.defaultValue}
            onChange={this.onInput_updateItemDetail.bind(this, "defaultValue")}
          />
        </div>
      </div>

    );
  }


  renderQuestionMultipleChoice = () => {
    if (this.props.itemDetails.questionType !== "multipleChoice") { return; }

    let mcStandard_CSS = "button";
    let mcDrop_CSS = "button";
    if (this.props.itemDetails.multipleChoiceType === "standard") {
      mcStandard_CSS = "button_selected";
    } else if (this.props.itemDetails.multipleChoiceType === "dropdown") {
      mcDrop_CSS = "button_selected";
    }

    return (
      <div className="form_input_container">

        <div className="input_row">
          <h3 className="input_title">MC Type</h3>
          <button className={mcStandard_CSS} onClick={() => this.onClick_updateItemDetail("multipleChoiceType", "standard")}>standard</button>
          <button className={mcDrop_CSS} onClick={() => this.onClick_updateItemDetail("multipleChoiceType", "dropdown")}>drop down</button>
        </div>

        <div className="input_row">
          <h3 className="input_title">Min Selected</h3>
          <input
            className="form_input"
            value={this.props.itemDetails.minSelected}
            onChange={this.onInput_updateItemDetail.bind(this, "minSelected")}
          />
        </div>

        <div className="input_row">
          <h3 className="input_title">Max Selected</h3>
          <input
            className="form_input"
            value={this.props.itemDetails.maxSelected}
            onChange={this.onInput_updateItemDetail.bind(this, "maxSelected")}
          />
        </div>

        <div className="input_row">
          <MultipleChoiceMaker
            choices={this.props.itemDetails.choices}
            onClick_updateItemDetail={this.onClick_updateItemDetail}
          />
        </div>
      </div>

    );
  }


  // render form output --------------------------------------------------------

  // function that determines whether a given formID is in the form output object
  checkIfFormIDInOutput = (formID = this.props.selectedID, formOutputObject) => {

    for (let key in formOutputObject) {

      if (key === formID) {
        return true;
      } else {

        if (typeof formOutputObject === "object") {
          let childResult = this.checkIfFormIDInOutput(formID, formOutputObject[key]);
          if (childResult === true) {
            return true;
          }
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


  // render --------------------------------------------------------------------


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
