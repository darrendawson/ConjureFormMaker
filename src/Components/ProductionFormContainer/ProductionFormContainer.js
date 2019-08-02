import React, { Component } from 'react';
import './ProductionFormContainer.css';

class ProductionFormContainer extends Component {

  constructor() {
    super();

    this.state = {

    }
  }


  // render --------------------------------------------------------------------

  // Renders <ProductionFormContainer/>
  render() {
    return (
      <div id="ProductionFormContainer" style={{'background-color': this.props.backgroundColor}}>
        <div id="form_container">
          {this.props.conjureForm.render()}
        </div>
      </div>
    );
  }
}

export default ProductionFormContainer;
