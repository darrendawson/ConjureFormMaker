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

  // render --------------------------------------------------------------------



  renderFormDetails = () => {

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


  render() {
    return (
      <div id="DevFormInput">
        {this.renderFormDetails()}
      </div>
    );
  }
}

export default DevFormInput;
