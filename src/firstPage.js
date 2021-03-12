import backgroundImage from "./icons/john-towner-JgOeRuGD_Y4-unsplash.jpg";
import lupe from './icons/loupe.png';
import cross from "./icons/letter-x.png";
import React from "react";


// const subscriptionKey = '6e79fffeadc34859b3ac41065bfda7dc';

export default class FirstPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      descriptions: [],
      hints: []
    }
    // this.fetchAPI = this.fetchAPI.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.clearInput = this.clearInput.bind(this);

  }
  componentDidMount(){  

    const inp = document.getElementById("contentDiv__form__input")
    let eventSource = null;
    let value = '';

    // fetch on hints list click
    inp.addEventListener('keydown', (e) => {
      eventSource = e.key ? 'input' : 'list';
    });
    inp.addEventListener('input', (e) => {
      value = e.target.value;
      if (eventSource === 'list') {
        this.props.setMainInput(value)
        this.props.changePage();
      }
    });
  }
  async handleChange(event){
    await this.props.setMainInput(event.target.value.toLowerCase())

    if(event.target.value.length > 2){
      this.props.fetchAPIHints()
    } else {
      this.props.setHints([])
    }

  }
  handleSubmit(event){
    event.preventDefault()
    this.props.changePage()
  }
  clearInput(){ 
    const inp = document.querySelector(".contentDiv__form__input")
    if(inp.value === ""){
      return;
    }
    this.props.setMainInput("")
    inp.value = ""
    this.props.setHints([])
  }
  render(){
  return(
      <div className="firstPageMainDiv" id="firstPageMainDiv">
        <img className="backGroundImg" alt="landscape" src={backgroundImage} />
        <div className="contentDiv" id="contentDiv">
          <h1 className="contentDiv__h1">Look For An Image</h1>
          <p className="contentDiv__firstSubtitle">Usplash API powered pictures browser.</p>
          <form onSubmit={this.handleSubmit} className="contentDiv__form">
            <button onClick={this.handleSubmit} title="Search for pictures" type="button" id="contentDiv__form__lupeBtn"  className="contentDiv__form__lupeBtn" ><img className="lupeIcon" alt="lupe_icon" src={lupe} /></button>
            <input list="autocomplite" autoComplete="off" required onChange={this.handleChange} id="contentDiv__form__input" className="contentDiv__form__input" type="search" placeholder="Search for high-resolution photos" />
            <datalist onClick={this.handleSubmit} id="autocomplite">
              {this.props.hints.map(elem => {
                return <option key={elem} value={elem}>{elem}</option>
              }) }
            </datalist>
            <button title="Clear form" type="button" onClick={this.clearInput} id="contentDiv__form__clearBtn" className="contentDiv__form__clearBtn"><img className="crossIcon" alt="cross_icon" src={cross} /></button>
          </form>
          <p style={{color: "red"}}>{this.props.hints[0] === "No hints for choosen query" ? " -- " + this.props.hints[0] : null}</p>
          <p className="contentDiv__trending">There are available only 50 API requests per hour so this can expire quickly.</p>
        </div>
      </div>
    )
  }
}