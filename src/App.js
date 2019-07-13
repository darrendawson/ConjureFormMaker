import React, { Component } from 'react';
import './App.css';


// Components
import Navbar from './Components/Navbar/Navbar.js';
import FormOutputSidebar from './Components/FormOutputSidebar/FormOutputSidebar.js';
import FormMakerPage from './Components/FormMakerPage/FormMakerPage.js';

// Ustra - for app.state management
import Ustra from './Ustra';

// Colors
import ColorPicker from './ColorPicker.js';
let COLORS = new ColorPicker('green-blue', 'lightgrey');



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
          "itemOrder": ["sectionTitle", "sectionDescription"],
          "items": {
            "sectionTitle": {"itemType": "sectionTitle", "value": "Test"},
            "sectionDescription": {"itemType": "text", "value": "Description"}
          }
        },

        "secondSection": {
          "itemOrder": ["item1"],
          "items": {
            "item1": {"itemType": "sectionTitle", "value": "Test 2"}
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
let PT_formData = "formData";

// what App.state will look like
let dataSkeleton = {
  [PT_formData]: fakeFormData
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

  // render --------------------------------------------------------------------

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
              colors={COLORS}
              update={this.update}
            />
          </div>

          <div id='right_body_container'>
            <FormOutputSidebar
              colors={COLORS}
            />
          </div>

        </div>
      </div>
    );
  }

}

export default App;
