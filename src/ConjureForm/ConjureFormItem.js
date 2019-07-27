/*
  ConjureFormItem is a datastructure for representing individual form items (like questions or titles) on a Conjure Form
    - acts as a child for the ConjureForm datastructure
    - uses <ConjureFormItemComponent/> to render
*/

import React from 'react';
import ConjureFormItemComponent from './Render/ConjureFormItemComponent.js';


const __textColorDefault = "#262626";
const __titleColorDefault = "#262626";


class ConjureFormItem {

  constructor(itemID, itemType = "text") {
    this.itemID = itemID;
    this.onClick_selectItem = function() {};

    this.itemType = itemType;
    if (itemType === "text") {
      this.descriptionText = "";
      this.titleText = "";
      this.sectionTitleText = "";
    } else {
      this.questionTitle = "";
      this.questionDescription = "";
    }

    // set default colors
    this.colors = {
      "text": __textColorDefault,
      "title": __titleColorDefault
    };

    this.runtime = {"selected": false};
  }



  getClassName() {
    return "ConjureFormItem";
  }

  // UX ------------------------------------------------------------------------
  /*

  */

  registerOnClickSelectItem(onClickFunction) {
    this.onClick_selectItem = onClickFunction;
  }


  // updates the colors of this ConjureFormItem
  updateColors(colors) {

  }


  // called by a parent ConjureForm when a new form section is selected
  updateSelectedSection(selectedID) {
    if (this.itemID === selectedID) {
      this.runtime.selected = true;
    } else {
      this.runtime.selected = false;
    }
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
    return (
      <ConjureFormItemComponent
        itemID={this.itemID}
        selected={this.runtime.selected}
        onClick_selectItem={this.onClick_selectItem}
        textColor={this.colors.text}
        titleColor={this.colors.title}
      />
    );
  }
}

export default ConjureFormItem;
