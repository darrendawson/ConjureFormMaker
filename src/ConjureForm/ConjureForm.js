/*
  ConjureForm is a datastructure for representing forms on Conjure
   - used during the creation/manipulation AND rendering processes
   - is recursive. A ConjureForm is a container that contains child ConjureForms and ConjureFormItems
   - uses the <ConjureFormComponent/> component to render
*/

import React from 'react';

import ConjureFormComponent from './Render/ConjureFormComponent.js';
import ConjureFormItem from './ConjureFormItem.js';


const __containerTypes = ["all", "page", "card"];

// default colors
const __allColorDefault = "#eaeaea";
const __pageColorDefault = "#eaeaea";
const __cardColorDefault = "#f4f4f4";
const __shadowColorDefault = '#7c7c7c';

class ConjureForm {

  constructor(formID = null, formType = "all") {
    this.subforms = {};
    this.items = {};
    this.order = [];
    this.formID = (formID !== null) ? formID : this.getNewUniqueID();


    // when a user fills out the questions in this ConjureForm, they will all be entered into a dictionary
    // - result[outputID] = {user answers}
    // therefore, nested ConjureForm's will have result[outputID_1]...[outputID_N]
    // defaults to formID because that is unique. User will modify the value from there
    this.formDetails = {"containerType": formType, "outputID": this.formID, "outputType": "dict"};

    // determine colors
    this.colors = {};
    if (formType === "all") {
      this.colors['backgroundColor'] = __allColorDefault;
      this.colors['cardShadow'] = __shadowColorDefault;
    } else if (formType === "page") {
      this.colors['backgroundColor'] = __pageColorDefault;
      this.colors['cardShadow'] = __shadowColorDefault;
    } else if (formType === "card") {
      this.colors['backgroundColor'] = __cardColorDefault;
      this.colors['cardShadow'] = __shadowColorDefault;
    }


    this.runtime = {"selected": false, "devModeOn": true};
    this.onClick_selectForm = function() {};
  }


  // returns the className of this object
  getClassName() {
    return "ConjureForm";
  }


  // IDs -----------------------------------------------------------------------
  /*
    - Functions for managing and distributing unique IDs to every child in the ConjureForm
  */

  // gets a random String to act as a unique key for a subform or item
  // calls getAllUsedIDs() to make sure this is a unique ID across the entire ConjureForm tree
  getNewUniqueID() {

    const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let usedIDs = this.getAllUsedIDs();

    while (true) {
      let newID = "";
      for (let i = 0; i < 7; i++) {
        newID += possible.charAt(Math.floor(Math.random() * possible.length));
      }

      // make sure that the ID is new before sending it back
      if (usedIDs.indexOf(newID) < 0) {
        return newID;
      }
    }
  }


  // gets all the IDs that are used in the form so far, including all children subforms/items
  // - calls all children .getAllUsedIDs()
  getAllUsedIDs() {
    let usedIDs = [];

    // get all IDs used by subforms
    for (let key in this.subforms) {

      // add IDs for children forms
      let childIDs = this.subforms[key].getAllUsedIDs();
      for (let i = 0; i < childIDs.length; i++) {
        usedIDs.push(childIDs[i]);
      }

      // add ID for current form
      usedIDs.push(key);
    }

    // get all IDs used by items
    for (let key in this.items) {
      usedIDs.push(key);
    }

    return usedIDs;
  }


  // searches through nested ConjureForm to find the ID of the parent of the childID
  // -> used to get the parent ConjureForm's ID when calling declareNewItem() or declareNewSubform()
  getParentFormID = (childID) => {

    // check to see if this ConjureForm is the parent
    for (let key in this.subforms) {
      if (key === childID) {
        return this.formID;
      }
    }

    for (let key in this.items) {
      if (key === childID) {
        return this.formID;
      }
    }

    // since this ConjureForm is not the parent, check to see if any of its children are
    for (let key in this.subforms) {
      let result = this.subforms[key].getParentFormID(childID);
      if (result) {
        return result;
      }
    }

    // otherwise, bubble up a negative result
    return false;
  }


  // Create / Add --------------------------------------------------------------
  /*
    functions for adding new info into ConjureForm
    - every item within a ConjureForm must have a unique ID

    External Functions: are meant to be called publicly
      - declareNewSubform()
      - declareNewItem()

    Internal Functions: are NOT meant to be called publicly
      - __declareNewSubform():  Only meant to be called by this.declareNewSubform()
      - __declareNewItem():     Only meant to be called by this.declareNewItem()
  */



