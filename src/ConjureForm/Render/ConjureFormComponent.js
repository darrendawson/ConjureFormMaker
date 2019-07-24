import React, { Component } from 'react';
import './ConjureFormComponent.css';

class ConjureFormComponent extends Component {

  constructor() {
    super();
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
      <div id="ConjureFormComponent">
        <div className={this.getContainerCSS(this.props.containerType)}>
          {childrenToRender}
          <p>{this.props.formID}</p>
        </div>
      </div>
    );
  }
}

export default ConjureFormComponent;
