/*
  ConjureFormItem is a datastructure for representing individual form items (like questions or titles) on a Conjure Form
    - acts as a child for the ConjureForm datastructure
    - uses <ConjureFormItemComponent/> to render
*/

import React from 'react';
import ConjureFormItemComponent from './Render/ConjureFormItemComponent.js';

const __questionTypes = ["input", "multipleChoice", "code"];

const __textColorDefault = "#2F2F2F";
const __titleColorDefault = "#2F2F2F";
const __backgroundColorDefault = "#EDEDED";


/*
DO NOT UNCOMMENT OR USE THESE:
  - these are the default attributes you want to use, but defining them at the top here creates
    problematic JS object referencing. If you do, all ConjureFormItems will accidentally reference the same object in memory

const __defaultQuestionInputDetails = {
  "questionTitle": "Question Title",
  "questionDescription": "Description",
  "questionType": "input",
  "inputType": "string",
  "inputPrompt": "prompt...",
  "defaultValue": ""
};

const __defaultQuestionMultipleChoiceDetails = {
  "questionTitle": "Question Title",
  "questionDescription": "Description",
  "questionType": "multipleChoice",
  "multipleChoiceType": "standard",
  "minSelected": 0,
  "maxSelected": 1,
  "choices": []
};
*/


class ConjureFormItem {

  constructor(itemID, itemType = "text") {
    this.itemID = itemID;

    this.itemType = itemType;
    if (itemType === "text") {
      this.textDetails = {};
      this.textDetails.descriptionText = "Description";
      this.textDetails.titleText = "Title";
      this.textDetails.sectionTitleText = "Section Title";
      this.textDetails.outputID = itemID;
      this.textDetails.renderConditionally = false;
      this.textDetails.renderCondition = {'questionID': false, 'questionValue': false};
    } else if (itemType === "question"){
      this.questionDetails = {
        "questionTitle": "Question Title",
        "questionDescription": "Description",
        "questionType": "input",
        "inputType": "string",
        "inputPrompt": "prompt...",
        "defaultValue": "",
        "outputID": itemID,
        "renderConditionally": false,
        "renderCondition": {'questionID': false, 'questionValue': false}
      };
    }

    // default appearance
    this.appearance = {};

    // set default padding levels
    if (itemType === "text") {
      this.appearance['paddingTop'] = '10';
      this.appearance['paddingBottom'] = '10';
      this.appearance['paddingSides'] = '10';
      this.appearance['paddingBelowSectionTitle'] = '2';
      this.appearance['paddingBelowRegularTitle'] = '2';
    } else if (itemType === "question") {
      this.appearance['paddingTop'] = '10';
      this.appearance['paddingBottom'] = '10';
      this.appearance['paddingSides'] = '10';
      this.appearance['paddingBelowTitle'] = '2';
      this.appearance['paddingBelowDescription'] = '2';
    }


    // set default colors
    if (itemType === "text") {
      this.appearance['colorSectionTitleText'] = '#F6F6F6';
      this.appearance['colorSectionTitleBackground'] = '#2F2F2F';
      this.appearance['colorTitleText'] = '#2F2F2F';
      this.appearance['colorDescriptionText'] = '#2F2F2F';
    }  else if (itemType === "question") {
      this.appearance['colorTitleText'] = '#2F2F2F';
      this.appearance['colorDescriptionText'] = '#2F2F2F';
      this.appearance['colorSelectedOption'] = '#2F2F2F';
      this.appearance['colorInputBackground'] = '#FFFFFF';
      this.appearance['colorInputText'] = '#2F2F2F';
      this.appearance['colorInputBorder'] = '#FFFFFF';
    }

    // set default font size
    this.appearance['fontSizeSectionTitle'] = '2.5';
    this.appearance['fontSizeTitle'] = '2.0';
    this.appearance['fontSizeDescription'] = '1.2';

    // assign formStyles
    this.appearance['styleID'] = '';
  }


  getConjureID() {
    return this.itemID;
  }

  getClassName() {
    return "ConjureFormItem";
  }

  getItemDetails() {
    if (this.itemType === "text") {
      return this.textDetails;
    } else if (this.itemType === "question") {
      return this.questionDetails;
    }
  }


  getDefaultOutputObject() {
    if (this.itemType === "question") {
      if (this.questionDetails.questionType === "input") {
        if (this.questionDetails.inputType === "number") {
          if (typeof(this.questionDetails.defaultValue) === "number") {
            return this.questionDetails.defaultValue;
          } else if (parseFloat(this.questionDetails.defaultValue)){
            return parseFloat(this.questionDetails.defaultValue);
          } else {
            return 0;
          }
        }
        return this.questionDetails.defaultValue;
      } else if (this.questionDetails.questionType === "multipleChoice") {
        if (this.questionDetails.minSelected == 1 && this.questionDetails.choices.length > 0) {
          return [this.questionDetails.choices[0]];
        } else {
          return [];
        }
      }
    } else {
      return false;
    }
  }


  // Update --------------------------------------------------------------------

