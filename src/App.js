import React, { useState } from 'react';
import './App.css';
import FirstPage from './firstPage';
import SecondPage from './secondPage';

const tomTomApiKey = "MmTYW8cbCvlP0Ldmo9cUDGwEyyqEUq0G"

function App() {
  const [showFirstPage, setShowFirstPage] = useState(true)
  const [showSecondPage, setShowSecondPage] = useState(false)
  const [mainInput, setMainInput] = useState("");
  const [hints, setHints] = useState([]);

  function changePages(){
    setShowFirstPage(!showFirstPage);
    setShowSecondPage(!showSecondPage);
  }

  function fetchAPIHints(page){

    // Najpierw zrobiłem autouzupełnianie z API microsoftu, dawał bardziej trafione podpowiedzi, 
    // ale limit 1000 req/msc nie starczył nawet na dokończenie konfiguracji
    // fetch("https://api.bing.microsoft.com/"
    // + "v7.0/Suggestions?"
    // + "&mkt=en-US"
    // + "&setLang=en-US"
    // + "&q=" + this.props.mainInput, {
    //   headers: {
    //     'Ocp-Apim-Subscription-Key' : subscriptionKey,
    //   }
    // })
    // .then(response => response.json())
    // .then((data, fetchedDesriptions) => fetchedDesriptions = data.suggestionGroups[0].searchSuggestions.map(elem => elem.displayText))
    // .then((data) => this.setState({hints: data}))
    // .catch(err => console.log(err))

    // tom tom ma 2500 req/dzień, ale słabe podpowiedzi - chyba bardziej dla map
    // Myślałem także nad Google Places Autocomplite API, ale nie byłem pewien czy istnieje jakiś zakres darmowego
    // użytkowania, jaki potrzebowałbym do tego projektu.

    const regex = new RegExp(`${mainInput}`)
    fetch("https://api.tomtom.com/search/"
    + "2"
    + "/autocomplete/"
    + mainInput
    + "."
    + "json"
    + "?key=" + tomTomApiKey
    + "&language=en-GB"
    + "&limit=10")
    .then(res => res.json())
    .then((data, fetchedDesriptions) => fetchedDesriptions = data.results.map(elem => elem.segments[0].value.toLowerCase()))
    .then((data, setData) => setData = [...new Set(data)])
    .then((data, filteredData) => filteredData = data.filter(elem => elem.match(regex)))
    .then((data, clearedData) => clearedData = data.filter(elem => elem !== mainInput))
    .then((data) => this.setHints(data.length < 1 ? ["No hints for choosen query"] : data))
    .catch(err => this.setHints([]))
  }

  return (
    <div className="App">
      {showFirstPage ? <FirstPage changePage={changePages} mainInput={mainInput} setMainInput={setMainInput}
      fetchAPIHints={fetchAPIHints} hints={hints} setHints={setHints} /> : null}
      {showSecondPage ? <SecondPage setMainInput={setMainInput} mainInput={mainInput} changePage={changePages} 
      fetchAPIHints={fetchAPIHints} hints={hints} setHints={setHints}/> : null}
    </div>
  );
}

export default App;


