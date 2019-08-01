import React, { Component } from 'react';
import './ProductionFormSidebar.css';

const expandButtonText = "<<";
const retractButtonText = ">>";

class ProductionFormSidebar extends Component {

  constructor() {
    super();
  }

  // onClick -------------------------------------------------------------------

  onClick_expandSidebar = (expand) => {
    this.props.update(expand, this.props.sidebarExpandedTag);
  }


  // render --------------------------------------------------------------------

  // Renders <ProductionFormSidebar/>
  render() {

    if (this.props.sidebarExpanded) {
      return (
        <div id="ProductionFormSidebar" className="expanded_background">
          <div id="title_bar_container">
            <h1>Form Output</h1>
            <div className="title_bar_button_container">
              <h1 className="title_bar_button" onClick={() => this.props.onClick_setDevModeActive(true)}>&#9632;</h1>
              <h1
                className="title_bar_button"
                onClick={() => this.onClick_expandSidebar(false)}>
                {retractButtonText}
              </h1>
            </div>
          </div>
          <p></p>
        </div>
      );
    } else {
      return (
        <div id="ProductionFormSidebar" style={{'background-color': this.props.formBackgroundColor}}>
          <h1
            className="expand_button"
            style={{'background-color': this.props.formBackgroundColor, 'color': this.props.formTitleColor}}
            onClick={() => this.onClick_expandSidebar(true)}>
            {expandButtonText}
          </h1>
        </div>
      );
    }

  }
}

export default ProductionFormSidebar;
