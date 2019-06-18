import React from 'react';
import logo from './logo.svg';
import './App.css';
import PixMatrix from './component/PixelMapCanvas'

function App() {

  console.log("123")

  return ( 
    <div>
    <div className="App">
      FEWSim
    </div>
    <h1><PixMatrix/></h1>
    </div>
  );
}

export default App;