  // This function navigates to the desired Form in the ConjureForm object and declares a new subform under it by calling this.__declareNewSubform()
  // -> this is the function that gets called externally by the user/client
  //
  // ARGS:
  // - formID:              the ID of the ConjureForm that you want to add a subform to
  //                        If this isn't the current ConjureForm, it will pass the function call to all subform children
  //
  // - prevOrderLocationID: the ID of the item/subform that this new subform should go after
  //                          if this argument is null, just append the new subform to the end of this.order
  //
  // RETURNS:
  // - the ID of the newly created/added ConjureForm
  declareNewSubform(formID = this.formID, prevOrderLocationID = null, insertPre = false) {
    if (formID === this.formID) {
      return this.__declareNewSubform(prevOrderLocationID, insertPre);
    }

    for (let key in this.subforms) {
      let newFormID = this.subforms[key].declareNewSubform(formID, prevOrderLocationID, insertPre);
      if (newFormID) {
        return newFormID;
      }
    }

    return false;
  }

  // This function navigates to the desired Form in the ConjureForm object and declares a new ConjureFormItem under it by calling this.__declareNewItem()
  // -> this is the function that gets called externally by the user/client
  //
  // ARGS:
  // - formID:              the ID of the ConjureForm that you want to add a ConjureFormItem to
  //                        If this isn't the current ConjureForm, it will pass the function call to all subform children
  //
  // - prevOrderLocationID: the ID of the item/subform that this new ConjureFormItem should go after
  //                          if this argument is null, just append the new ConjureFormItem to the end of this.order
  //
  // RETURNS:
  // - the ID of the newly created/added ConjureFormItem
  declareNewItem(formID = this.formID, newItemType = "text", prevOrderLocationID = null, insertPre = false) {


    if (formID === this.formID) {
      return this.__declareNewItem(newItemType, prevOrderLocationID, insertPre);
    }

    for (let key in this.subforms) {
      let newFormID = this.subforms[key].declareNewItem(formID, newItemType, prevOrderLocationID, insertPre);
      if (newFormID) {
        return newFormID;
      }
    }

    return false;
  }


  // adds an (empty) new ConjureFormItem to this.items
  // Args:
  // - prevOrderLocationID:   the ID of the item/subform that this new FormItem should come after
  //                          if this argument is null, just append the new FormItem to the end of this.order
  // Returns:
  //  - the newly created/added ConjureFormItem object
  __declareNewItem(newItemType, prevOrderLocationID, insertPre) {

    let newID = this.getNewUniqueID();
    let newItem = new ConjureFormItem(newID, newItemType);

    // add the same onClick_selectFormItem to this child
    newItem.registerOnClickSelectItem(this.onClick_selectForm);

    // add to this.subforms
    this.items[newID] = newItem;

    // add to this.order
    let orderItem = {"type": "ConjureFormItem", "id": newID};

    if (prevOrderLocationID === null) {
      this.order.push(orderItem);
    } else {

      // find the index of the prevOrderLocationID
      let pushIndex = -1;
      for (let i = 0; i < this.order.length; i++) {
        if (prevOrderLocationID === this.order[i]["id"]) {
          if (insertPre) {
            pushIndex = i;
          } else {
            pushIndex = i + 1;
          }
        }
      }

      // add the subform here
      if (pushIndex < 0) {
        this.order.push(orderItem);
      } else {
        this.order.splice(pushIndex, 0, orderItem);
      }
    }

    return newID;
  }


  // instantiates an (empty) new ConjureForm and adds it to this.subforms
  // -> this function is called internally by this.declareNewSubform() and should not be used otherwise
  //
  // Args:
  // - prevOrderLocationID:   the ID of the item/subform that this new subform should go after
  //                          if this argument is null, just append the new subform to the end of this.order
  // Returns:
  // - the newly created/added ConjureForm object
  __declareNewSubform(prevOrderLocationID = null, insertPre) {

    let newID = this.getNewUniqueID();
    let subformType = this.getSubformType();
    let newForm = new ConjureForm(newID, subformType);

    // add the same onClick_selectFormSection to this child
    newForm.registerOnClickSelectForm(this.onClick_selectForm);

    // add to this.subforms
    this.subforms[newID] = newForm;

    // add to this.order
    let orderItem = {"type": "ConjureForm", "id": newID};

    if (prevOrderLocationID === null) {
      this.order.push(orderItem);
    } else {

      // find the index of the prevOrderLocationID
      let pushIndex = -1;
      for (let i = 0; i < this.order.length; i++) {
        if (prevOrderLocationID === this.order[i]["id"]) {
          if (insertPre) {
            pushIndex = i;
          } else {
            pushIndex = i + 1;
          }
        }
      }

      // add the subform here
      if (pushIndex < 0) {
        this.order.push(orderItem);
      } else {
        this.order.splice(pushIndex, 0, orderItem);
      }
    }

    return newID;
  }


