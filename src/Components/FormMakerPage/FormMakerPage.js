import React, { Component } from 'react';
import './FormMakerPage.css';

class FormMakerPage extends Component {

  constructor() {
    super();
  }



  // render --------------------------------------------------------------------


  renderItem = (item) => {

    if (item["itemType"] === "sectionTitle") {
      return (
        <div>
          <h1>{item.value}</h1>
        </div>
      );
    }

    else if (item["itemType"] === "text") {
      return (
        <div>
          <p>{item.value}</p>
        </div>
      );
    }
    return (
      <div>
        <p>{JSON.stringify(item)}</p>
      </div>
    );
  }


  renderSection = (section) => {

    let items = [];

    for (let i = 0; i < section.itemOrder.length; i++) {
      let itemKey = section.itemOrder[i];
      items.push(this.renderItem(section.items[itemKey]));
    }

    return (
      <div className="card_container" style={this.props.colors.getColor2("background-color", 1)}>
        {items}
      </div>
    );
  }

  // renders a page of the form
  // -> needs to render all the sections within the page
  renderPage = (page) => {

    let sections = [];

    for (let i = 0; i < page.sectionOrder.length; i++) {
      let sectionKey = page.sectionOrder[i];
      sections.push(this.renderSection(page.sections[sectionKey]));
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
      let pageName = formData.pageOrder[i];
      pages.push(this.renderPage(formData.pages[pageName]));
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
