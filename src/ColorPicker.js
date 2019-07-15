// Class for determining colors

// Color definitions
const schema1 = {
  'green-blue': {
    1: '#124e4f',
    2: '#175d5e',
    3: '#176b6b',
    4: '#208087',

    'text-bright': '#ffffff'
  }
}

const schema2 = {
  'lightgrey': {
    1: '#ffffff',
    2: '#ededed',
    3: '#d6d6d6'
  }
}

const schema3 = {
  'orange': {
    2: '#ba783b',
    3: '#d18742',
    4: '#e8974c',

    'text-bright': '#ffffff'
  }
}



// Color Picker class
class ColorPicker {

  // color1 and color2 are Strings for accessing schema1, schema2
  constructor(color1, color2, color3) {
    this.color1Scheme = schema1[color1];
    this.color2Scheme = schema2[color2];
    this.color3Scheme = schema3[color3];
  }

  getColor1(colorType, colorIntensity) {
    return {[colorType]: this.color1Scheme[colorIntensity]};
  }

  getColor2(colorType, colorIntensity) {
    return {[colorType]: this.color2Scheme[colorIntensity]};
  }

  getColor3(colorType, colorIntensity) {
    return {[colorType]: this.color3Scheme[colorIntensity]};
  }

  // calls getColorX for multiple color requests and packages them all in one object
  // listOfColors = [{"colorScheme": 1...n, "colorType": "background-color, etc", "colorIntensity": x}]
  getMultipleColors(listOfColors) {
    let result = {};
    for (let i = 0; i < listOfColors.length; i++) {
      let request = listOfColors[i];
      if (request.colorScheme === 1) {
        result[request.colorType] = this.color1Scheme[request.colorIntensity];
      } else if (request.colorScheme === 2) {
        result[request.colorType] = this.color2Scheme[request.colorIntensity];
      } else if (request.colorScheme === 3) {
        result[request.colorType] = this.color3Scheme[request.colorIntensity];
      }
    }
    return result;
  }
}

export default ColorPicker;
