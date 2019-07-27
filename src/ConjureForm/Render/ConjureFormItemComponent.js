import React, { Component } from 'react';
import './ConjureFormComponent.css';

class ConjureFormItemComponent extends Component {

  constructor() {
    super();
  }

  // onClick -------------------------------------------------------------------

  // this function acts as an intermediary to prevent cascading onClicks
  onClick_selectItem = (e) => {
    e.stopPropagation();
    this.props.onClick_selectItem(this.props.itemID);
  }

  // render --------------------------------------------------------------------


  renderSectionTitle = (titleText) => {
    if (titleText !== "") {
      return (
        <div id="section_title_text_container" style={{'background-color': this.props.titleColor}}>
          <h1 className="item_text_margins" style={{'color': this.props.backgroundColor}}>{titleText}</h1>
        </div>
      );
    }
  }

  renderItemDetails = () => {

    let itemDetails = this.props.itemDetails;

    if (this.props.itemType === "text") {
      return (
        <div className="item_container">
          {this.renderSectionTitle(itemDetails.sectionTitleText)}
          <h1 className="item_text_margins" style={{'color': this.props.titleColor}}>{itemDetails.titleText}</h1>
          <p className="item_text_margins" style={{'color': this.props.textColor}}>{itemDetails.descriptionText}</p>
        </div>
      );
    } else if (this.props.itemType === "question") {
      return (
        <div className="item_container">
          <h1 className="item_text_margins" style={{'color': this.props.titleColor}}>{itemDetails.questionTitle}</h1>
          <p className="item_text_margins" style={{'color': this.props.textColor}}>{itemDetails.questionDescription}</p>
        </div>
      );
    }
  }


  render() {

    // determine border styling
    let borderCSS = "dev_mode_hover";
    if (this.props.selected) {
      borderCSS = "dev_mode_selected";
    }

    return (
      <div
        id="ConjureFormItemComponent"
        className={borderCSS}
        onClick={this.onClick_selectItem}>

        {this.renderItemDetails()}

      </div>
    );
  }
}

export default ConjureFormItemComponent;
