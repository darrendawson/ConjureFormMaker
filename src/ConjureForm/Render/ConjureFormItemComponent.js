import React, { Component } from 'react';
import './ConjureFormComponent.css';

import FormQuestionInput from './QuestionTypes/FormQuestionInput/FormQuestionInput.js';
import MultipleChoice from './QuestionTypes/MultipleChoice/MultipleChoice.js';

class ConjureFormItemComponent extends Component {

  constructor() {
    super();
  }

  // onClick -------------------------------------------------------------------

  // this function acts as an intermediary to prevent cascading onClicks
  onClick_selectItem = (e) => {
    e.stopPropagation();
    this.props.onClick_selectItem(this.props.itemID);
  }

  // render --------------------------------------------------------------------


  renderSectionTitle = (titleText) => {
    if (titleText !== "") {
      return (
        <div id="section_title_text_container" style={{'background-color': this.props.titleColor}}>
          <h1 className="item_text_margins" style={{'color': this.props.backgroundColor}}>{titleText}</h1>
        </div>
      );
    }
  }

  renderItemDetails = () => {

    let itemDetails = this.props.itemDetails;

    if (this.props.itemType === "text") {
      return (
        <div className="item_container">
          {this.renderSectionTitle(itemDetails.sectionTitleText)}
          <h1 className="item_text_margins" style={{'color': this.props.titleColor}}>{itemDetails.titleText}</h1>
          <p className="item_text_margins" style={{'color': this.props.textColor}}>{itemDetails.descriptionText}</p>
        </div>
      );
    } else if (this.props.itemType === "question") {
      return (
        <div className="item_container">
          <h1 className="item_text_margins" style={{'color': this.props.titleColor}}>{itemDetails.questionTitle}</h1>
          <p className="item_text_margins" style={{'color': this.props.textColor}}>{itemDetails.questionDescription}</p>
          {this.renderQuestion()}
        </div>
      );
    }
  }


  renderQuestion = () => {

    let itemDetails = this.props.itemDetails;

    // make sure that we only render the question when appropriate
    if (this.props.itemType !== "question") {
      return;
    }

    // render <FormQuestionInput/>
    if (itemDetails.questionType === "input") {
      return (
        <div>
          <FormQuestionInput
            itemID={this.props.itemID}
            onInput_answerFormQuestion={this.props.onInput_answerFormQuestion}
            devModeOn={this.props.devModeOn}
          />
        </div>
      );
    }


    // if devMode is on, then we only need to render the bare minimum inputs (without actual onClick / onChange events)
    if (this.props.devModeOn) {

      if (itemDetails.questionType === "multipleChoice") {
        return (
          <div>
            <MultipleChoice
              choices={itemDetails.choices}
              backgroundColor={this.props.backgroundColor}
              borderColor={this.props.titleColor}
              textColor={this.props.textColor}
              minSelected={itemDetails.minSelected}
              maxSelected={itemDetails.maxSelected}
              multipleChoiceType={itemDetails.multipleChoiceType}
              devModeOn={true}
            />
          </div>
        );
      }
    } else if (itemDetails.questionType === "code") {
      return (
        <div>

        </div>
      );
    }

    // ADD if (this.props.devModeOn === false) {} for rendering the actual form

  }

  render() {

    // determine border styling
    let borderCSS;
    if (this.props.devModeOn) {
      if (this.props.selected) {
        borderCSS = "dev_mode_selected";
      } else {
        borderCSS = "dev_mode_hover";
      }
    } else {
      borderCSS = "dev_mode_off_border";
    }


    return (
      <div
        id="ConjureFormItemComponent"
        className={borderCSS}
        onClick={this.onClick_selectItem}>

        {this.renderItemDetails()}

      </div>
    );
  }
}

export default ConjureFormItemComponent;
