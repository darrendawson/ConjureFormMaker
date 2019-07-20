import React, { Component } from 'react';
import './App.css';


// Components
import Navbar from './Components/Navbar/Navbar.js';
import FormOutputSidebar from './Components/FormOutputSidebar/FormOutputSidebar.js';
import FormMakerPage from './Components/FormMakerPage/FormMakerPage.js';
import FormItemSidebar from './Components/FormItemSidebar/FormItemSidebar.js';

// Ustra - for app.state management
import Ustra from './Ustra';

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

// what App.state will look like
let dataSkeleton = {
  [PT_formData]: fakeFormData,
  [PT_selectedFormSection]: false
}

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



  // - location: points to the location of the currently selected location
  //             creates a new item right after this one!
  createNewFormItem = (location) => {

    // 1) get unique key for new item
    let form = this.state.truth[PT_formData];
    let formItem = this.getFormItemByLocation(form, location);
    alert(JSON.stringify(formItem));
    //let newKey = this.getNewKeyForItem();

    //alert(JSON.stringify(location));
  }



  // gets a new random (unique) key for an item
  getNewKeyForItem = (usedKeys) => {

    const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    while (true) {
      let newID = "";
      for (let i = 0; i < 5; i++) {
        newID += possible.charAt(Math.floor(Math.random() * possible.length));
      }

      // make sure that the ID is new before sending it back
      if (! (newID in usedKeys)) {
        return newID;
      }
    }
  }

  // render --------------------------------------------------------------------


  renderSidebar = () => {
    let truth = this.state.truth;

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

    return (
      <div id="App">
        <Navbar
          colors={COLORS}
        />

        <div id='body_container'>

          <div id='left_body_container'>
            <FormMakerPage
              formData={truth[PT_formData]}
              formDataTag={PT_formData}
              createNewFormItem={this.createNewFormItem}
              selectedSection={truth[PT_selectedFormSection]}
              selectedSectionTag={PT_selectedFormSection}
              colors={COLORS}
              update={this.update}
            />
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
