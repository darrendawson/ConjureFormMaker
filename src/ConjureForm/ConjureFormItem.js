/*
  ConjureFormItem is a datastructure for representing individual form items (like questions or titles) on a Conjure Form
    - acts as a child for the ConjureForm datastructure
    - uses <ConjureFormItemComponent/> to render
*/

import React from 'react';
import ConjureFormItemComponent from './Render/ConjureFormItemComponent.js';

const __questionTypes = ["input", "multipleChoice", "code"];

const __textColorDefault = "#262626";
const __titleColorDefault = "#262626";
const __backgroundColorDefault = "#eaeaea";


class ConjureFormItem {

  constructor(itemID, itemType = "text") {
    this.itemID = itemID;
    this.onClick_selectItem = function() {};

    this.itemType = itemType;
    if (itemType === "text") {
      this.textDetails = {};
      this.textDetails.descriptionText = "Description";
      this.textDetails.titleText = "Title";
      this.textDetails.sectionTitleText = "Section Title";
    } else {
      this.questionDetails = {};
      this.questionDetails.questionTitle = "Question Title";
      this.questionDetails.questionDescription = "Question Description";
      this.questionDetails.questionType = "input";
    }

    // set default colors
    this.colors = {
      "text": __textColorDefault,
      "title": __titleColorDefault,
      "background": __backgroundColorDefault
    };

    this.runtime = {"selected": false, "devModeOn": true};
  }



  getClassName() {
    return "ConjureFormItem";
  }

  getItemDetails = () => {
    if (this.itemType === "text") {
      return this.textDetails;
    } else if (this.itemType === "question") {
      return this.questionDetails;
    }
  }


  // Update --------------------------------------------------------------------

  updateItemDetails = (newDetails) => {

    let updatedDetails = this.getItemDetails();

    // overwrite the values that are described in newDetails
    for (let key in newDetails) {
      updatedDetails[key] = newDetails[key];
    }

    // save
    if (this.itemType === "text") {
      this.textDetails = updatedDetails;
    } else if (this.itemType === "question") {
      this.questionDetails = updatedDetails;
    }
  }

  // UX ------------------------------------------------------------------------
  /*

  */

  registerOnClickSelectItem(onClickFunction) {
    this.onClick_selectItem = onClickFunction;
  }


  // updates the colors of this ConjureFormItem
  updateColors(colors) {
    this.colors.text = colors.text;
    this.colors.title = colors.title;
    this.colors.background = colors.card;
  }


  // called by a parent ConjureForm when a new form section is selected
  updateSelectedSection(selectedID) {
    if (this.itemID === selectedID) {
      this.runtime.selected = true;
    } else {
      this.runtime.selected = false;
    }
  }

  updateDevMode(newDevMode) {
    this.runtime.devModeOn = newDevMode;
  }

  // export --------------------------------------------------------------------
  /*
    Functions for exporting this class into other usable formats like:
      - JS object
      - <ConjureFormItemComponent/> to render
  */


  dumpToJSON() {

  }


  render() {

    let itemDetails;
    if (this.itemType === "text") {
      itemDetails = this.textDetails;
    } else if (this.itemType === "question") {
      itemDetails = this.questionDetails;
    }

    return (
      <ConjureFormItemComponent
        itemID={this.itemID}
        itemType={this.itemType}
        itemDetails={itemDetails}
        selected={this.runtime.selected}
        devModeOn={this.runtime.devModeOn}
        onClick_selectItem={this.onClick_selectItem}
        textColor={this.colors.text}
        titleColor={this.colors.title}
        backgroundColor={this.colors.background}
      />
    );
  }
}

export default ConjureFormItem;
