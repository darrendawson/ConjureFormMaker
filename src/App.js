import React, { Component } from 'react';
import './App.css';


// Components
import Navbar from './Components/Navbar/Navbar.js';
import FormSidebar from './Components/FormSidebar/FormSidebar.js';
import ModifyFormContainer from './Components/ModifyFormContainer/ModifyFormContainer.js';

// Ustra - for app.state management
import Ustra from './Ustra';

import ConjureForm from './ConjureForm/ConjureForm.js';



// =============================================================================
// Ustra
// =============================================================================

// pathTags
const PT_formData = "formData";
const PT_selectedFormSection = "selectedFormSection";

const PT_conjureForm = "conjureForm";
const PT_selectedFormID = "selectedFormArea";
const PT_formColors = "formColors";

const defaultColors = {
  "background": "#eaeaea",
  "card": "#f4f4f4",
  "shadow": "#7c7c7c",
  "text": "#262626",
  "title": "#262626"
};


// what App.state will look like
let dataSkeleton = {
  [PT_conjureForm]: {},
  [PT_selectedFormID]: false,
  [PT_formColors]: defaultColors
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

    // add Cards to page 1
    let card1ID = conjureForm.declareNewSubform(page1ID);
    let card2ID = conjureForm.declareNewSubform(page1ID);

    // add items to card1
    let item1ID = conjureForm.declareNewItem(card1ID, "text");

    conjureForm.declareNewItem(card2ID, "text");
    conjureForm.declareNewItem(card2ID, "question");

    this.saveConjureForm(conjureForm);

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

  // takes an updated conjureForm and saves it to ustra
  // -> calls conjureForm.updateAllColors() in order to keep the color scheme up to date
  saveConjureForm = (conjureForm) => {
    conjureForm.updateAllColors(this.state.truth[PT_formColors]);
    this.update(conjureForm, PT_conjureForm);
  }


  // ConjureForm ---------------------------------------------------------------

  onClick_selectFormSection = (selectedID) => {
    this.update(selectedID, PT_selectedFormID);
    let conjureForm = this.state.truth[PT_conjureForm];
    conjureForm.updateSelectedFormSection(selectedID);
    this.saveConjureForm(conjureForm);
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
      let newID = conjureForm.declareNewItem(selectedID, "question", null, createPre);
      conjureForm.updateSelectedFormSection(newID);
      this.update(newID, PT_selectedFormID);

    } else {
      // insert adjacent -> we need the parent
      let containerID = conjureForm.getParentFormID(selectedID);
      let newID = conjureForm.declareNewItem(containerID, "question", selectedID, createPre);
      conjureForm.updateSelectedFormSection(newID);
      this.update(newID, PT_selectedFormID);
    }
    this.saveConjureForm(conjureForm);
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
      let newID = conjureForm.declareNewItem(selectedID, "text", null, createPre);
      conjureForm.updateSelectedFormSection(newID);
      this.update(newID, PT_selectedFormID);

    } else {
      // insert adjacent -> we need the parent
      let containerID = conjureForm.getParentFormID(selectedID);
      let newID = conjureForm.declareNewItem(containerID, "text", selectedID, createPre);
      conjureForm.updateSelectedFormSection(newID);
      this.update(newID, PT_selectedFormID);
    }
    this.saveConjureForm(conjureForm);
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
      let newID = conjureForm.declareNewSubform(selectedID, null, createPre);
      conjureForm.updateSelectedFormSection(newID);
      this.update(newID, PT_selectedFormID);

    } else {
      // insert adjacent -> we need the parent
      let containerID = conjureForm.getParentFormID(selectedID);
      let newID = conjureForm.declareNewSubform(containerID, selectedID, createPre);
      conjureForm.updateSelectedFormSection(newID);
      this.update(newID, PT_selectedFormID);
    }
    this.saveConjureForm(conjureForm);
  }


  // deletes a form section from existance
  onClick_deleteFormSection = (itemID) => {
    let conjureForm = this.state.truth[PT_conjureForm];
    conjureForm.delete(itemID);
    this.saveConjureForm(conjureForm);
    this.update(false, PT_selectedFormID);
  }

  updateFormColors = (newColors) => {
    this.update(newColors, PT_formColors);
    this.saveConjureForm(this.state.truth[PT_conjureForm]);
  }

  // calls ConjureForm.updateSectionDetails() to update values in ConjureForm.formDetails or ConjureFormItem.textDetails/questionDetails
  onClick_updateFormSectionDetails = (sectionID, newDetails) => {
    let conjureForm = this.state.truth[PT_conjureForm];
    conjureForm.updateSectionDetails(sectionID, newDetails);
    this.saveConjureForm(conjureForm);
  }


  // render --------------------------------------------------------------------


  renderSidebar = () => {

    let truth = this.state.truth;
    let conjureForm = truth[PT_conjureForm];
    let selectedSectionID = truth[PT_selectedFormID]
    let selectedSection = conjureForm.get(selectedSectionID);

    let parentID = conjureForm.getParentFormID(selectedSectionID);
    let parentContainerType = false;
    if (parentID) {
      let parentContainer = conjureForm.get(parentID);
      parentContainerType = parentContainer.formDetails.containerType;
    }


    let formOutputObject = conjureForm.getOutputObjectWithFormIDs();
    let formDetailsLookup = conjureForm.getFormDetailsLookupTable();

    return (
      <FormSidebar
        selectedID={truth[PT_selectedFormID]}
        selectedSection={selectedSection}
        parentContainerType={parentContainerType}
        formColors={truth[PT_formColors]}
        updateColors={this.updateFormColors}
        formOutputObject={formOutputObject}
        formDetailsLookup={formDetailsLookup}
        onClick_deselectItem={() => this.onClick_selectFormSection(false)}
        onClick_selectFormSection={this.onClick_selectFormSection}
        onClick_createNewFormText={this.onClick_createNewFormText}
        onClick_createNewFormQuestion={this.onClick_createNewFormQuestion}
        onClick_createNewFormSection={this.onClick_createNewFormSection}
        onClick_deleteFormSection={this.onClick_deleteFormSection}
        onClick_updateFormSectionDetails={this.onClick_updateFormSectionDetails}
      />
    );
  }


  render() {
    let truth = this.state.truth;
    let conjureForm = truth[PT_conjureForm];

    return (
      <div id="App">
        <Navbar/>

        <div id='body_container'>

          <div id='left_body_container'>
            <ModifyFormContainer
              conjureForm={conjureForm}
              backgroundColor={truth[PT_formColors]['background']}
              onClick_deselectItem={() => this.onClick_selectFormSection(false)}
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
