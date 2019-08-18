import React, { Component } from 'react';
import './FormQuestionInput.css';

class FormQuestionInput extends Component {

  constructor() {
    super();
  }

  // onInput -------------------------------------------------------------------

  onInput_answerQuestion = (e) => {
    if (this.props.inputType === "string") {
      this.props.onInput_answerFormQuestion(this.props.itemID, e.target.value);
    } else if (this.props.inputType === "number") {
      let numValue = parseFloat(e.target.value);
      this.props.onInput_answerFormQuestion(this.props.itemID, numValue);
    }
  }
  // render --------------------------------------------------------------------

  // Renders <FormQuestionInput/>
  render() {

    if (this.props.devModeOn) {
      return (
        <div id="FormQuestionInput">
          <input placeholder={this.props.prompt} value={this.props.inputValue}/>
        </div>
      );
    } else {
      return (
        <div id="FormQuestionInput">
          <input
            placeholder={this.props.prompt}
            value={this.props.inputValue}
            onChange={this.onInput_answerQuestion.bind(this)}
          />

        </div>
      );
    }

  }
}

export default FormQuestionInput;
