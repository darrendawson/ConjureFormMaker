import React, { Component } from 'react';
import './App.css';


// Components
import Navbar from './Components/Navbar/Navbar.js';
import FormOutputSidebar from './Components/FormOutputSidebar/FormOutputSidebar.js';

// Colors
import ColorPicker from './ColorPicker.js';
let COLORS = new ColorPicker('green-blue', 'orange');

class App extends Component {

  constructor() {
    super();
  }


  // render --------------------------------------------------------------------

  render() {
    return (
      <div id="App">
        <Navbar
          colors={COLORS}
        />

        <div id='body_container'>

          <div id='left_body_container'>

          </div>

          <div id='right_body_container'>
            <FormOutputSidebar
              colors={COLORS}
            />
          </div>

        </div>
      </div>
    );
  }

}

export default App;
