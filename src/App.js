import React, { useState } from 'react';
import './App.css';
import FirstPage from './firstPage';
import SecondPage from './secondPage';

function App() {
  const [showFirstPage, setShowFirstPage] = useState(true)
  const [showSecondPage, setShowSecondPage] = useState(false)
  const [mainInput, setMainInput] = useState("");

  function changePages(){
    setShowFirstPage(!showFirstPage);
    setShowSecondPage(!showSecondPage);
  }

  return (
    <div className="App">
      {showFirstPage ? <FirstPage changePage={changePages} mainInput={mainInput} setMainInput={setMainInput} /> : null}
      {showSecondPage ? <SecondPage setMainInput={setMainInput} mainInput={mainInput} changePage={changePages} /> : null}
    </div>
  );
}

export default App;


