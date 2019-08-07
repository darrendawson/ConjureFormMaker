/*
  ConjureFormOutput is a class for representing the output of a ConjureForm after a user has filled it out in production

  Uses Ustra to maintain values in an efficient manner
    - Because IDs are unique across the entire ConjureForm, Ustra is able to uniquely identify locations properly
*/

import React from 'react';

import RenderFormOutputObject from './DevInputDetails/RenderFormOutputObject/RenderFormOutputObject.js';

import Ustra from '../Ustra.js';

class ConjureFormOutput {

  constructor(outputObject, detailsLookup) {
    this.outputObject = new Ustra(outputObject);
    this.detailsLookup = detailsLookup;
  }


  getOutputObject() {
    return this.outputObject.get_truth();
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
  // - if this option is already selected                  -> deselect it
  // - if user hasn't maxed out number of selected options -> select it (add it to the list)
  // - if user has maxed out number of selectable options  -> do not select it
  answerMultipleChoiceQuestion(value, questionID) {

    // get details about this question, such as minSelected and maxSelected
    let questionDetails = this.detailsLookup[questionID];

    // get current answer
    let currentAnswer = this.outputObject.get(questionID);

    // if user is clicking on an already selected option, unselect it
    if (currentAnswer.indexOf(value) >= 0) {
      let newAnswer = [];                                 // rebuild array without selected option
      for (let i = 0; i < currentAnswer.length; i++) {
        if (currentAnswer[i] !== value) {
          newAnswer.push(currentAnswer[i]);
        }
      }

      this.outputObject.update(newAnswer, questionID);
      return;
    }

    // if the user can select the option, do so
    if (currentAnswer.length < questionDetails.maxSelected) {
      currentAnswer.push(value);
      this.outputObject.update(currentAnswer, questionID);
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
