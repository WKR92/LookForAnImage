import { withRouter } from "react-router-dom";
import lupe from './icons/loupe.png';
import cross from "./icons/letter-x.png";
import React, { useEffect, useCallback } from "react";

const tomTomApiKey = "MmTYW8cbCvlP0Ldmo9cUDGwEyyqEUq0G"

const SearchInput = (props) => {

  const clearInput = useCallback(() => { 
    const inp = document.querySelector(".searchInput__form__input")
      if(inp.value === ""){
          return;
      }
      props.setMainInput("");
      inp.value = "";
      setTimeout(() => {
        props.setHints([]);
      }, 300)       
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

  useEffect(() => {
    const inp = document.getElementById("searchInput__form__input")
      let eventSource = null;
      let value = '';

      // fetch on hints list click
      inp.addEventListener('keydown', (e) => {
          eventSource = e.key ? 'input' : 'list';
      });
      
      inp.addEventListener('input', (e) => {
          value = e.target.value;
          if (eventSource === 'list') {
          clearInput();
          localStorage.setItem('query', JSON.stringify(value));
          props.didMountForConcretePage(value);
          }
      });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clearInput])

  function handleSubmit(event){
    event.preventDefault();
    clearInput();
    localStorage.setItem('query', JSON.stringify(props.mainInput));
    props.handleSubmitForConcretePage();      
  }

  function fetchAPIHints(query){

    const regex = new RegExp(`${query}`)
    fetch("https://api.tomtom.com/search/"
    + "2"
    + "/autocomplete/"
    + query
    + "."
    + "json"
    + "?key=" + tomTomApiKey
    + "&language=en-GB"
    + "&limit=10")
    .then(res => res.json())
    .then((data, fetchedHints) => fetchedHints = data.results.map(elem => elem.segments[0].value.toLowerCase()))
    .then((data, setData) => setData = [...new Set(data)])
    .then((data, filteredData) => filteredData = data.filter(elem => elem.match(regex)))
    .then((data, clearedData) => clearedData = data.filter(elem => elem !== query))
    .then((data) => props.setHints(data.length < 1 ? ["No hints for choosen query"] : data))
    .catch(err => props.setHints([]))
  }

  function handleChange(event){

    if(event.target.value.length > 2){
        fetchAPIHints(event.target.value)   
    } else {
        props.setHints([])
    }

    props.setMainInput(event.target.value.toLowerCase())
  }

  return(
  <form onSubmit={handleSubmit} className="searchInput__form">
      <button onClick={handleSubmit} title="Search for pictures" type="button" id="searchInput__form__lupeBtn"
        className="searchInput__form__lupeBtn" >
          <img className="lupeIcon" alt="lupe_icon" src={lupe} />
      </button>
      <input list="autocomplite" autoComplete="off" required onChange={handleChange} id="searchInput__form__input" 
        className="searchInput__form__input" type="search" placeholder="Search for high-resolution photos" />
      <datalist id="autocomplite">
        {props.hints.map(elem => {
          return <option key={elem} value={elem}>{elem}</option>
        }) }
      </datalist>
      <button title="Clear form" type="button" onClick={clearInput} id="searchInput__form__clearBtn"
       className="searchInput__form__clearBtn">
         <img className="crossIcon" alt="cross_icon" src={cross} />
      </button>
    </form>
  )
}

export default withRouter(SearchInput)