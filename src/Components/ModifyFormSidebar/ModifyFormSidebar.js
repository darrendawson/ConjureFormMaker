import React, { Component } from 'react';
import './ModifyFormSidebar.css';

import DevFormItemInput from '../../ConjureForm/DevInputDetails/DevFormItemInput.js';
import DevFormInput from '../../ConjureForm/DevInputDetails/DevFormInput.js';


class FormSidebar extends Component {

  constructor() {
    super();

    this.state = {
      createNewFormBarOpen: false,
      insertPre: false,
      insertInto: true
    }
  }


  // Input ---------------------------------------------------------------------

  // when a user inputs a new color
  onInput_updateColor = (colorType, e) => {
    let colors = this.props.formColors;
    colors[colorType] = e.target.value;
    this.props.updateColors(colors);
  }

  onClick_deselectItem = () => {
    this.props.onClick_deselectItem();
    this.setState({createNewFormBarOpen: false});
  }

  onClick_insertNewSection = (sectionType) => {
    if (sectionType === "question") {
      this.props.onClick_createNewFormQuestion(this.props.selectedID, this.state.insertPre, this.state.insertInto)
    } else if (sectionType === "text") {
      this.props.onClick_createNewFormText(this.props.selectedID, this.state.insertPre, this.state.insertInto)
    } else if (sectionType === "ConjureForm") {
      this.props.onClick_createNewFormSection(this.props.selectedID, this.state.insertPre, this.state.insertInto)
    }

    this.setState({createNewFormBarOpen: false});
  }

  // Render --------------------------------------------------------------------

  renderDevFormInput = () => {


    let selectedSection = this.props.selectedSection;

    // make sure there is a selectedSection to render
    if (!selectedSection) {
      return;
    }

    // otherwise, render Inputs so user can modify ConjureForm / ConjureFormItem details
    if (selectedSection.getClassName() === "ConjureForm") {
      return (
        <DevFormInput
          formDetails={selectedSection.formDetails}
          selectedID={selectedSection.formID}
          formOutput={this.props.formOutput}
          onClick_updateFormSectionDetails={this.props.onClick_updateFormSectionDetails}
          onClick_selectFormSection={this.props.onClick_selectFormSection}
        />
      );
    } else if (selectedSection.getClassName() === "ConjureFormItem") {
      return (
        <DevFormItemInput
          itemType={selectedSection.itemType}
          itemDetails={selectedSection.getItemDetails()}
          selectedID={selectedSection.itemID}
          selectedSection={selectedSection}
          formOutput={this.props.formOutput}
          onClick_updateFormSectionDetails={this.props.onClick_updateFormSectionDetails}
          onClick_selectFormSection={this.props.onClick_selectFormSection}
          onClick_updateWholeSection={this.props.onClick_updateWholeSection}
        />
      );
    }
  }


  // the Delete button gets rendered in the title bar when a deletable item is selected
  renderDeleteFormButton = () => {

    // filter out situations where the selected item can't be deleted
    if (this.props.selectedSection.getClassName() === "ConjureForm") {
      if (this.props.selectedSection.formDetails.containerType === "all") {
        return;
      }
    }

    // otherwise, we can render the button
    return (
      <h1 className="title_bar_text_clickable" onClick={() => this.props.onClick_deleteFormSection(this.props.selectedID)}>&#x1f5d1;</h1>
    );
  }



  // renders the top bar of the sidebar that shows the user what they've selected
  // - also includes buttons they can press to perform actions
  //  -> deselect currently selected item
  //  -> create a new subform
  renderTitleBar = () => {
    if (this.props.selectedID !== false) {

      let expandCreateButtonText = (this.state.createNewFormBarOpen) ? "-": "+"; // reversed because user wants to click + to open the row

      // get the currently selected section's type
      let sectionType = "";
      if (this.props.selectedSection.getClassName() === "ConjureForm") {
        sectionType = this.props.selectedSection.formDetails.containerType;
      } else if (this.props.selectedSection.getClassName() === "ConjureFormItem") {
        sectionType = this.props.selectedSection.itemType;
      }


      return (
        <div id="title_bar" className="background_highlight">
          <h1 className="title_bar_text text_dark">{sectionType}</h1>
          <div className="buttons_container">
            <h1 className="title_bar_text_clickable text_dark" onClick={() => this.setState({createNewFormBarOpen: !this.state.createNewFormBarOpen})}>{expandCreateButtonText}</h1>
            {this.renderDeleteFormButton()}
            <h1 className="title_bar_text_clickable text_dark" onClick={() => this.onClick_deselectItem()}>X</h1>
          </div>
        </div>
      );
    } else {
      return (
        <div id="title_bar" className="background_dark">
          <h1 className="title_bar_text text_light">Form Details</h1>
        </div>
      );
    }
  }


