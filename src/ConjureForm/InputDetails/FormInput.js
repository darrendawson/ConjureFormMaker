import React, { Component } from 'react';
import './FormInput.css';


import RenderFormOutputObject from './RenderFormOutputObject/RenderFormOutputObject.js';


class FormInput extends Component {

  constructor() {
    super();
  }

  // onInput -------------------------------------------------------------------

  // when a user types into an <input/> that would modify a ConjureFormItem.itemDefinition parameter,
  // this function makes that update happen
  onInput_updateFormDetail = (detailType, e) => {
    let updatedItemDetails = this.props.formDetails;
    updatedItemDetails[detailType] = e.target.value;
    this.props.onClick_updateFormSectionDetails(this.props.selectedID, updatedItemDetails);
  }

  // render --------------------------------------------------------------------


  // function that determines whether a given formID is in the form output object
  checkIfFormIDInOutput = (formID, formOutputObject) => {
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


  renderFormDetails = () => {

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
            value={this.props.formDetails.outputID}
            onChange={this.onInput_updateFormDetail.bind(this, "outputID")}
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
      <div id="FormInput">
        {this.renderFormDetails()}
      </div>
    );
  }
}

export default FormInput;
