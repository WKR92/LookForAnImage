import React, { useState } from 'react';
import './App.css';
import FirstPage from './home';
import SecondPage from './search';
import {HashRouter as Router, Switch, Route } from 'react-router-dom'

function App() {
  const [mainInput, setMainInput] = useState("");
  const [hints, setHints] = useState([]);
  return (
    <Router basename="/">
    <div className="App">
      <Switch>
        <Route name="secondPage" path="/search" render={props => <SecondPage setMainInput={setMainInput} mainInput={mainInput} 
        hints={hints} setHints={setHints} />} />
        <Route name="home" path="/" render={props => <FirstPage mainInput={mainInput} setMainInput={setMainInput}
        hints={hints} setHints={setHints} />} />
      </Switch>
    </div>
    </Router>
  );
}

export default App;


