import React, { Component } from 'react';
import './FormQuestionInput.css';

class FormQuestionInput extends Component {

  constructor() {
    super();
  }

  // render --------------------------------------------------------------------

  // Renders <FormQuestionInput/>
  render() {

    if (this.props.devModeOn) {
      return (
        <div id="FormQuestionInput">
          <input placeholder="placeholder"/>
        </div>
      );
    } else {
      return (
        <div id="FormQuestionInput">
          <input placeholder="placeholder" onChange={this.props.onInput_answerFormQuestion.bind(this, this.props.itemID)}/>

        </div>
      );
    }

  }
}

export default FormQuestionInput;
