import React, { Component } from 'react';
import './StyleInput.css';

import MultipleChoice from '../../Render/QuestionTypes/MultipleChoice/MultipleChoice.js';

class StyleInput extends Component {

  constructor() {
    super();

    this.state = {
      createNewStyleOpen: false,
      newStyleID: ''
    }
  }


  // onClick -------------------------------------------------------------------

  onClick_selectStyleID = (styleID) => {

    // when a user selects the null option in <MultipleChoice/>, it returns false
    // -> convert this into the default empty string
    if (styleID === false) {
      styleID = '';
    }

    if (styleID !== this.props.selectedID) {
      this.onClick_selectStyleRootMode(false);
      this.props.onClick_updateAppearance("styleID", styleID);
    }
  }

  onClick_selectStyleRootMode = (newRootMode) => {
    if (newRootMode !== this.props.rootMode) {
      this.props.onClick_updateAppearance("styleRoot", newRootMode);
    }
  }

  onInput_updateNewStyleName = (e) => {
    if (e.target.value !== this.state.newStyleID) {
      this.setState({newStyleID: e.target.value});
    }
  }

  onClick_saveNewStyle = () => {
    this.props.onClick_createNewStyle(this.state.newStyleID);
    this.onClick_selectStyleID(this.state.newStyleID);
    this.setState({createNewStyleOpen: false, newStyleID: ''});
  }

  onClick_quitStyle = () => {
    this.setState({createNewStyleOpen: false, newStyleID: ''});
  }


  // render --------------------------------------------------------------------


  renderSelectStyle = () => {
    return (
      <div className="input_row">
        <h3 className="input_title" style={{'width': '180px'}}>Style</h3>
        <MultipleChoice
          choices={this.props.styleOptions}
          selectedChoices={[this.props.selectedID]}
          minSelected={0}
          maxSelected={1}
          devModeOn={false}
          backgroundColor="#353535"
          borderColor="white"
          textColor="white"
          multipleChoiceType="dropdown"
          onClick_answerMultipleChoiceQuestion={this.onClick_selectStyleID}
        />
      </div>
    );
  }


  // if a style is selected, this function lets user select a root mode
  // - if root=true, the appearance of this form will be tied to all other forms with same style and root mode
  renderSelectRoot = () => {
    if (this.props.selectedID === '') { return; }

    let css_offButton = "button_selected";
    let css_onButton = "button";
    if (this.props.rootMode === true) {
      css_offButton = "button";
      css_onButton = "button_selected";
    }

    return (
      <div className="input_row">
        <h3 className="input_title">Root Mode</h3>
        <button className={css_offButton} onClick={() => this.onClick_selectStyleRootMode(false)}>Off</button>
        <button className={css_onButton} onClick={() => this.onClick_selectStyleRootMode(true)}>On</button>
      </div>
    );
  }


  //
  renderCreateNewStyle = () => {

    // don't render the option to create a new style if this form is already a rooted style
    if (this.props.selectedID !== '' && this.props.rootMode === true) { return; }

    // otherwise, render the option to create a new style out of this form's appearances
    if (this.state.createNewStyleOpen) {
      return (
        <div className="input_row">
          <h3 className="input_title">New Style Name</h3>
          <input
            className="form_input"
            value={this.state.newStyleID}
            onChange={this.onInput_updateNewStyleName.bind(this)}
            style={{'margin-right': '10px'}}
          />
          <button className="save_button save_hover" onClick={this.onClick_saveNewStyle}>+</button>
          <button className="save_button quit_hover" onClick={this.onClick_quitStyle}>X</button>
        </div>
      );
    } else {
      return (
        <button
          className="button"
          style={{'margin-left': '20px', 'margin-top': '5px'}}
          onClick={() => this.setState({'createNewStyleOpen': true})}>
          Make this a new style
        </button>
      )
    }
  }

  // Renders <StyleInput/>
  render() {
    return (
      <div id="StyleInput">
        <h1>Predefined Styles</h1>
        {this.renderSelectStyle()}
        {this.renderSelectRoot()}
        {this.renderCreateNewStyle()}
      </div>
    );
  }
}

export default StyleInput;