  // gets the proper form type for a child of this form
  getSubformType() {
    if (this.formDetails.containerType === "all") {
      return "page";
    } else if (this.formDetails.containerType === "page") {
      return "card";
    } else if (this.formDetails.containerType === "card") {
      return "";
    }
  }

  // Delete --------------------------------------------------------------------
  /*
    Functions for deleting objects from the nested ConjureForm object
  */


  // finds the ConjureForm or ConjureFormItem with targetID and deletes it
  // - need to delete from this.subforms / this.items AND this.order
  delete(targetID) {

    // this function removes an item with deletedID from the order
    // works by creating a copy of old order and omitting the deletedID
    let getNewOrder = function(deletedID, oldOrder) {
      let newOrder = [];
      for (let i = 0; i < oldOrder.length; i++) {
        if (oldOrder[i]["id"] !== deletedID) {
          newOrder.push(oldOrder[i]);
        }
      }
      return newOrder;
    }


    for (let key in this.subforms) {
      if (key === targetID) {
        delete(this.subforms[key]);
        this.order = getNewOrder(targetID, this.order)
        return;
      } else {
        this.subforms[key].delete(targetID);
      }
    }

    for (let key in this.items) {
      if (key === targetID) {
        delete(this.items[key]);
        this.order = getNewOrder(targetID, this.order);
        return;
      }
    }
  }

  // Get -----------------------------------------------------------------------
  /*
    Functions for retrieving info from (nested) ConjureForms / ConjureFormItems
  */


  // searches for object (either ConjureForm or ConjureFormItem) nested in this object with targetID
  get(targetID) {
    if (this.formID === targetID) {
      return this;
    }

    // check for target in subforms
    for (let key in this.subforms) {
      if (key === targetID) {
        return this.subforms[key]; // we've found the desired ConjureForm, return it
      } else {
        let result = this.subforms[key].get(targetID); // otherwise, see if this ConjureForm's children has it
        if (result !== false) {
          return result;
        }
      }
    }

    // check for target in items
    for (let key in this.items) {
      if (key === targetID) {
        return this.items[key]; // we found the item
      }
    }

    return false;
  }

  // Update --------------------------------------------------------------------
  /*
    Functions for updating details about the contents of the ConjureForm object
      - updateFormDetails(): updates form details
  */


  // sets this.formDetails.containerType in the right container
  // - newType:     the new type
  // - formID:      unique ID of the form that is being updated (defaults to the current form if no ID given)
  setContainerType(newType, formID = this.formID) {

    // if the current ConjureForm is the one we are looking for, make the change
    if (formID === this.formID) {
      if (__containerTypes.indexOf(newType) >= 0) {
        this.formDetails["containerType"] = newType;
      }

      // otherwise, look at the children to try to find the right ConjureForm
    } else {

      for (let key in this.subforms) {
        this.subforms[key].setContainerType(newType, formID);
      }
    }
  }


  // updates the colors for the the entire ConjureForm tree
  // colors = {background: "", card: "", text: ""}
  //  - color values are hex and get passed to components through HTML style={}
  updateAllColors(colors) {

    let containerType = this.formDetails.containerType;

    // update colors of this ConjureForm
    if (containerType === "all" || containerType === "page") {
      this.colors.backgroundColor = colors.background;
    } else if (containerType === "card") {
      this.colors.backgroundColor = colors.card;
      this.colors.shadowColor = colors.shadow;
    }



    // update the colors of items
    for (let key in this.items) {
      this.items[key].updateColors(colors);
    }

    // make sure all children update their colors
    for (let key in this.subforms) {
      this.subforms[key].updateAllColors(colors);
    }
  }


