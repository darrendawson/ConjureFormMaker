import React, { Component } from 'react';
import './App.css';


// Components
import Navbar from './Components/Navbar/Navbar.js';
import FormOutputSidebar from './Components/FormOutputSidebar/FormOutputSidebar.js';
import FormMakerPage from './Components/FormMakerPage/FormMakerPage.js';
import FormItemSidebar from './Components/FormItemSidebar/FormItemSidebar.js';
import FormSidebar from './Components/FormSidebar/FormSidebar.js';

// Ustra - for app.state management
import Ustra from './Ustra';

import ConjureForm from './ConjureForm/ConjureForm.js';

// Colors
import ColorPicker from './ColorPicker.js';
let COLORS = new ColorPicker('green-blue', 'lightgrey', 'orange');



// =============================================================================
// Fake Data
// =============================================================================
/*
  Data takes the form of: {
    pagesOrder: [pageKey],                      <--- order of form that that page keys appear in
    pages: {pageKey: {pageDetails...}}          <--- details about pages
  }
*/


//
let fakeFormData = {
  pageOrder: ["aboutForm"],
  pages: {
    "aboutForm": {
      "sectionOrder": ["aboutSectionCard", "secondSection"],
      "sections": {
        "aboutSectionCard": {
          "itemOrder": ["sectionTitle"],
          "items": {
            "sectionTitle": {"itemType": "text", "sectionTitle": "Test", "title": "regular title", "description": "description..."}
          }
        },

        "secondSection": {
          "itemOrder": ["item1"],
          "items": {
            "item1": {"itemType": "text", "sectionTitle": "Test", "title": "", "description": ""}
          }
        }
      }
    }
  }
}


// =============================================================================
// Ustra
// =============================================================================

// pathTags
const PT_formData = "formData";
const PT_selectedFormSection = "selectedFormSection";

const PT_conjureForm = "conjureForm";
const PT_selectedFormID = "selectedFormArea";

// what App.state will look like
let dataSkeleton = {
  [PT_formData]: fakeFormData,
  [PT_selectedFormSection]: false,

  [PT_conjureForm]: {},
  [PT_selectedFormID]: false
}

// ConjureForm vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv

let conjureFormEmpty = new ConjureForm();

dataSkeleton[PT_conjureForm] = conjureFormEmpty;

// ConjureForm ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

// ininitialize USTRA
var ustra = new Ustra(dataSkeleton);


// =============================================================================
// <App/>
// =============================================================================

class App extends Component {

