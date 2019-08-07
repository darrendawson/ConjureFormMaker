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

  answerQuestion(value, questionID) {
    this.outputObject.update(value, questionID);
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
