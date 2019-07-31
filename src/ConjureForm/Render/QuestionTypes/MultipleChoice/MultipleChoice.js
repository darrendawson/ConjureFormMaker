import React, { Component } from 'react';
import './MultipleChoice.css';

class MultipleChoice extends Component {

  constructor() {
    super();
  }


  // render dropdown -----------------------------------------------------------
  
  // render standard -----------------------------------------------------------

  renderSelectButton = (choice) => {
    if (this.props.renderOnly) {
      return (
        <button className="select_button" style={{'border': '1px solid ' + this.props.borderColor}}></button>
      );
    } else {
      return (
        <button>test</button>
      );
    }
  }


  renderChoices = (choices = this.props.choices) => {

    let choicesToRender = [];

    for (let i = 0; i < choices.length; i++) {
      choicesToRender.push(
        <div className="choice_row">
          {this.renderSelectButton()}
          <p className="choice_text" style={{'color': this.props.textColor}}>{choices[i]}</p>
        </div>
      );
    }

    return choicesToRender;
  }


  // render <MultipleChoice/> --------------------------------------------------

  // Renders <MultipleChoice/>
  render() {
    return (
      <div id="MultipleChoice">
        {this.renderChoices()}
      </div>
    );
  }
}

export default MultipleChoice;
