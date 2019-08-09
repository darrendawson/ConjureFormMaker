/*
  ConjureFormOutput is a class for representing the output of a ConjureForm after a user has filled it out in production

  Uses Ustra to maintain values in an efficient manner
    - Because IDs are unique across the entire ConjureForm, Ustra is able to uniquely identify locations properly
*/

import React from 'react';

import RenderFormOutputObject from './DevInputDetails/RenderFormOutputObject/RenderFormOutputObject.js';

import Ustra from '../Ustra.js';

class ConjureFormOutput {

  constructor(outputObject, arrayTable, detailsLookup) {
    this.outputObject = new Ustra(outputObject);    // the output object for the whole ConjureForm, does not include arrays of subConjureForms
    this.detailsLookup = detailsLookup;             // lookup table for finding details about a ConjureForm or ConjureFormItem
    this.arrayDefaults = arrayTable;                // lookup table to get a default value for a new item in a ConjureForm array

    // convert arrayTable objects to be an array of items that use Ustra
    let arrayObjects = arrayTable;
    for (let key in arrayObjects) {
      arrayObjects[key] = [new Ustra(arrayObjects[key])];
    }
    this.arrayTable = arrayObjects;
  }


  getOutputObject() {
    let output = new Ustra(this.outputObject.get_truth()); // create a clone of the outputObject to fill out
    for (let key in this.arrayTable) {
      let arrayTableConverted = [];
      for (let i = 0; i < this.arrayTable[key].length; i++) {
        arrayTableConverted.push(this.arrayTable[key][i].get_truth());
      }
      output.update(arrayTableConverted, key);
    }
    return output.get_truth();
  }

  getDetailsLookup() {
    return this.detailsLookup;
  }


  // public wrapper for calling this.__checkIfIDInOutput()
  // returns true if a formID is in the output object
  checkIfIDInOutput(id) {
    return this.__checkIfIDInOutput(id, this.getOutputObject());
  }

  // recursive function for handling this.checkIfIDInOutput()
  // returns true if an ID is in the ConjureFormOutput
  __checkIfIDInOutput(id, outputObject) {
    for (let key in outputObject) {
      if (key === id) {
        return true;
      } else if (typeof outputObject === "object") {
        let childResult = this.__checkIfIDInOutput(id, outputObject[key]);
        if (childResult) {
          return true;
        }
      }
    }
    return false;
  }


  // answer form questions -----------------------------------------------------

  // for when a user types into an input
  answerInputQuestion(value, questionID) {
    this.outputObject.update(value, questionID);
  }

  // for when a user clicks on a multiple choice option
  // this function has to determine what to do with the selected click based off of what the question settings are
  // 0) if option is false                                  -> deselect all choices
  // 1) if question is a dropdown                           -> select the current one and deselect any others
  // 2) if this option is already selected                  -> deselect it
  // 3) if user hasn't maxed out number of selected options -> select it (add it to the list)
  // 4) if user has maxed out selected options,             -> deselect the oldest selected item (first in array) and select this one
  //       and value isnt already selected
  answerMultipleChoiceQuestion(value, questionID) {

    // get details about this question, such as minSelected and maxSelected
    let questionDetails = this.detailsLookup[questionID];

    // get current answer
    let currentAnswer = this.outputObject.get(questionID);

    // 0) deselect all choices
    if (value === false && questionDetails.minSelected == 0) {
      this.outputObject.update([], questionID);
      return;
    }

    // 1) if dropdown, only select the current one (deselect all others)
    if (questionDetails.multipleChoiceType === "dropdown") {
      this.outputObject.update([value], questionID);
      return;
    }

    // 2) if user is clicking on an already selected option, unselect it
    //     UNLESS unselecting it would put you under the minSelected threshold
    if (currentAnswer.indexOf(value) >= 0 && currentAnswer.length - 1 >= questionDetails.minSelected) {
      let newAnswer = [];                                 // rebuild array without selected option
      for (let i = 0; i < currentAnswer.length; i++) {
        if (currentAnswer[i] !== value) {
          newAnswer.push(currentAnswer[i]);
        }
      }

      this.outputObject.update(newAnswer, questionID);
      return;
    }

    // 3) if the user can select the option, do so
    if (currentAnswer.length < questionDetails.maxSelected) {
      currentAnswer.push(value);
      this.outputObject.update(currentAnswer, questionID);
      return;
    }

    // 4) if already selected max number, deselect the oldest selected option and select the new one
    // USE == instead of === so JS compares number<->number instead of number<->string
    if (currentAnswer.length == questionDetails.maxSelected) {
      currentAnswer.splice(0, 1); // remove oldest selected item
      currentAnswer.push(value);
      this.outputObject.update(currentAnswer, questionID);
      return;
    }
  }

  // get -----------------------------------------------------------------------

  get(formID) {
    return this.outputObject.get(formID);
  }

  // render --------------------------------------------------------------------

  render(selectedID = false, renderTextClickable = false, onClick_selectFormSection = () => {}) {
    return (
      <RenderFormOutputObject
        selectedID={selectedID}
        formOutputObject={this.getOutputObject()}
        formDetailsLookup={this.getDetailsLookup()}
        renderTextClickable={renderTextClickable}
        onClick_selectFormSection={onClick_selectFormSection}
      />
    );
  }
}

export default ConjureFormOutput;
