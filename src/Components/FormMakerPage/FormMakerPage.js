import React, { Component } from 'react';
import './FormMakerPage.css';

class FormMakerPage extends Component {

  constructor() {
    super();
  }


  // onClick -------------------------------------------------------------------

  // selects a page.section.item
  onClick_SelectItem = (location) => {
    if (! this.checkIfLocationsSame(this.props.selectedSection, location)) {
      this.props.update(location, this.props.selectedSectionTag);
    }
  }

  // Locations -----------------------------------------------------------------
  /*
    - location pathtags are used for referencing specific page.form.item
  */


  // form question/item locations are kept as path arrays to target
  // this function is used to build up the correct path while rendering
  // need to manually build up the array because of how JS referencing
  addToLocation = (location, nextPath) => {
    let newLocation = [];
    for (let i = 0; i < location.length; i++) {
      newLocation.push(location[i]);
    }
    newLocation.push(nextPath);
    return newLocation;
  }

  // returns true if both locations are the same
  // returns false otherwise
  checkIfLocationsSame = (location1, location2) => {
    if (location1.length !== location2.length) {
      return false;
    }

    for (let i = 0; i < location1.length; i++) {
      if (location1[i] !== location2[i]) {
        return false;
      }
    }

    return true;
  }

  // render --------------------------------------------------------------------


  renderTextItem = (item) => {
    if (item.itemType === "text") {
      return (
        <div className="item_row">
          <h1 className="section_title_text">{item.sectionTitle}</h1>
          <h2 className="title_text">{item.title}</h2>
          <p className="description_text">{item.description}</p>
        </div>
      );
    }
  }

  // renders a page.section.item
  renderItem = (item, location) => {

    // 1) render the item
    let itemToRender;

    if (item["itemType"] === "text") {
      itemToRender = this.renderTextItem(item);
    }


    // 2) render border (colored if actively selected, non-colored otherwise)
    let borderStyle = this.props.colors.getColor2("border-color", 1);
    if (this.checkIfLocationsSame(location, this.props.selectedSection)) {
      borderStyle = this.props.colors.getColor3("border-color", 4);
    }

    return (
      <div
        className="item_container"
        style={borderStyle}
        onClick={() => this.onClick_SelectItem(location)}>
        {itemToRender}
      </div>
    );
  }


  // renders a section
  // -> a section can either be a card or a subsection of a card
  renderSection = (section, location) => {

    let items = [];

    for (let i = 0; i < section.itemOrder.length; i++) {
      let itemKey = section.itemOrder[i];
      items.push(this.renderItem(section.items[itemKey], this.addToLocation(location, itemKey)));
    }

    return (
      <div className="card_container" style={this.props.colors.getColor2("background-color", 1)}>
        {items}
      </div>
    );
  }

  // renders a page of the form
  // -> needs to render all the sections within the page
  renderPage = (page, location) => {

    let sections = [];

    for (let i = 0; i < page.sectionOrder.length; i++) {
      let sectionKey = page.sectionOrder[i];
      sections.push(this.renderSection(page.sections[sectionKey], this.addToLocation(location, sectionKey)));
    }

    return (
      <div>
        {sections}
      </div>
    );
  }

  // dashed line showing break between pages
  renderPageBreak = () => {
    return (
      <div id="page_break" style={this.props.colors.getColor1('border-color', 3)}>
        <p id="page_break_text" style={this.props.colors.getColor1('color', 3)}>Page Break</p>
      </div>
    );
  }

  //
  renderForms = () => {

    let formData = this.props.formData;
    let pages = [];

    for (let i = 0; i < formData.pageOrder.length; i++) {
      let pageKey = formData.pageOrder[i];
      let location = [pageKey];
      pages.push(this.renderPage(formData.pages[pageKey], location));
      if (i + 1 < formData.pageOrder.length) {
        pages.push(this.renderPageBreak())
      }
    }

    return (
      <div id="form_column">
        {pages}
      </div>
    );
  }

  // renders <FormMakerPage/>
  render() {

    let colors = this.props.colors;

    return (
      <div id="FormMakerPage" style={colors.getColor2('background-color', 2)}>
        {this.renderForms()}
      </div>
    );
  }
}

export default FormMakerPage;
