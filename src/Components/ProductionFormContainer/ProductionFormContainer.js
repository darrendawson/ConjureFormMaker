import React, { Component } from 'react';
import './ProductionFormContainer.css';

class ProductionFormContainer extends Component {

  constructor() {
    super();

    this.state = {

    }
  }


  // render --------------------------------------------------------------------

  // Renders <ProductionFormContainer/>
  render() {


    let conjureForm = this.props.conjureForm;
    let selectForm = () => {};                 // because <ProductionFormContainer/> is used for answering forms, you can't "select" a form section
    let devModeOn = false;                     // devModeOn is false for <ProductionFormContainer/>
    let selectedID = false;                    // there is no such thing as a selected form in production
    let onInput_answerFormQuestion = this.props.onInput_answerFormQuestion;
    let answerMC = this.props.onClick_answerMultipleChoiceQuestion;
    return (
      <div id="ProductionFormContainer" style={{'background-color': this.props.backgroundColor}}>
        <div id="form_container">
          {conjureForm.render(selectForm, devModeOn, selectedID, onInput_answerFormQuestion, answerMC)}
        </div>
      </div>
    );
  }
}

export default ProductionFormContainer;
