import { withRouter } from "react-router-dom";
import lupe from './icons/loupe.png';
import cross from "./icons/letter-x.png";
import React from "react";

const tomTomApiKey = "MmTYW8cbCvlP0Ldmo9cUDGwEyyqEUq0G"

class SearchInput extends React.Component{
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.clearInput = this.clearInput.bind(this);
        this.fetchAPIHints = this.fetchAPIHints.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
      }
    componentDidMount(){

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
            this.clearInput();
            localStorage.setItem('query', JSON.stringify(value));
            this.props.didMountForConcretePage(value);
            }
        });
    }
    handleSubmit(event){
        event.preventDefault();
        this.clearInput();
        localStorage.setItem('query', JSON.stringify(this.props.mainInput));
        this.props.handleSubmitForConcretePage();
        
    }
    fetchAPIHints(page){

        const regex = new RegExp(`${this.props.mainInput}`)
        fetch("https://api.tomtom.com/search/"
        + "2"
        + "/autocomplete/"
        + this.props.mainInput
        + "."
        + "json"
        + "?key=" + tomTomApiKey
        + "&language=en-GB"
        + "&limit=10")
        .then(res => res.json())
        .then((data, fetchedDesriptions) => fetchedDesriptions = data.results.map(elem => elem.segments[0].value.toLowerCase()))
        .then((data, setData) => setData = [...new Set(data)])
        .then((data, filteredData) => filteredData = data.filter(elem => elem.match(regex)))
        .then((data, clearedData) => clearedData = data.filter(elem => elem !== this.props.mainInput))
        .then((data) => this.props.setHints(data.length < 1 ? ["No hints for choosen query"] : data))
        .catch(err => this.props.setHints([]))
      }
    clearInput(){ 
        const inp = document.querySelector(".searchInput__form__input")
          if(inp.value === ""){
              return;
          }
          this.props.setMainInput("");
          inp.value = "";
          setTimeout(() => {
            this.props.setHints([]);
          }, 300)         
        }
    async handleChange(event){
        await this.props.setMainInput(event.target.value.toLowerCase())
    
        if(event.target.value.length > 2){
                this.fetchAPIHints()        
            } else {
                this.props.setHints([])
            }
        }
    render(){
        return(
        <form onSubmit={this.handleSubmit} className="searchInput__form">
            <button onClick={this.handleSubmit} title="Search for pictures" type="button" id="searchInput__form__lupeBtn"  className="searchInput__form__lupeBtn" ><img className="lupeIcon" alt="lupe_icon" src={lupe} /></button>
            <input list="autocomplite" autoComplete="off" required onChange={this.handleChange} id="searchInput__form__input" className="searchInput__form__input" type="search" placeholder="Search for high-resolution photos" />
            <datalist onClick={this.handleSubmit} id="autocomplite">
              {this.props.hints.map(elem => {
                return <option key={elem} value={elem}>{elem}</option>
              }) }
            </datalist>
            <button title="Clear form" type="button" onClick={this.clearInput} id="searchInput__form__clearBtn" className="searchInput__form__clearBtn"><img className="crossIcon" alt="cross_icon" src={cross} /></button>
          </form>
        )
    }
}

export default withRouter(SearchInput)