/*
  ConjureFormItem is a datastructure for representing individual form items (like questions or titles) on a Conjure Form
    - acts as a child for the ConjureForm datastructure
    - uses <ConjureFormItemComponent/> to render
*/

import React from 'react';
import ConjureFormItemComponent from './Render/ConjureFormItemComponent.js';

const __questionTypes = ["input", "multipleChoice", "code"];

const __textColorDefault = "#262626";
const __titleColorDefault = "#262626";
const __backgroundColorDefault = "#eaeaea";


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
    } else if (itemType === "question"){
      this.questionDetails = {
        "questionTitle": "Question Title",
        "questionDescription": "Description",
        "questionType": "input",
        "inputType": "string",
        "inputPrompt": "prompt...",
        "defaultValue": "",
        "outputID": itemID
      };
    }

    // set default colors
    this.colors = {
      "text": __textColorDefault,
      "title": __titleColorDefault,
      "background": __backgroundColorDefault
    };
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
        return this.questionDetails.defaultValue;
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

  // UX ------------------------------------------------------------------------
  /*

  */

  // updates the colors of this ConjureFormItem
  updateColors(colors) {
    this.colors.text = colors.text;
    this.colors.title = colors.title;
    this.colors.background = colors.card;
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
  // export --------------------------------------------------------------------
  /*
    Functions for exporting this class into other usable formats like:
      - JS object
      - <ConjureFormItemComponent/> to render
  */


  dumpToJSON() {

  }


  render(
    onClick_selectForm = () => {},
    devModeOn = false,
    selectedID,
    onInput_answerFormQuestion = () => {}
  ) {

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
        selectedID={selectedID}
        devModeOn={devModeOn}
        textColor={this.colors.text}
        titleColor={this.colors.title}
        backgroundColor={this.colors.background}
        onClick_selectItem={onClick_selectForm}
        onInput_answerFormQuestion={onInput_answerFormQuestion}
      />
    );
  }
}

export default ConjureFormItem;
