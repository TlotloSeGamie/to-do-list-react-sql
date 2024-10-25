import React, { useState } from "react";
import "./App.css"
import Navbar from "./components/Navbar";
import Login from "./components/Login";
import Register from "./components/Register";
import ToDo from "./components/ToDo"
import Home from "./components/Home";

function App() {
  const [currentForm, setCurrentForm] = useState(null);

  const handleFormSwitch = (formName) => {
    setCurrentForm(formName);
  };

  const closeForm = () => {
    setCurrentForm(null);
  };

  return (
    <div className="app-container">
      <Navbar onFormSwitch={handleFormSwitch} />
      {currentForm === 'login' && <Login onFormSwitch={handleFormSwitch} onLogin={closeForm} />}
      {currentForm === 'register' && <Register onFormSwitch={handleFormSwitch} />}
      {currentForm && <button onClick={closeForm} className="close-form-btn">Close</button>}
      <Home />
    </div>
  );
}

export default App;