  // when the user has selected a ConjureForm, they can choose to insert into the form or adjacent to it
  // when the user has selected a ConjureFormItem, they can only insert adjacent
  renderInsertIntoButtons = () => {
    if (this.props.selectedSection.getClassName() === "ConjureForm" && this.props.selectedSection.formDetails.containerType !== "all") {

      // determine into/adjacent CSS
      // - user can click these to determine whether to insert *into* a ConjureForm or *adjacent* to it
      // -> determines the parent
      let insertIntoCSS;
      let insertAdjacentCSS;
      if (this.state.insertInto) {
        insertIntoCSS = "new_form_bar_clickable selected_txt_color";
        insertAdjacentCSS = "new_form_bar_clickable deselected_txt_color";
      } else {
        insertIntoCSS = "new_form_bar_clickable deselected_txt_color";
        insertAdjacentCSS = "new_form_bar_clickable selected_txt_color";
      }

      // render both options
      return (
        <h2 className="new_form_bar_text">Insert:
          <span className={insertIntoCSS} onClick={() => this.setState({insertInto: true})}> Into</span>
          <span className="deselected_txt_color"> / </span>
          <span className={insertAdjacentCSS} onClick={() => this.setState({insertInto: false})}>Adjacent</span>
        </h2>
      );

    } else if (this.props.selectedSection.getClassName() === "ConjureForm" && this.props.selectedSection.formDetails.containerType === "all") {

      if (!this.state.insertInto) {
        this.setState({insertInto: true});
      }

      // if selected is the outermost ConjureForm (all), then you cant insert adjacent
      return (
        <h2 className="new_form_bar_text">Insert: Into</h2>
      );

    } else if (this.props.selectedSection.getClassName() === "ConjureFormItem") {

      if (this.state.insertInto) {
        this.setState({insertInto: false});
      }

      // if selected is a ConjureFormItem, then we can only insert into
      return (
        <h2 className="new_form_bar_text">Insert: Adjacent</h2>
      );
    }
  }

  // called by renderCreateNewFormBar() to render button for creating a new ConjureFormItem (type = question)
  renderCreateNewQuestionButton = () => {

    // dont render if these conditions are true
    // ex: it does not make sense for you to be able to add a question in ConjureForm (type = all)
    let selected = this.props.selectedSection;
    if (selected) {
      if (selected.getClassName() === "ConjureForm" && ["all", "page"].indexOf(selected.formDetails.containerType) >= 0) {
        return;
      }

      if (selected.getClassName() === "ConjureForm" && !this.state.insertInto) {
        return;
      }
    } else {
      return;
    }

    // otherwise, render it
    return (
      <h2
        className="new_form_bar_clickable deselected_txt_color"
        onClick={() => this.onClick_insertNewSection("question")}
        >!?
      </h2>
    );
  }

  // called by renderCreateNewFormBar() to render button for creating a new ConjureFormItem (type = text)
  renderCreateNewTextButton = () => {

    // dont render if these conditions are true
    // ex: it does not make sense for you to be able to add a question in ConjureForm (type = all)
    let selected = this.props.selectedSection;
    if (selected) {
      if (selected.getClassName() === "ConjureForm" && ["all", "page"].indexOf(selected.formDetails.containerType) >= 0) {
        return;
      }
      if (selected.getClassName() === "ConjureForm" && !this.state.insertInto) {
        return;
      }
    } else {
      return;
    }

    // otherwise, we can render it
    return (
      <h2
        className="new_form_bar_clickable deselected_txt_color"
        onClick={() => this.onClick_insertNewSection("text")}
        >Tt
      </h2>
    );
  }

