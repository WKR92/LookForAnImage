import bgImage from './icons/bgphoto.jpg'
import React from "react";
import { useHistory } from "react-router-dom";
import SearchInput from './searchInput'


function FirstPage(props) {
  const history = useHistory();
  function changePage(){
    history.push("/search");
    localStorage.setItem('query', JSON.stringify(props.mainInput));
  }
  return(
    <div className="firstPageMainDiv" id="firstPageMainDiv">
      <img className="backGroundImg" alt="landscape" src={bgImage} />
      <div className="contentDiv" id="contentDiv">
        <h1 className="contentDiv__h1">Look For An Image</h1>
        <p className="contentDiv__firstSubtitle">Usplash API powered pictures browser.</p>
        <SearchInput hints={props.hints} mainInput={props.mainInput} setMainInput={props.setMainInput}
          setHints={props.setHints} handleSubmitForConcretePage={changePage} didMountForConcretePage={changePage} />
        <p style={{color: "red"}}>{props.hints[0] === "No hints for choosen query" ? " -- " + props.hints[0] : null}</p>
        <p className="contentDiv__trending">There are available only 50 API requests per hour so this can expire quickly.</p>
      </div>
    </div>
  )
}

export default FirstPage;
