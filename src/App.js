import React, { Component } from 'react';
import './App.css';


// Components
import Navbar from './Components/Navbar/Navbar.js';
import ModifyFormSidebar from './Components/ModifyFormSidebar/ModifyFormSidebar.js';
import ModifyFormContainer from './Components/ModifyFormContainer/ModifyFormContainer.js';
import ProductionFormContainer from './Components/ProductionFormContainer/ProductionFormContainer.js';
import ProductionFormSidebar from './Components/ProductionFormSidebar/ProductionFormSidebar.js';

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

const PT_devModeActive = "devModeActive";
const PT_productionSidebarExpanded = "productionSidebarExpanded";

const PT_formOutput = "formOutput";
const PT_currentPageIndex = "currentPageIndex";


// what App.state will look like
let dataSkeleton = {
  [PT_conjureForm]: {},
  [PT_selectedFormID]: false,
  [PT_devModeActive]: true,
  [PT_productionSidebarExpanded]: false,
  [PT_formOutput]: {},
  [PT_currentPageIndex]: 0
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

    // create Page 1 and page 2
    let page1ID = conjureForm.declareNewSubform();
    let page2ID = conjureForm.declareNewSubform();

    // add Cards to page 1
    let card1ID = conjureForm.declareNewSubform(page1ID);
    let card2ID = conjureForm.declareNewSubform(page1ID);

    // add items to card1
    conjureForm.declareNewItem(card1ID, "text");
    conjureForm.declareNewItem(card1ID, "question");

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
  saveConjureForm = (conjureForm) => {
    let conjureFormOutput = conjureForm.getFormOutputObject();
    this.update(conjureForm, PT_conjureForm);
    this.update(conjureFormOutput, PT_formOutput);
  }


  // ConjureForm ---------------------------------------------------------------

  onClick_selectFormSection = (selectedID) => {
    if (this.state.truth[PT_devModeActive]) {
      this.update(selectedID, PT_selectedFormID);
    }
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
      this.update(newID, PT_selectedFormID);

    } else {
      // insert adjacent -> we need the parent
      let containerID = conjureForm.getParentFormID(selectedID);
      let newID = conjureForm.declareNewItem(containerID, "question", selectedID, createPre);
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
      this.update(newID, PT_selectedFormID);

    } else {
      // insert adjacent -> we need the parent
      let containerID = conjureForm.getParentFormID(selectedID);
      let newID = conjureForm.declareNewItem(containerID, "text", selectedID, createPre);
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
      this.update(newID, PT_selectedFormID);

    } else {
      // insert adjacent -> we need the parent
      let containerID = conjureForm.getParentFormID(selectedID);
      let newID = conjureForm.declareNewSubform(containerID, selectedID, createPre);
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

  // calls ConjureForm.updateSectionDetails() to update values in ConjureForm.formDetails or ConjureFormItem.textDetails/questionDetails
  onClick_updateFormSectionDetails = (sectionID, newDetails) => {
    let conjureForm = this.state.truth[PT_conjureForm];
    conjureForm.updateSectionDetails(sectionID, newDetails);
    this.saveConjureForm(conjureForm);
  }

  //
  onClick_updateFormAppearances = (sectionID, newAppearances) => {

    // update appearances
    let conjureForm = this.state.truth[PT_conjureForm];
    conjureForm.updateSectionAppearances(sectionID, newAppearances);
    this.saveConjureForm(conjureForm);

    // if applicable, update styles
    if (("styleID" in newAppearances) && (newAppearances['styleID'] !== '') && (newAppearances['styleRoot'] === true)) {
      this.onClick_updateFormStyles(newAppearances['styleID'], newAppearances);
    }
  }


  // pass in an updated ConjureFormItem object to replace its existing rendition in the ConjureForm tree
  onClick_updateWholeSection = (updatedSection) => {
    let conjureForm = this.state.truth[PT_conjureForm];
    conjureForm.updateWholeSection(updatedSection.getConjureID(), updatedSection);
    this.saveConjureForm(conjureForm);
  }


  // updates form styles, which will update appearances of all forms with that style
  onClick_updateFormStyles = (styleID, styleObject) => {
    let conjureForm = this.state.truth[PT_conjureForm];
    conjureForm.updateFormStyles(styleID, styleObject);
    this.saveConjureForm(conjureForm);
  }



  // sets dev mode and toggles devMode flag on ConjureForm tree
  //  - true:  renders <ProductionFormContainer/>
  //  - false: renders <ModifyFormContainer/>
  onClick_setDevModeActive = (newDevMode) => {
    if (this.state.truth[PT_devModeActive] !== newDevMode) {

      let conjureForm = this.state.truth[PT_conjureForm];

      this.update(newDevMode, PT_devModeActive);          // assign new devmode
      this.update(false, PT_productionSidebarExpanded);   // reset the sidebar if it was open
      this.update(false, PT_selectedFormID);              // deselect selected section (if any)

      // wipe the current "outputObject" and reinitialize values
      let outputObject = conjureForm.getFormOutputObject();
      this.update(outputObject, PT_formOutput);

      // save changes to ConjureForm
      this.saveConjureForm(conjureForm);

      // reset page to 0
      this.update(0, PT_currentPageIndex);
    }
  }


  // ConjureForm in Production -------------------------------------------------
  /*
    Functions that get passed to ConjureForms so that they can fill out the result object properly when a user answers the form
  */

  onInput_answerFormQuestion = (itemID, value) => {
    let formOutput = this.state.truth[PT_formOutput];
    formOutput.answerInputQuestion(value, itemID);
    this.update(formOutput, PT_formOutput);
  }

  onClick_answerMultipleChoiceQuestion = (value, itemID) => {
    let formOutput = this.state.truth[PT_formOutput];
    formOutput.answerMultipleChoiceQuestion(value, itemID);
    this.update(formOutput, PT_formOutput);
  }

  onClick_addNewSubformToArray = (arrayID) => {
    let formOutput = this.state.truth[PT_formOutput];
    formOutput.declareNewArrayItem(arrayID);
    this.update(formOutput, PT_formOutput);
  }

  onClick_removeSubformFromArray = (arrayID, subformIndex) => {
    let formOutput = this.state.truth[PT_formOutput];
    formOutput.removeArrayItem(arrayID, subformIndex);
    this.update(formOutput, PT_formOutput);
  }


  onClick_moveToPage = (moveType) => {
    let newPageNum = this.state.truth[PT_currentPageIndex];
    if (moveType === "next") {
      newPageNum += 1;
    } else if (moveType === "prev" && newPageNum > 0){
      newPageNum -= 1;
    }
    this.update(newPageNum, PT_currentPageIndex);
  }


  // Load ConjureForm ----------------------------------------------------------
  /*
    Functions for loading a ConjureForm in from a JSON object
  */

  // obj is a JSON.parse()'ed object
  // we want to create a new ConjureForm and load the data into it
  loadConjureForm = (obj) => {

    // create ConjureForm
    let conjureForm = new ConjureForm();
    conjureForm.loadConjureForm(obj);

    // save
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

    // get form styles
    let formStyles = conjureForm.formStyles;
    let styleNames = [];
    for (let key in formStyles) {
      styleNames.push(key);
    }

    if (truth[PT_devModeActive]) {
      return (
        <div id='right_body_container_expanded'>
          <ModifyFormSidebar
            selectedID={truth[PT_selectedFormID]}
            selectedSection={selectedSection}
            parentContainerType={parentContainerType}
            formOutput={truth[PT_formOutput]}
            formStyles={styleNames}
            onClick_deselectItem={() => this.onClick_selectFormSection(false)}
            onClick_selectFormSection={this.onClick_selectFormSection}
            onClick_createNewFormText={this.onClick_createNewFormText}
            onClick_createNewFormQuestion={this.onClick_createNewFormQuestion}
            onClick_createNewFormSection={this.onClick_createNewFormSection}
            onClick_deleteFormSection={this.onClick_deleteFormSection}
            onClick_updateFormSectionDetails={this.onClick_updateFormSectionDetails}
            onClick_updateFormAppearances={this.onClick_updateFormAppearances}
            onClick_updateWholeSection={this.onClick_updateWholeSection}
            onClick_createNewStyle={this.onClick_updateFormStyles}
          />
        </div>
      );
    } else {

      let rightBodyCSS = "right_body_container_retracted";
      if (truth[PT_productionSidebarExpanded]) {
        rightBodyCSS = "right_body_container_expanded";
      }


      return (
        <div id={rightBodyCSS}>
          <ProductionFormSidebar
            formOutput={truth[PT_formOutput]}
            sidebarExpanded={truth[PT_productionSidebarExpanded]}
            sidebarExpandedTag={PT_productionSidebarExpanded}
            onClick_setDevModeActive={this.onClick_setDevModeActive}
            update={this.update}
          />
        </div>
      );
    }

  }


  renderFormContainer = () => {
    let truth = this.state.truth;
    let conjureForm = truth[PT_conjureForm];
    let formOutput = truth[PT_formOutput];

    if (truth[PT_devModeActive]) {
      return (
        <div id='left_body_container_retracted'>
          <ModifyFormContainer
            conjureForm={conjureForm}
            formOutput={formOutput}
            devModeOn={truth[PT_devModeActive]}
            selectedID={truth[PT_selectedFormID]}
            onClick_selectFormSection={this.onClick_selectFormSection}
            onClick_deselectItem={() => this.onClick_selectFormSection(false)}
            onClick_setDevModeActive={this.onClick_setDevModeActive}
            onClick_loadConjureForm={this.loadConjureForm}
          />
        </div>
      );
    } else {

      let leftBodyCSS = "left_body_container_expanded";
      if (truth[PT_productionSidebarExpanded]) {
        leftBodyCSS = "left_body_container_retracted";
      }

      return (
        <div id={leftBodyCSS}>
          <ProductionFormContainer
            conjureForm={conjureForm}
            formOutput={formOutput}
            currentPageIndex={truth[PT_currentPageIndex]}
            onClick_deselectItem={() => this.onClick_selectFormSection(false)}
            onInput_answerFormQuestion={this.onInput_answerFormQuestion}
            onClick_answerMultipleChoiceQuestion={this.onClick_answerMultipleChoiceQuestion}
            onClick_addNewSubformToArray={this.onClick_addNewSubformToArray}
            onClick_removeSubformFromArray={this.onClick_removeSubformFromArray}
            onClick_moveToPage={this.onClick_moveToPage}
          />
        </div>
      );
    }

  }


  // renders <App/> ------------------------------------------------------------

  render() {
    return (
      <div id="App">
        <Navbar/>

        <div id='body_container'>
          {this.renderFormContainer()}
          {this.renderSidebar()}
        </div>
      </div>
    );
  }

}

export default App;
