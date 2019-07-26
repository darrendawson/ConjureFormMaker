import React, { Component } from 'react';
import './FormSidebar.css';

import FormItemInput from '../../ConjureForm/InputDetails/FormItemInput.js';
import FormInput from '../../ConjureForm/InputDetails/FormInput.js';

class FormSidebar extends Component {

  constructor() {
    super();

    this.state = {
      createNewFormBarOpen: false,
      insertPre: false,
      insertInto: true
    }
  }


  // Render --------------------------------------------------------------------

  renderFormInput = () => {

    // make sure there is a selectedSection to render
    if (!this.props.selectedSection) {
      return;
    }

    if (this.props.selectedSection.getClassName() === "ConjureForm") {
      return (
        <FormInput/>
      );
    } else if (this.props.selectedSection.getClassName() === "ConjureFormItem") {
      return (
        <FormItemInput/>
      );
    }
  }

  // renders the top bar of the sidebar that shows the user what they've selected
  // - also includes buttons they can press to perform actions
  //  -> deselect currently selected item
  //  -> create a new subform
  renderTitleBar = () => {
    if (this.props.selectedID !== false) {

      let expandCreateButtonText = (this.state.createNewFormBarOpen) ? "-": "+"; // reversed because user wants to click + to open the row
      return (
        <div id="title_bar">
          <h1 className="title_bar_text">Selected</h1>
          <div className="buttons_container">
            <h1 className="title_bar_text_clickable" onClick={() => this.setState({createNewFormBarOpen: !this.state.createNewFormBarOpen})}>{expandCreateButtonText}</h1>
            <h1 className="title_bar_text_clickable" onClick={this.props.onClick_deselectItem}>X</h1>
          </div>
        </div>
      );
    } else {
      return (
        <div id="title_bar">
          <h1 className="title_bar_text">Form Output</h1>
        </div>
      );
    }
  }


  // when the user has selected a ConjureForm, they can choose to insert into the form or adjacent to it
  // when the user has selected a ConjureFormItem, they can only insert adjacent
  renderInsertIntoButtons = () => {
    if (this.props.selectedSection.getClassName() === "ConjureForm") {

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

            <h2 className="new_form_bar_clickable deselected_txt_color">!?</h2>
            <h2
              className="new_form_bar_clickable deselected_txt_color"
              onClick={() => this.props.onClick_createNewFormText(this.props.selectedID, this.state.insertPre, this.state.insertInto)}
              >Tt
            </h2>
            <h2 className="new_form_bar_clickable deselected_txt_color" onClick={() => alert(this.props.selectedID)}>[]</h2>
          </div>

          <div className="buttons_container">
            <h2 className={preButtonCSS} onClick={() => this.setState({insertPre: true})}>Pre</h2>
            <h2 className={postButtonCSS} onClick={() => this.setState({insertPre: false})}>Post</h2>
          </div>
        </div>
      );
    }
  }



  // renders <FormSidebar/>
  render() {

    if (this.props.selectedID === false) {

      // render the Output of the form
      return (
        <div id="FormSidebar">
          {this.renderTitleBar()}
        </div>
      );

    } else {

      // render <FormItemInput/> or <FormInput/> so user can modify details of the selected form
      return (
        <div id="FormSidebar">

          {this.renderTitleBar()}
          {this.renderCreateNewFormBar()}
          <h1>Selected: {this.props.selectedID}</h1>
          <p>{JSON.stringify(this.props.selectedSection)}</p>
          {this.renderFormInput()}
        </div>
      );

    }

  }
}

export default FormSidebar;
