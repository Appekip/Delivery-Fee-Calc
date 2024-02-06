import React from 'react';
import './App.css';
import DeliveryFee from "./components/deliveryFee";
import logo from "./woltLogo.png";

function App() {
  return (
    <div className="App">
      <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
        <DeliveryFee/>
      </header>
    </div>
  );
}

export default App;
