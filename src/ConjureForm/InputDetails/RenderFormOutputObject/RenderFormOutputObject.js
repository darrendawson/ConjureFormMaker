import React, { Component } from 'react';
import './RenderFormOutputObject.css';


const __leftBracketChar = "{";
const __rightBracketChar = "}";

class RenderFormOutputObject extends Component {

  constructor() {
    super();
  }

  // render --------------------------------------------------------------------

  // gets the appropriate number of spaces for an object nested at a certain depth
  getSpacePaddingLeft = (depth) => {
    let padding = "";
    for (let i = 0; i < depth; i++) {
      padding += "    "; // 4
    }
    return padding;
  }


  renderParameterName = (formID, outputName) => {
    if (this.props.selectedID === formID) {
      return (
        <span className="text_clickable_selected">{outputName}</span>
      );
    } else {
      return (
        <span className="text_clickable">{outputName}</span>
      );
    }
  }


  renderObject = (obj, depth = 1, result = []) => {

    let numSubforms = Object.keys(obj).length;
    let i = 0;
    for (let formID in obj) {
      i += 1;
      let paddingLeft = this.getSpacePaddingLeft(depth);
      let outputName = this.props.formDetailsLookup[formID]['outputID'];
      let parameterName = this.renderParameterName(formID, outputName);

      if (this.props.formDetailsLookup[formID]['type'] === "ConjureForm") {
        result.push(<pre className="text" onClick={() => this.props.onClick_selectFormSection(formID)}>{paddingLeft}{parameterName}: {__leftBracketChar}</pre>)

        result.push(this.renderObject(obj[formID], depth + 1));

        // render } to end current subform object. logic used to render with or without comma
        if (i < numSubforms) {
          result.push(<pre className="text">{paddingLeft}{__rightBracketChar},</pre>);
        } else {
          result.push(<pre className="text">{paddingLeft}{__rightBracketChar}</pre>);
        }

      } else if (this.props.formDetailsLookup[formID]['type'] === "ConjureFormItem") {
        let itemDefaultValue = JSON.stringify(this.props.formDetailsLookup[formID]['defaultOutput']);

        // render } to end current subform object. logic used to render with or without comma
        if (i < numSubforms) {
          result.push(<pre className="text" onClick={() => this.props.onClick_selectFormSection(formID)}>{paddingLeft}{parameterName}: {itemDefaultValue},</pre>)
        } else {
          result.push(<pre className="text" onClick={() => this.props.onClick_selectFormSection(formID)}>{paddingLeft}{parameterName}: {itemDefaultValue}</pre>)
        }
      }

    }
    return result;
  }


  // Renders <RenderFormOutputObject/>
  render() {
    return (
      <div id="RenderFormOutputObject">
        <pre className="text">{__leftBracketChar}</pre>
        {this.renderObject(this.props.formOutputObject)}
        <pre className="text">{__rightBracketChar}</pre>
      </div>
    );
  }
}

export default RenderFormOutputObject;