  // called by renderCreateNewFormBar() to render button for creating a new ConjureForm
  renderCreateNewFormButton = () => {

    // filter out options where it doesnt make sense to create another subform
    let selected = this.props.selectedSection;
    if (selected) {
      if (selected.getClassName() === "ConjureForm" && ["all", "page"].indexOf(selected.formDetails.containerType) < 0 && this.state.insertInto) {
        return;
      }

      if (selected.getClassName() === "ConjureFormItem" && ["all", "page"].indexOf(this.props.parentContainerType) < 0) {
        return;
      }
    }

    return (
      <h2
        className="new_form_bar_clickable deselected_txt_color"
        onClick={() => this.onClick_insertNewSection("ConjureForm")}
        >[]
      </h2>
    );
  }

  // a row that appears under the title bar when the user wants to add a new ConjureForm item to the form
  // - lets user create a new ConjureForm or ConjureFormItem
  renderCreateNewFormBar = () => {
    if (this.state.createNewFormBarOpen) {

      // determine pre/post button CSS
      // - user can click these to determine whether newly created item is before or after the currently selected one
      let preButtonCSS;
      let postButtonCSS;
      if (this.state.insertPre) {
        preButtonCSS = "new_form_bar_clickable selected_txt_color";
        postButtonCSS = "new_form_bar_clickable deselected_txt_color";
      } else {
        preButtonCSS = "new_form_bar_clickable deselected_txt_color";
        postButtonCSS = "new_form_bar_clickable selected_txt_color";
      }

      return (
        <div id="create_new_form_bar">
          <div className="buttons_container">
            {this.renderInsertIntoButtons()}

            {this.renderCreateNewQuestionButton()}
            {this.renderCreateNewTextButton()}
            {this.renderCreateNewFormButton()}
          </div>

          <div className="buttons_container">
            <h2 className={preButtonCSS} onClick={() => this.setState({insertPre: true})}>Pre</h2>
            <h2 className={postButtonCSS} onClick={() => this.setState({insertPre: false})}>Post</h2>
          </div>
        </div>
      );
    }
  }



  // render inputs for updating ConjureForm color schemes
  renderSelectColors = () => {

    let colors = this.props.formColors;

    return (
      <div className="sidebar_section_align_left">
        <h1 className="section_title">Form Colors</h1>
        <div className="colors_input_row">
          <h3 className="colors_title">Background</h3>
          <div id="color_square" style={{'background-color': colors.background}}></div>
          <input
            className="color_input"
            value={colors.background}
            onChange={this.onInput_updateColor.bind(this, "background")}
          />
        </div>

        <div className="colors_input_row">
          <h3 className="colors_title">Card</h3>
          <div id="color_square" style={{'background-color': colors.card}}></div>
          <input
            className="color_input"
            value={colors.card}
            onChange={this.onInput_updateColor.bind(this, "card")}
          />
        </div>

        <div className="colors_input_row">
          <h3 className="colors_title">Card Shadow</h3>
          <div id="color_square" style={{'background-color': colors.shadow}}></div>
          <input
            className="color_input"
            value={colors.shadow}
            onChange={this.onInput_updateColor.bind(this, "shadow")}
          />
        </div>

        <div className="colors_input_row">
          <h3 className="colors_title">Title Text</h3>
          <div id="color_square" style={{'background-color': colors.title}}></div>
          <input
            className="color_input"
            value={colors.title}
            onChange={this.onInput_updateColor.bind(this, "title")}
          />
        </div>

        <div className="colors_input_row">
          <h3 className="colors_title">Text</h3>
          <div id="color_square" style={{'background-color': colors.text}}></div>
          <input
            className="color_input"
            value={colors.text}
            onChange={this.onInput_updateColor.bind(this, "text")}
          />
        </div>
      </div>
    );
  }


  renderFormOutputObject = () => {
    return (
      <div className="sidebar_section_align_left">
        <h1 className="section_title">Output Object</h1>
        {this.props.formOutput.render(this.props.selectedID, true, this.props.onClick_selectFormSection)}
      </div>
    );
  }

  // renders <FormSidebar/>
  render() {

    if (this.props.selectedID === false) {

      // render the Output of the form
      return (
        <div id="FormSidebar">
          {this.renderTitleBar()}
          {this.renderFormOutputObject()}
          {this.renderSelectColors()}
        </div>
      );

    } else {

      // render <DevFormItemInput/> or <DevFormInput/> so user can modify details of the selected form
      return (
        <div id="FormSidebar">

          {this.renderTitleBar()}
          {this.renderCreateNewFormBar()}
          {this.renderDevFormInput()}
        </div>
      );

    }

  }
}

export default FormSidebar;
