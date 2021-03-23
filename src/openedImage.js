import React from 'react';
import locationIcon from './icons/pin.png';
import cross from "./icons/letter-x.png";

export default function OpenedImage(props){
    function closeImage(){
      props.openImage();
    }
    function closeModal(event){
      if(event.target.id === "outerPicHolder" || event.target.id === "openedImageMainDiv"){
        closeImage();
      }
    }
    return(
      <div onClick={closeModal} className="openedImageMainDiv" id="openedImageMainDiv">
        <img className="modalCancelBtn" alt="cross_icon" src={cross} onClick={closeImage} />
        <div className="outerPicHolder" id="outerPicHolder">
          <div className="innerPicHolder" id="innerPicHolder">
            <div className="mainInfoDiv">
                <div className="innerInfoDiv">
                  <img className="profile_photo" alt="profile_photo" src={props.picToOpenData[0][5]} />
                  <div className="userInfoDiv">
                    <p className="nameP">{props.picToOpenData[0][2]}</p>
                    <p id="usernameP" className="usernameP">@{props.picToOpenData[0][3]}</p>
                  </div>
                </div>
                <div className="locationDiv" id="locationDiv">
                  <p className="locationP">{props.picToOpenData[0][4] ?  props.picToOpenData[0][4] : "location not provided"} </p>
                  <img alt="location_icon" src={locationIcon} className="locationIcon" /> 
                </div>
            </div>
            <div className="outerPicDiv" id="outerPicDiv">
              <div id="picDiv" className="picInnerDiv">
                <img id="pic" className="pic" alt="pic" src={props.picToOpenData[0][1]} title={props.picToOpenData[0][7]} />
              </div>
            </div>

            {/* just for resize */}
            <div className="resize__locationDiv" id="resize__locationDiv">
              <img alt="location_icon" src={locationIcon} className="resize__location_icon" /> 
              <p className="resize__locationP">{props.picToOpenData[0][4] ?  props.picToOpenData[0][4] : "location not provided"} </p>
            </div>

          </div>
        </div>
      </div>
    )
  }