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


  renderFormDetails = () => {

    return (
      <div className="form_input_container">
        <h1 className="section_title">Form Output</h1>
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
