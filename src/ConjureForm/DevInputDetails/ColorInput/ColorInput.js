import React, { Component } from 'react';
import './ColorInput.css';

// constants -------------------------------------------------------------------

let __colors = {
  "red": ["#FFB8B9", "#F79193", "#EF6D6F", "#DE3033", "#CE0609", "#BD0003", "#AD0003", "#9D0003", "#8C0002"],
  "orange": ["#FFD1B8", "#F7B591", "#EF9A6D", "#DE6D30", "#CE4C06", "#BD4200", "#AD3D00", "#9D3700", "#8C3100"],
  "yellow": ["#FFEAB8", "#F7D891", "#EFC86D", "#DEAA30", "#CE9206", "#BD8500", "#AD7900", "#9D6E00", "#8C6200"],
  "yellow-green": ["#F1FFB8", "#E2F791", "#D5EF6D", "#BBDE30", "#A5CE06", "#96BD00", "#89AD00", "#7B9D00", "#6E8C00"],
  "green": ["#CBFFB8", "#ACF791", "#8FEF6D", "#5EDE30", "#3BCE06", "#31BD00", "#2DAD00", "#289D00", "#238C00"],
  "blue-green": ["#B8FFD8", "#91F7BF", "#6DEFA7", "#30DE7F", "#06CE61", "#00BD57", "#00AD51", "#009D4B", "#008C44"],
  "light-blue": ["#B8EEFF", "#91DFF7", "#6DD0EF", "#30B6DE", "#06A0CE", "#0093BD", "#0088AD", "#007C9D", "#00708C"],
  "dark-blue": ["#B8C0FF", "#919DF7", "#6D7CEF", "#3044DE", "#061DCE", "#0015BD", "#0013AD", "#00109D", "#000E8C"],
  "purple": ["#E3B8FF", "#CE91F7", "#BB6DEF", "#9B30DE", "#8406CE", "#7B00BD", "#7600AD", "#70009D", "#69008C"],
  "pink": ["#FFB8F2", "#F791E4", "#EF6DD6", "#DE30BD", "#CE06A6", "#BD0095", "#AD0086", "#9D0076", "#8C0067"],
  "white-grey": ["#FFFFFF", "#F6F6F6", "#EDEDED", "#DBDBDB", "#C8C8C8", "#B6B6B6", "#A4A4A4", "#929292", "#808080"],
  "grey-black": ["#6E6E6E", "#666666", "#5E5E5E", "#4E4E4E", "#3F3F3F", "#2F2F2F", "#1F1F1F", "#101010", "#000000"]
}

// <ColorInput/> ---------------------------------------------------------------

class ColorInput extends Component {

  constructor() {
    super();

    this.state = {
      expanded: false
    }
  }


  // onInput -------------------------------------------------------------------

  onInput_updateColor = (e) => {
    this.props.onClick_updateColor(this.props.colorKey, e.target.value);
    this.setState({expanded: false});
  }

  onClick_selectColor = (color) => {
    this.props.onClick_updateColor(this.props.colorKey, color);
    this.setState({expanded: false});
  }

  onClick_expandColorSelect = () => {
    this.setState({expanded: !this.state.expanded});
  }

  // render --------------------------------------------------------------------

  renderColorColumn = (colors) => {
    let colorsToRender = [];
    for (let i = 0; i < colors.length; i++) {

      let css_button = "select_color_button";
      if (colors[i] === this.props.selectedColor) {
        css_button = "selected_color_button";
      }

      colorsToRender.push(
        <div
          className={css_button}
          style={{'background-color': colors[i]}}
          onClick={() => this.onClick_selectColor(colors[i])}
        />
      );
    }

    return (
      <div className="color_column">
        {colorsToRender}
      </div>
    );
  }



  renderColorOptions = () => {
    if (! this.state.expanded) { return; }

    let columnsToRender = [];
    for (let colorName in __colors) {
      columnsToRender.push(this.renderColorColumn(__colors[colorName]));
    }

    return (
      <div id="color_options_container">
        {columnsToRender}
      </div>
    );
  }


  renderTitleRow = () => {
    return (
      <div  id="title_row">
        <h3 id="color_title">{this.props.colorName}</h3>
        <div id="color_square" style={{'background-color': this.props.selectedColor}} onClick={this.onClick_expandColorSelect}></div>
        <input
          id="color_input"
          value={this.props.selectedColor}
          onChange={this.onInput_updateColor.bind(this)}
        />
      </div>
    );
  }

  // Renders <ColorInput/>
  render() {
    return (
      <div id="ColorInput">
        {this.renderTitleRow()}
        {this.renderColorOptions()}
      </div>
    );
  }
}

export default ColorInput;
