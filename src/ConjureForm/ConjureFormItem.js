/*
  ConjureFormItem is a datastructure for representing individual form items (like questions or titles) on a Conjure Form
    - acts as a child for the ConjureForm datastructure
    - uses <ConjureFormItemComponent/> to render
*/

import React from 'react';
import ConjureFormItemComponent from './Render/ConjureFormItemComponent.js';


class ConjureFormItem {

  constructor(itemID) {
    this.itemID = itemID;
    this.onClick_selectItem = function() {};
  }


  // UX ------------------------------------------------------------------------
  /*

  */

  registerOnClickSelectItem(onClickFunction) {
    this.onClick_selectItem = onClickFunction;
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
        onClick_selectItem={this.onClick_selectItem}
      />
    );
  }
}

export default ConjureFormItem;