  // searches ConjureForm tree for the right ConjureForm(item) and updates its details
  // - if ConjureForm: update this.formDetails
  // - if ConjureFormItem: call updateItemDetails()
  // newDetails is a dict {}
  updateSectionDetails(sectionID, newDetails) {

    // if this ConjureForm is the one we are looking for, update this.formDetails
    if (sectionID === this.formID) {

      // overwrite the values specified in newDetails (and preserve untouched ones)
      for (let key in newDetails) {
        this.formDetails[key] = newDetails[key];
      }
      return;
    }

    // check to see if desired section is a ConjureFormItem child of this ConjureForm
    for (let key in this.items) {
      if (key === sectionID) {
        this.items[key].updateItemDetails(newDetails);
        return;
      }
    }

    // otherwise, check subforms for section to update
    for (let key in this.subforms) {
      this.subforms[key].updateSectionDetails(sectionID, newDetails);
    }

  }


  // called to either turn on devMode (to edit the form) or off (to actually use the form in production)
  updateDevMode(newDevMode = true) {
    this.runtime.devModeOn = newDevMode;
    for (let key in this.subforms) {
      this.subforms[key].updateDevMode(newDevMode);
    }
    for (let key in this.items) {
      this.items[key].updateDevMode(newDevMode);
    }
  }


  // Form Output ---------------------------------------------------------------
  /*
    Functions for converting a ConjureForm tree into a JS object with the end output of a form
  */


  // creates an output object (what the result of a user filling out a ConjureForm looks like)
  // but uses formIDs rather than outputIDs
  getOutputObjectWithFormIDs(outputObject = {}) {
    for (let key in this.subforms) {
      outputObject[key] = this.subforms[key].getOutputObjectWithFormIDs();
    }
    return outputObject;
  }


  // creates a lookup table {formID/itemID: form/itemDetails}
  getFormDetailsLookupTable(conversions = {}) {
    conversions[this.formID] = this.formDetails;
    for (let key in this.subforms) {
      conversions = this.subforms[key].getFormDetailsLookupTable(conversions);
    }
    for (let key in this.items) {
      conversions[key] = this.items[key].getItemDetails();
    }
    return conversions;
  }

  // UX ------------------------------------------------------------------------
  /*
    Functions for dealing with User Interactions
     - registerOnClick():   function gets passed in from <App/> that gets run in onClick

  */


  // sets the onClick function that the user interacts with
  // If the current ConjureForm isn't the form we are looking for, try its children
  // -> this works with both ConjureForm and ConjureFormItem type objects
  registerOnClickSelectForm(onClickFunction, formID = this.formID) {
    if (formID === this.formID) {
      this.onClick_selectForm = onClickFunction;
    } else {

      // try subforms
      for (let key in this.subforms) {
        this.subforms[key].registerOnClickSelectForm(onClickFunction, formID);
      }

      // try items
      for (let key in this.items) {
        if (formID === key) {
          this.items[key].registerOnClickSelectItem(onClickFunction);
        }
      }
    }
  }


  // goes through entire ConjureForm tree and ConjureFormItem children
  // - if id === selectedID: -> set .runtime.selected = true;
  // - else: -> set .runtime.selected = false
  // end result: only 1 section is selected
  updateSelectedFormSection = (selectedID = null) => {
    if (this.formID === selectedID) {
      this.runtime.selected = true;
    } else {
      this.runtime.selected = false;
    }

    // run on subforms
    for (let key in this.subforms) {
      this.subforms[key].updateSelectedFormSection(selectedID);
    }

    // run on items
    for (let key in this.items) {
      this.items[key].updateSelectedSection(selectedID);
    }
  }


  // Export --------------------------------------------------------------------
  /*
    Functions for converting the class into other usable formats
     - JSON
     - render
  */

  // just dumps the contents of this ConjureForm into an object
  dumpToJSON() {
    return {
      "subforms": this.subforms,
      "items": this.items,
      "order": this.order,
      "formDetails": this.formDetails,
      "formID": this.formID
    }
  }


  render() {
    return (
      <ConjureFormComponent
        subforms={this.subforms}
        items={this.items}
        order={this.order}
        formDetails={this.formDetails}
        containerType={this.formDetails.containerType}
        formID={this.formID}
        backgroundColor={this.colors.backgroundColor}
        selected={this.runtime.selected}
        shadowColor={this.colors.shadowColor}
        onClick_selectForm={this.onClick_selectForm}
      />
    );
  }
}

export default ConjureForm;
