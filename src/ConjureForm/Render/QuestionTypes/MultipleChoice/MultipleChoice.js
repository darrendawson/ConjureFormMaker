import React, { Component } from 'react';
import './MultipleChoice.css';

class MultipleChoice extends Component {

  constructor() {
    super();

    this.state = {
      "dropDownOpen": false
    }
  }


  // onClick -------------------------------------------------------------------

  onClick_selectFromDropDown = (choice) => {
    this.props.onClick_answerMultipleChoiceQuestion(choice, this.props.questionID);
    this.setState({dropDownOpen: false});
  }

  // render dropdown -----------------------------------------------------------




  renderChoicesDropDown = () => {
    if (this.state.dropDownOpen) {


      // build up list of choices to render
      let choicesToRender = [];
      let choices = this.props.choices;


      // if the user doesn't have to select a choice, render a blank slot for them to pick instead
      if (this.props.minSelected < 1) {
        choicesToRender.push(
          <div
            className="dropdown_item_container"
            style={{'border': '1px solid ' + this.props.borderColor}}
            onClick={() => this.onClick_selectFromDropDown(false)}>
            <pre> </pre>
          </div>
        );
      }


      // add choices
      for (let i = 0; i < choices.length; i++) {

        if (this.props.selectedChoices.indexOf(choices[i]) >= 0) {
          choicesToRender.push(
            <div
              className="dropdown_item_container"
              style={{'background-color': this.props.borderColor, 'border': '1px solid ' + this.props.borderColor}}
              onClick={() => this.onClick_selectFromDropDown(choices[i])}>
              <p style={{'color': this.props.backgroundColor}}>{choices[i]}</p>
            </div>
          );
        } else {
          choicesToRender.push(
            <div
              className="dropdown_item_container"
              style={{'border': '1px solid ' + this.props.borderColor}}
              onClick={() => this.onClick_selectFromDropDown(choices[i])}>
              <p style={{'color': this.props.borderColor}}>{choices[i]}</p>
            </div>
          );
        }
      }


      // render the title bar and all choices
      let selectedChoice = "";
      if (this.props.selectedChoices.length > 0) {
        selectedChoice = this.props.selectedChoices[0];
      }

      return (
        <div id="dropdown_full_container">
          {/* top bar */}
          <div
            className="dropdown_title_container"
            style={{'border': '1px solid ' + this.props.borderColor}}
            onClick={() => this.setState({'dropDownOpen': false})}>
            <p style={{'color': this.props.borderColor}}>{selectedChoice}</p>
            <p style={{'color': this.props.borderColor}}>^</p>
          </div>

          {/* dropdown */}
          <div className="dropdown_choices_column">
            {choicesToRender}
          </div>
        </div>

      );
    } else {

      // only render the title bar
      let selectedChoice = "";
      if (this.props.selectedChoices.length > 0) {
        selectedChoice = this.props.selectedChoices[0];
      }

      return (
        <div id="dropdown_full_container">
          <div
            className="dropdown_title_container"
            style={{'border': '1px solid ' + this.props.borderColor}}
            onClick={() => this.setState({'dropDownOpen': true})}>
            <p style={{'color': this.props.borderColor}}>{selectedChoice}</p>
            <p style={{'color': this.props.borderColor}}>V</p>
          </div>
        </div>
      );
    }

  }

  // render standard -----------------------------------------------------------

  renderSelectButton = (choice) => {

    let buttonStyle = {'border': '1px solid ' + this.props.borderColor}
    if (this.props.selectedChoices.indexOf(choice) >= 0) {
      buttonStyle['background-color'] = this.props.borderColor;
    } else if (choice === false && this.props.selectedChoices.length === 0) {
      buttonStyle['background-color'] = this.props.borderColor;
    }

    return (
      <button
        className="select_button"
        style={buttonStyle}
        onClick={() => this.props.onClick_answerMultipleChoiceQuestion(choice, this.props.questionID)}>
      </button>
    );
  }


  renderChoicesStandard = (choices = this.props.choices) => {

    let choicesToRender = [];

    if (this.props.minSelected == 0) {
      choicesToRender.push(
        <div className="choice_row">
          {this.renderSelectButton(false)}
          <p className="choice_text" style={{'color': this.props.textColor}}></p>
        </div>
      );
    }

    for (let i = 0; i < choices.length; i++) {
      choicesToRender.push(
        <div className="choice_row">
          {this.renderSelectButton(choices[i])}
          <p className="choice_text" style={{'color': this.props.textColor}}>{choices[i]}</p>
        </div>
      );
    }

    return choicesToRender;
  }


  // render <MultipleChoice/> --------------------------------------------------


  renderChoices = () => {
    if (this.props.multipleChoiceType === "standard") {
      return this.renderChoicesStandard();
    } else if (this.props.multipleChoiceType === "dropdown") {
      return this.renderChoicesDropDown();
    }
  }


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
