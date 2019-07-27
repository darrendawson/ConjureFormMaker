import React, { Component } from 'react';
import './ConjureFormComponent.css';

class ConjureFormComponent extends Component {

  constructor() {
    super();
  }


  // onClick -------------------------------------------------------------------

  // this function acts as an intermediary to this.props.onClick_selectForm
  // this prevents cascading onClicks when the user clicks a nested <ConjureFormComponent/>
  onClick_selectForm = (e) => {
    e.stopPropagation();
    this.props.onClick_selectForm(this.props.formID);
  }
  // render --------------------------------------------------------------------


  // returns the correct CSS class name tags for the container
  getContainerCSS = (containerType) => {

    if (containerType === "page") {
      return "container_type_page";
    } else if (containerType === "card") {
      return "container_type_card";
    } else {
      return "";
    }
  }

  // box-shadow and backgroundColor are dynamically inserted using html style
  getContainerStyling = (containerType) => {

    let style = {'background-color': this.props.backgroundColor};
    if (containerType === "card") {
      style['box-shadow'] = "5px 10px 15px " + this.props.shadowColor + "";
    }
    return style;
  }


  // render <ConjureFormComponent/>
  // - because ConjureForm can have ConjureForms and ConjureFormItems as children,
  //      we need to call their render functions as well:
  //      <ConjureForm
  //        {children}
  //      />
  //
  // - objects in this.props.subforms and this.props.items are ConjureForm and ConjureFormItem classes
  //      they ARE NOT <ConjureFormComponent/> or <ConjureFormItemComponent/>
  render() {

    let childrenToRender = [];

    // for each child, call their render function
    for (let i = 0; i < this.props.order.length; i++) {

      // get full child object from this.subforms or this.items
      let id = this.props.order[i]["id"];
      let child;
      if (this.props.order[i]["type"] === "ConjureForm") {
        child = this.props.subforms[id];
      } else {
        child = this.props.items[id];
      }

      childrenToRender.push(child.render());
    }



    return (
      <div
        id="ConjureFormComponent"
        onClick={this.onClick_selectForm}>
        <div
          className={this.getContainerCSS(this.props.containerType)}
          style={this.getContainerStyling(this.props.containerType)}>
          {childrenToRender}
        </div>
      </div>
    );
  }
}

export default ConjureFormComponent;
