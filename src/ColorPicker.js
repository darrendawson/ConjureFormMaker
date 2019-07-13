// Class for determining colors

// Color definitions
let schema1 = {
  'green-blue': {
    1: '#124e4f',
    2: '#175d5e',
    3: '#176b6b',
    4: '#208087',

    'text-bright': '#ffffff'
  }
}

let schema2 = {
  'lightgrey': {
    1: '#ffffff',
    2: '#ededed'
  }
}



// Color Picker class
class ColorPicker {

  // color1 and color2 are Strings for accessing schema1, schema2
  constructor(color1, color2) {
    this.color1Scheme = schema1[color1];
    this.color2Scheme = schema2[color2];
  }

  getColor1(colorType, colorIntensity) {
    return {[colorType]: this.color1Scheme[colorIntensity]};
  }

  getColor2(colorType, colorIntensity) {
    return {[colorType]: this.color2Scheme[colorIntensity]};
  }
}

export default ColorPicker;
