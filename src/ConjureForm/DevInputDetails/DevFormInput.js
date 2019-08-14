import React, { Component } from 'react';
import './DevFormInput.css';



class DevFormInput extends Component {

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

  // render Form Details -------------------------------------------------------

  renderFormDetails = () => {

    let containerType = this.props.formDetails.containerType;
    if (containerType !== "card") {
      return;
    }

    //  capitalize the first letter
    containerType = containerType.charAt(0).toUpperCase() + containerType.slice(1);

    return (
      <div className="form_input_container">

        <h1 className="section_title">{containerType} Details</h1>

        <div className="input_row">
          <h3 className="input_title">Min to Render</h3>
          <h3 className="input_title">1</h3>
        </div>

        <div className="input_row">
          <h3 className="input_title">Max to Render</h3>
          <input
            className="form_input"
            value={this.props.formDetails.maxForms}
            onChange={this.onInput_updateFormDetail.bind(this, "maxForms")}
          />
        </div>

        {this.renderNewSubformArrayButton()}
      </div>
    );
  }


  renderNewSubformArrayButton = () => {
    if (this.props.formDetails.maxForms > 1) {
      return (
        <div className="input_row">
          <h3 className="input_title">New Subform Text</h3>
          <input
            className="form_input"
            value={this.props.formDetails.newSubformButtonText}
            onChange={this.onInput_updateFormDetail.bind(this, "newSubformButtonText")}
          />
        </div>
      );
    }
  }

  // render form output --------------------------------------------------------

  renderFormOutputObject = () => {

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
            value={this.props.formDetails.outputID}
            onChange={this.onInput_updateFormDetail.bind(this, "outputID")}
          />
        </div>

        <div className="input_row">
          {formOutput.render(this.props.selectedID, true, this.props.onClick_selectFormSection)}
        </div>

      </div>
    );
  }


  // render <DevFormInput/> ----------------------------------------------------

  render() {
    return (
      <div id="DevFormInput">
        {this.renderFormOutputObject()}
        {this.renderFormDetails()}
      </div>
    );
  }
}

export default DevFormInput;