  updateItemDetails = (newDetails) => {

    let updatedDetails = this.getItemDetails();

    // overwrite the values that are described in newDetails
    for (let key in newDetails) {
      updatedDetails[key] = newDetails[key];
    }

    // save
    if (this.itemType === "text") {
      this.textDetails = updatedDetails;
    } else if (this.itemType === "question") {
      this.questionDetails = updatedDetails;
    }
  }

  updateItemAppearances = (newAppearances) => {
    for (let key in newAppearances) {
      this.appearance[key] = newAppearances[key];
    }
  }

  // if this ConjureFormItem relies on a style that is being changed, update it
  // this will update all conjureformitem.appearance values that are shared with the updated style
  updateFormStyles = (styleID, styleObject) => {

    if (styleID === '') { return; } // don't update if the styleID is empty

    if (this.appearance.styleID === styleID) {
      for (let key in styleObject) {
        this.appearance[key] = styleObject[key];
      }
    }
  }


  // Delete --------------------------------------------------------------------

  // used to delete conditional references to certain IDs.
  // useful for cleaning up dangling references when a user deletes a question
  __deleteConditionalReferences(deletedID) {
    if (this.itemType === "text") {
      if (this.textDetails.renderCondition.questionID === deletedID) {
        this.textDetails.renderConditionally = false;
        this.textDetails.renderCondition.questionID = false;
        this.textDetails.renderCondition.questionValue = false;
      }
    } else if (this.itemType === "question") {
      if (this.questionDetails.renderCondition.questionID === deletedID) {
        this.questionDetails.renderConditionally = false;
        this.questionDetails.renderCondition.questionID = false;
        this.questionDetails.renderCondition.questionValue = false;
      }
    }
  }


  // Convert -------------------------------------------------------------------

  convertQuestionType(newQuestionType) {

    // if no action needs to be taken, return
    if (this.itemType !== "question") { return; }
    if (this.questionDetails.questionType === newQuestionType) { return; }

    // mark the new questionType
    this.questionDetails.questionType = newQuestionType;

    // make changes to remove any leftover values from previous questionType
    // and initialize the new question type
    if (newQuestionType === "input") {
      delete this.questionDetails.multipleChoiceType;
      delete this.questionDetails.minSelected;
      delete this.questionDetails.maxSelected;
      delete this.questionDetails.choices;

      this.questionDetails["inputType"] = "string";
      this.questionDetails["inputPrompt"] = "prompt...";
      this.questionDetails["defaultValue"] = "";

    } else if (newQuestionType === "multipleChoice") {

      delete this.questionDetails.inputType;
      delete this.questionDetails.inputPrompt;
      delete this.questionDetails.defaultValue;

      this.questionDetails["multipleChoiceType"] = "standard";
      this.questionDetails["minSelected"] = 0;
      this.questionDetails["maxSelected"] = 1;
      this.questionDetails["choices"] = [];
    }
  }

  // Import --------------------------------------------------------------------
  /*
    Functions for loading an item's details from a previously saved object
  */

  loadConjureFormItem(obj) {
    for (let key in obj) {
      this[key] = obj[key];
    }
  }


  // Debugging -----------------------------------------------------------------
  /*
    Hidden functions meant to make debugging easier
  */

  __printStyles(includeNull = true) {
    let styleID = (this.appearance.styleID === '') ? '(null)' : this.appearance.styleID;
    if (includeNull || this.appearance.styleID !== '') {
      console.log(this.getConjureID() + " -> " + styleID);
    }
  }

  // export --------------------------------------------------------------------
  /*
    Functions for exporting this class into other usable formats like:
      - JS object
      - <ConjureFormItemComponent/> to render
  */


  // renders <ConjureFormItemomponent/>
  // arguments are runtime values / functions that make it work in production
  // addNewSubformToArray() won't be used, but is placed here for simplicity for ConjureForm
  // indexInArray and onClick_removeSubformFromArray() also won't be used for the same reason
  render(
    formOutput = {},
    onClick_selectForm = () => {},
    devModeOn = false,
    selectedID,
    onInput_answerFormQuestion = () => {},
    onClick_answerMultipleChoiceQuestion = () => {},
    addNewSubformToArray = () => {},
    idConversionTable = {},
    indexInArray = -1,
    onClick_removeSubformFromArray = () => {},
    conditionalRenderLookup = {},
    onClick_moveToPage = () => {}
  )
  {

    let itemDetails;
    if (this.itemType === "text") {
      itemDetails = this.textDetails;
    } else if (this.itemType === "question") {
      itemDetails = this.questionDetails;
    }

    return (
      <ConjureFormItemComponent
        itemID={this.itemID}
        itemType={this.itemType}
        itemDetails={itemDetails}
        appearance={this.appearance}
        selectedID={selectedID}
        devModeOn={devModeOn}
        formOutput={formOutput}
        conditionalRenderLookup={conditionalRenderLookup}
        idConversionTable={idConversionTable}
        onClick_selectItem={onClick_selectForm}
        onInput_answerFormQuestion={onInput_answerFormQuestion}
        onClick_answerMultipleChoiceQuestion={onClick_answerMultipleChoiceQuestion}
      />
    );
  }
}

export default ConjureFormItem;