  constructor() {
    super();

    this.state = {
      truth: ustra.get_truth()
    };

    // ConjureForm vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv

    let conjureForm = new ConjureForm();
    conjureForm.registerOnClickSelectForm(this.onClick_selectFormSection);

    // create Page 1 and page 2
    let page1ID = conjureForm.declareNewSubform();
    let page2ID = conjureForm.declareNewSubform();
    conjureForm.setContainerType("page", page1ID);
    conjureForm.setContainerType("page", page2ID);

    // add Cards to page 1
    let card1ID = conjureForm.declareNewSubform(page1ID);
    let card2ID = conjureForm.declareNewSubform(page1ID);
    conjureForm.setContainerType("card", card1ID);
    conjureForm.setContainerType("card", card2ID);

    // add items to card1
    let item1ID = conjureForm.declareNewItem(card1ID, "text");
    let item2ID = conjureForm.declareNewItem(card1ID);


    this.update(conjureForm, PT_conjureForm);

    // ConjureForm ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  }

  // Update USTRA --------------------------------------------------------------
  /*
    Functions for updating information
      -> pass updates to ustra, use results to update app.state
  */

  update = (value, path_tag) => {
    let new_state = ustra.update(value, path_tag);
    this.setState({
      truth: new_state
    });
  }


  // Form Data -----------------------------------------------------------------
  /*
    Functions for dealing with Form data
  */

  // formData is stored as a large JS object (a dict)
  // therefore, any item in the form can be reached using an array of keys
  // -> following this path of keys will bring you to the item
  // this function returns an item from a form when given a location
  getFormItemByLocation = (form, location) => {
    let temp = form;

    for (let i = 0; i < location.length; i++) {
      let nextLocation = location[i];

      // right now, items are ALWAYS nested as: page.section.item
      // this is sloppy and will break when we add optional subsections (page.section.[subsection].item)
      // FIX THIS later
      if (i === 0) {
        temp = temp["pages"][nextLocation];
      } else if (i === 1) {
        temp = temp["sections"][nextLocation];
      } else if (i === 2) {
        temp = temp["items"][nextLocation];
      }
    }

    return temp;
  }

  // this function lets you update an individual form item in the overall app.state.truth.formData
  updateFormItem = (newItem, location) => {

    // location doesn't include the page / section / item keys used by App.state.truth.formData
    // ex:
    // - a form item is at: (app.state...)pages.PAGE_NAME.sections.SECTION_NAME.items.ITEM_NAME
    // - location will appear as [PAGE_NAME, SECTION_NAME, ITEM_NAME]
    // We use fullLocation to include these page/section/item keys that are missing
    let fullLocation = [];

    // function we will use to grab a subobject at a certain location in a larger object
    // ex: in an object {a: {b: {c: ""}}}, we can get
    // - (all)    - getObjectAtLocation(object, [])
    // - (a)      - getObjectAtLocation(object, ["a"])
    // - (a.b)    - getObjectAtLocation(object, ["a", "b"])
    let getObjectAtLocation = function(obj, location) {
      let temp = obj;
      for (let i = 0; i < location.length; i++) {
        let nextLocation = location[i];
        temp = temp[nextLocation];
      }
      return temp;
    }

    // 1) build up fullLocation path
    for (let i = 0; i < location.length; i++) {

      // right now, items are ALWAYS nested as: page.section.item
      // this is sloppy and will break when we add optional subsections (page.section.[subsection].item)
      // FIX THIS later
      if (i === 0) {
        fullLocation.push("pages");
      } else if (i === 1) {
        fullLocation.push("sections");
      } else if (i === 2) {
        fullLocation.push("items");
      }

      fullLocation.push(location[i]);
    }


    // 2) looping from most specific location (a.b.c.d...x) backwards to most general location (a),
    //    assign values so the
    let updatedValue = newItem;
    for (let i = fullLocation.length - 1; i >= 0; i--) {
      let currentLocation = fullLocation.slice(0, i);                                         // get the location up to this point in the total object
      let largerObject = getObjectAtLocation(this.state.truth[PT_formData], currentLocation); // get the object
      let currentParameter = fullLocation[i];                                                 // largerObject[currentParameter] is the value we are trying to modify
      largerObject[currentParameter] = updatedValue;
      updatedValue = largerObject;
    }

    // updatedValue now stores the fully updated form
    this.update(updatedValue, PT_formData);
  }



  // ConjureForm ---------------------------------------------------------------

  onClick_selectFormSection = (selectedID) => {
    this.update(selectedID, PT_selectedFormID);

    //let conjureForm = this.state.truth[PT_conjureForm];
    //console.log(conjureForm.get(selectedID));
  }

  // creates a new ConjureFormItem (question) in ConjureForm with selectedID
  // createPre:     a boolean (if true, insert the new text item before the current one in the order)
  // selectedID:    ID of the ConjureForm/ConjureFormItem that is selected
  //                -> therefore, we may need to get its parent when inserting a new item (depending on insertInto)
  // insertInto:    boolean
  //                -> if true, insert into the current ConjureForm
  //                -> if false, insert into the current ConjureForm's parent
  onClick_createNewFormQuestion = (selectedID, createPre, insertInto) => {
    let conjureForm = this.state.truth[PT_conjureForm];

    if (insertInto) {
      // insert into -> we don't need the parent
      conjureForm.declareNewItem(selectedID, "question", null, createPre);

    } else {
      // insert adjacent -> we need the parent
      let containerID = conjureForm.getParentFormID(selectedID);
      conjureForm.declareNewItem(containerID, "question", selectedID, createPre);
    }
    this.update(conjureForm, PT_conjureForm);
  }

  // creates a new ConjureFormItem (text) in ConjureForm with selectedID
  // createPre:     a boolean (if true, insert the new text item before the current one in the order)
  // selectedID:    ID of the ConjureForm/ConjureFormItem that is selected
  //                -> therefore, we may need to get its parent when inserting a new item (depending on insertInto)
  // insertInto:    boolean
  //                -> if true, insert into the current ConjureForm
  //                -> if false, insert into the current ConjureForm's parent
  onClick_createNewFormText = (selectedID, createPre, insertInto) => {

    let conjureForm = this.state.truth[PT_conjureForm];

    if (insertInto) {
      // insert into -> we don't need the parent
      conjureForm.declareNewItem(selectedID, "text", null, createPre);

    } else {
      // insert adjacent -> we need the parent
      let containerID = conjureForm.getParentFormID(selectedID);
      conjureForm.declareNewItem(containerID, "text", selectedID, createPre);
    }
    this.update(conjureForm, PT_conjureForm);
  }



  // creates a new ConjureFormItem (text) in ConjureForm with selectedID
  // createPre:     a boolean (if true, insert the new text item before the current one in the order)
  // selectedID:    ID of the ConjureForm/ConjureFormItem that is selected
  //                -> therefore, we may need to get its parent when inserting a new item (depending on insertInto)
  // insertInto:    boolean
  //                -> if true, insert into the current ConjureForm
  //                -> if false, insert into the current ConjureForm's parent
  onClick_createNewFormSection = (selectedID, createPre, insertInto) => {

    let conjureForm = this.state.truth[PT_conjureForm];

    if (insertInto) {
      // insert into -> we don't need the parent
      conjureForm.declareNewSubform(selectedID, null, createPre);

    } else {
      // insert adjacent -> we need the parent
      let containerID = conjureForm.getParentFormID(selectedID);
      conjureForm.declareNewSubform(containerID, selectedID, createPre);
    }
    this.update(conjureForm, PT_conjureForm);
  }

  // render --------------------------------------------------------------------


  renderSidebar = () => {

    let truth = this.state.truth;
    let conjureForm = truth[PT_conjureForm];
    let selectedSectionID = truth[PT_selectedFormID]
    let selectedSection = conjureForm.get(selectedSectionID);

    return (
      <FormSidebar
        selectedID={truth[PT_selectedFormID]}
        selectedSection={selectedSection}
        onClick_deselectItem={() => this.onClick_selectFormSection(false)}
        onClick_createNewFormText={this.onClick_createNewFormText}
        onClick_createNewFormQuestion={this.onClick_createNewFormQuestion}
        onClick_createNewFormSection={this.onClick_createNewFormSection}
      />
    );

    //
    if (truth[PT_selectedFormSection] !== false) {

      let formItem = this.getFormItemByLocation(truth[PT_formData], truth[PT_selectedFormSection]);

      return (
        <FormItemSidebar
          formItem={formItem}
          selectedItemTag={PT_selectedFormSection}
          updateFormItem={this.updateFormItem}
          updateFormItemLocation={truth[PT_selectedFormSection]}
          update={this.update}
          colors={COLORS}
        />
      );
    } else {
      return (
        <FormOutputSidebar
          colors={COLORS}
        />
      );
    }
  }


  render() {
    let truth = this.state.truth;
    let conjureForm = truth[PT_conjureForm];

    return (
      <div id="App">
        <Navbar
          colors={COLORS}
        />

        <div id='body_container'>

          <div id='left_body_container'>
            {/*
            <FormMakerPage
              formData={truth[PT_formData]}
              formDataTag={PT_formData}
              createNewFormItem={this.createNewFormItem}
              selectedSection={truth[PT_selectedFormSection]}
              selectedSectionTag={PT_selectedFormSection}
              colors={COLORS}
              update={this.update}
            />
            */}
            <div style={{'display': 'flex', 'flex-direction': 'column', 'width': '100%'}}>
              {conjureForm.render()}
            </div>
          </div>

          <div id='right_body_container'>
            {this.renderSidebar()}
          </div>

        </div>
      </div>
    );
  }

}

export default App;
