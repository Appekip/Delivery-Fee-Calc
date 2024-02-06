import React from 'react';
import './App.css';
import DeliveryFeeInterface from "./components/deliveryFeeInterface";
import logo from "./woltLogo.png";

function App() {
  return (
    <div className="App">
      <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
        <DeliveryFeeInterface/>
      </header>
    </div>
  );
}

export default App;
