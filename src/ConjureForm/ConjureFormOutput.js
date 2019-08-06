/*
  ConjureFormOutput is a class for representing the output of a ConjureForm after a user has filled it out in production
*/

import React from 'react';

import RenderFormOutputObject from './DevInputDetails/RenderFormOutputObject/RenderFormOutputObject.js';


class ConjureFormOutput {

  constructor(outputObject, detailsLookup) {
    this.outputObject = outputObject;
    this.detailsLookup = detailsLookup;
  }


  getOutputObject() {
    return this.outputObject;
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
