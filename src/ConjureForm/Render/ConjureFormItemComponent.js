import React, { Component } from 'react';
import './ConjureFormComponent.css';

import FormQuestionInput from './QuestionTypes/FormQuestionInput/FormQuestionInput.js';
import MultipleChoice from './QuestionTypes/MultipleChoice/MultipleChoice.js';

class ConjureFormItemComponent extends Component {

  constructor() {
    super();
  }

  getID = () => {
    if (this.props.itemID in this.props.idConversionTable) {
      return this.props.idConversionTable[this.props.itemID];
    }
    return this.props.itemID;
  }

  // onClick -------------------------------------------------------------------

  // this function acts as an intermediary to prevent cascading onClicks
  onClick_selectItem = (e) => {
    e.stopPropagation();
    this.props.onClick_selectItem(this.getID());
  }


  // padding -------------------------------------------------------------------

  // returns a styles object with padding to wrap the entire <ConjureFormItem/>
  getContainerPadding = () => {
    let styling = {};
    styling['padding-top'] = this.props.appearance.paddingTop + 'px';
    styling['padding-bottom'] = this.props.appearance.paddingBottom + 'px';
    styling['padding-left'] = this.props.appearance.paddingSides + 'px';
    styling['padding-right'] = this.props.appearance.paddingSides + 'px';
    return styling;
  }

  // render --------------------------------------------------------------------


  renderSectionTitle = (titleText) => {
    if (titleText !== "") {
      return (
        <div id="section_title_text_container" style={{'background-color': this.props.titleColor, 'margin-bottom': this.props.appearance.paddingBelowSectionTitle + 'px'}}>
          <h1 className="item_text_margins" style={{'color': this.props.backgroundColor}}>{titleText}</h1>
        </div>
      );
    }
  }

  renderDescription = (text) => {

    let linesOfText = text.split("\\n");
    let linesToRender = [];

    for (let i = 0; i < linesOfText.length; i++) {
      linesToRender.push(
        <p
          className="item_text_no_margins"
          style={{'color': this.props.textColor}}>
          {linesOfText[i]}
        </p>
      );
    }
    return (
      <div style={{'margin-bottom': this.props.appearance.paddingBelowDescription + 'px'}}>
        {linesToRender}
      </div>
    );
  }



  renderItemDetails = () => {

    let itemDetails = this.props.itemDetails;

    if (this.props.itemType === "text") {
      return (
        <div className="item_container" style={this.getContainerPadding()}>
          {this.renderSectionTitle(itemDetails.sectionTitleText)}
          <h1 className="item_text_no_margins" style={{'color': this.props.titleColor, 'margin-bottom': this.props.appearance.paddingBelowRegularTitle + 'px'}}>{itemDetails.titleText}</h1>
          {this.renderDescription(itemDetails.descriptionText)}
        </div>
      );
    } else if (this.props.itemType === "question") {
      return (
        <div className="item_container" style={this.getContainerPadding()}>
          <h1 className="item_text_no_margins" style={{'color': this.props.titleColor, 'margin-bottom': this.props.appearance.paddingBelowTitle + 'px'}}>{itemDetails.questionTitle}</h1>
          {this.renderDescription(itemDetails.questionDescription)}
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

      let value = this.props.formOutput.get(this.getID());

      return (
        <div>
          <FormQuestionInput
            itemID={this.getID()}
            inputValue={value}
            inputType={itemDetails.inputType}
            prompt={itemDetails.inputPrompt}
            onInput_answerFormQuestion={this.props.onInput_answerFormQuestion}
            devModeOn={this.props.devModeOn}
          />
        </div>
      );
    }

    if (itemDetails.questionType === "multipleChoice") {

      let formOutput = this.props.formOutput;
      let selectedChoices = formOutput.get(this.getID());

      return (
        <div>
          <MultipleChoice
            questionID={this.getID()}
            choices={itemDetails.choices}
            backgroundColor={this.props.backgroundColor}
            borderColor={this.props.titleColor}
            textColor={this.props.textColor}
            minSelected={itemDetails.minSelected}
            maxSelected={itemDetails.maxSelected}
            multipleChoiceType={itemDetails.multipleChoiceType}
            devModeOn={this.props.devModeOn}
            selectedChoices={selectedChoices}
            onClick_answerMultipleChoiceQuestion={this.props.onClick_answerMultipleChoiceQuestion}
          />
        </div>
      );
    }
  }


  // Conditional Render --------------------------------------------------------

  // returns true if this component should be rendered, false otherwise
  checkConditionalRender = () => {
    if (this.getID() in this.props.conditionalRenderLookup) {
      return this.props.conditionalRenderLookup[this.getID()];
    } else {
      return true;
    }
  }


  // Render --------------------------------------------------------------------

  // determine border styling for <ConjureFormComponent/>
  getBorderStyling = () => {
    if (this.props.devModeOn) {
      if (this.props.selectedID === this.getID()) {
        return "dev_mode_selected";
      } else {
        return"dev_mode_hover";
      }
    } else {
      return "dev_mode_off_border";
    }
  }

  // Render <ConjureFormItemComponent/>
  render() {

    // if ConjureFormItem should be rendered, do so
    if (this.checkConditionalRender()) {

      return (
        <div
          id="ConjureFormItemComponent"
          className={this.getBorderStyling()}
          onClick={this.onClick_selectItem}
          >

          {this.renderItemDetails()}

        </div>
      );

    // otherwise, item should not be rendered so return an empty div
    } else {
      return (
        <div></div>
      )
    }

  }
}

export default ConjureFormItemComponent;
