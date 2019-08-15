/*
  Gets used by <FormSidebar/> to modify the details of a ConjureFormItem object
*/

import React, { Component } from 'react';
import './DevFormInput.css';

import MultipleChoiceMaker from './MultipleChoiceMaker/MultipleChoiceMaker.js';
import ConditionalMaker from './ConditionalMaker/ConditionalMaker.js';

import ConjureFormConstants from '../ConjureFormConstants.js';
const __conjureConstants = new ConjureFormConstants();

class DevFormItemInput extends Component {

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

        <div className="input_row">
          <h3 className="input_title">Input Prompt</h3>
          <input
            className="form_input"
            value={this.props.itemDetails.inputPrompt}
            onChange={this.onInput_updateItemDetail.bind(this, "inputPrompt")}
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
            value={(this.props.itemDetails.multipleChoiceType === "dropdown") ? 1 : this.props.itemDetails.maxSelected}
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



  renderFormOutputDetails = () => {

    let formOutput = this.props.formOutput;

    // don't render Output details if the currently selected form isn't in output
    // ex: a selected ConjureFormItem with type text is not in output
    if (formOutput.checkIfIDInOutput(this.props.selectedID) === false) {
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
          {formOutput.render(this.props.selectedID, true, this.props.onClick_selectFormSection)}
        </div>

      </div>
    );
  }


  // render conditionals -------------------------------------------------------
  /*
    Conditional render is a section for specifying when a ConjureForm/ConjureFormItem should be rendered
    For example:
      - User is filling out a ConjureForm for creating sql
      - User is adding columns to a table
      - if a user specifies the column type as being a VARCHAR, it'll render additional questions like LENGTH
      - if a user specifies the column type as being a DOUBLE, it'll render additional questions like number of digits
      - These conditionals allow this type of functionality
  */

  renderConditionals = () => {

    let alwaysButton_CSS = "button_selected";
    let conditionallyButton_CSS = "button";
    if (this.props.itemDetails.renderConditionally) {
      alwaysButton_CSS = "button";
      conditionallyButton_CSS = "button_selected";
    }

    return (
      <div className="form_input_container">
        <h1 className="section_title">Conditional Render</h1>

        <div className="input_row">
          <h3 className="input_title">When to Render</h3>
          <button className={alwaysButton_CSS} onClick={() => this.onClick_updateItemDetail("renderConditionally", false)}>Always</button>
          <button className={conditionallyButton_CSS} onClick={() => this.onClick_updateItemDetail("renderConditionally", true)}>Conditionally</button>
        </div>

        {this.renderConditionalMaker()}
      </div>
    );
  }

  renderConditionalMaker = () => {
    if (this.props.itemDetails.renderConditionally) {

      let outputObject = this.props.formOutput.getOutputObject();
      let detailsLookup = this.props.formOutput.getDetailsLookup();

      // get the IDs for all multiple choice questions
      let mc_IDs = [];
      let nonMC_IDs = [];
      for (let key in detailsLookup) {
        if (('questionType' in detailsLookup[key]) && (detailsLookup[key]['questionType'] === 'multipleChoice')) {
          mc_IDs.push(key);
        } else {
          nonMC_IDs.push(key);
        }
      }

      return (
        <div className="input_row">
          <ConditionalMaker
            selectedID={this.props.selectedID}
            condition={this.props.itemDetails.renderCondition}
            formOutputObject={outputObject}
            formDetailsLookup={detailsLookup}
            bannedIDs={nonMC_IDs}
            onClick_selectFormSection={() => alert('test')}
          />
        </div>

      );
    }
  }


  // render --------------------------------------------------------------------


  render() {
    return (
      <div id="DevFormItemInput">
        {this.renderFormOutputDetails()}
        {this.renderFormItemText()}
        {this.renderFormItemQuestion()}
        {this.renderConditionals()}
      </div>
    );
  }
}

export default DevFormItemInput;
