import React, { Component } from 'react';
import './App.css';


// Components
import Navbar from './Components/Navbar/Navbar.js';
import FormOutputSidebar from './Components/FormOutputSidebar/FormOutputSidebar.js';

// Ustra - for app.state management
import Ustra from './Ustra';

// Colors
import ColorPicker from './ColorPicker.js';
let COLORS = new ColorPicker('green-blue', 'orange');



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
  pagesOrder: ["aboutForm", "submit"],
  pages: {
    "aboutForm": {},
    "submit": {}
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
    return (
      <div id="App">
        <Navbar
          colors={COLORS}
        />

        <div id='body_container'>

          <div id='left_body_container'>
            <p>{JSON.stringify(this.state.truth[PT_formData])}</p>
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
