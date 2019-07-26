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

class ConjureForm {

  constructor(formID = null) {
    this.subforms = {};
    this.items = {};
    this.order = [];
    this.formDetails = {"containerType": ""};
    this.formID = (formID !== null) ? formID : this.getNewUniqueID();

    this.onClick_selectForm = function() {};
  }


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
    let newForm = new ConjureForm(newID);

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


  // Get -----------------------------------------------------------------------
  /*
    Functions for retrieving info from (nested) ConjureForms / ConjureFormItems
  */


  // searches for object (either ConjureForm or ConjureFormItem) nested in this object with targetID
  get(targetID) {
    if (this.formID === targetID) {
      return;
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

        onClick_selectForm={this.onClick_selectForm}
      />
    );
  }
}

export default ConjureForm;
