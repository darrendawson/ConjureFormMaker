import React, { Component } from 'react';
import './ConditionalMaker.css';

import RenderFormOutputObject from '../RenderFormOutputObject/RenderFormOutputObject.js';

class ConditionalMaker extends Component {

  constructor() {
    super();

    this.state = {
      expanded: true
    }
  }

  // render --------------------------------------------------------------------

  renderSelectionComponent = () => {
    if (this.state.expanded) {
      return (
        <RenderFormOutputObject
          selectedID={this.props.selectedID}
          formOutputObject={this.props.formOutputObject}
          formDetailsLookup={this.props.formDetailsLookup}
          renderTextClickable={true}
          bannedIDs={this.props.bannedIDs}
          onClick_selectFormSection={this.props.onClick_selectFormSection}
        />
      );
    }
  }
  // Renders <ConditionalMaker/>
  render() {
    return (
      <div id="ConditionalMaker">
        {this.renderSelectionComponent()}
      </div>
    );
  }
}

export default ConditionalMaker;
