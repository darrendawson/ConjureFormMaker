import React, { Component } from 'react';
import './FormItemSidebar.css';


class FormItemSidebar extends Component {

  constructor() {
    super();
  }

  // update --------------------------------------------------------------------

  // when a user types into a <input/>, updates attribute in item
  updateItemAttributeFromInput = (location, event) => {
    let newItem = this.props.formItem;
    newItem[location] = event.target.value;
    this.props.updateFormItem(newItem, this.props.updateFormItemLocation);
  }

  // render --------------------------------------------------------------------

  // renders an <input/> that the user can modify
  // - inputTitle is what the value of the input is called (ex: Description)
  // - inputValue is the value that is currently in the input
  // - location has the location of the value that will be updated when user types in <input/>
  //    ex: location = "description" means that we will update item.description when user types in <input/>
  renderInput = (inputTitle, inputValue, location) => {

    let inputColors = [
      {"colorScheme": 3, "colorType": "background-color", "colorIntensity": 4},
      {"colorScheme": 3, "colorType": "color", "colorIntensity": "text-bright"},
      {"colorScheme": 3, "colorType": "border-color", "colorIntensity": 4}
    ];

    return (
      <div className="row">
        <h2 className="input_title" style={this.props.colors.getColor3("color", "text-bright")}>{inputTitle}</h2>
        <input
          id="input"
          style={this.props.colors.getMultipleColors(inputColors)}
          placeholder={inputValue}
          value={inputValue}
          onChange={this.updateItemAttributeFromInput.bind(this, location)}
        />
      </div>
    );
  }



  // renders item details for a text item
  renderTextItem = (item) => {
    if (item.itemType === "text") {
      return (
        <div>
          {this.renderInput("Section Title", item.sectionTitle, "sectionTitle")}
          {this.renderInput("Regular Title", item.title, "title")}
          {this.renderInput("Description", item.description, "description")}
        </div>
      );
    }
  }

  // renders item details for a question item
  renderQuestionItem = (item) => {
    if (item.itemType === "question") {
      return (
        <div>
          <h2 style={this.props.colors.getColor2("color", 1)}>Type: <span style={this.props.colors.getColor2("color", 2)}>Text</span></h2>
        </div>
      );
    }
  }

  // render the item details
  renderItemDetails = () => {

    let item = this.props.formItem;

    return (
      <div className="section">
        {this.renderTextItem(item)}
      </div>
    );
  }


  // renders the top bar of the sidebar
  // - displays type of selected item (text, question, section)
  // - displays the deselect button
  renderTopBar = () => {
    return (
      <div id="top_bar" style={this.props.colors.getColor3('background-color', 2)}>
        <h1 className="title" style={this.props.colors.getColor3('color', 'text-bright')}>{this.props.formItem.itemType}</h1>
        <h1
          id="exit_button"
          style={this.props.colors.getColor3('color', 'text-bright')}
          onClick={() => this.props.update(false, this.props.selectedItemTag)}
          >X
        </h1>
      </div>
    );
  }

  // renders <FormItemSidebar/>
  render() {
    return (
      <div id="FormItemSidebar" style={this.props.colors.getColor3('background-color', 3)}>

        {/* Top Bar */}
        {this.renderTopBar()}

        {/* Item Details --- user can modify item here */}
        {this.renderItemDetails()}
        {/* <p>{JSON.stringify(this.props.formItem)}</p> */}
      </div>
    );
  }
}

export default FormItemSidebar;
