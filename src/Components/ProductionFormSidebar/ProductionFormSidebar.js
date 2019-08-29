import React, { Component } from 'react';
import './ProductionFormSidebar.css';

import RenderFormOutputObject from '../../ConjureForm/DevInputDetails/RenderFormOutputObject/RenderFormOutputObject.js';

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

  onClick_copyOutputToClipboard = () => {
    let outputJSON = this.props.formOutput.export(true);
    navigator.clipboard.writeText(outputJSON);
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

          <div id="render_form_output_container">
            {this.props.formOutput.render(true)}
            <div className="row">
              <h3
                id="copy_output_text_clickable"
                onClick={this.onClick_copyOutputToClipboard}>
                Copy output object to clipboard
              </h3>
            </div>
          </div>
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
