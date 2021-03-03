import React, { useEffect } from 'react';
import locationIcon from './icons/pin.png';
import cross from "./icons/letter-x.png";

export default function OpenedImage(props){
    useEffect(() => {
      const picDiv = document.getElementById("picDiv");
      const pic = document.getElementById("pic");
      if(props.picOrientation === "horizontal"){
        picDiv.classList.add("picDivHorizontal");
        picDiv.setAttribute("id", "picDivHorizontal");
        pic.classList.add("picHorizontal")
        pic.setAttribute("id", "picHorizontal");
      }else{
        picDiv.classList.add("picDivVertical");
        picDiv.setAttribute("id", "picDivVertical");
        pic.classList.add("picVertical")
        pic.setAttribute("id", "picVertical");
      }
    })
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
                  <img className="profile_photo" alt="profile_photo" src={props.profileImg} />
                  <div className="userInfoDiv">
                    <p className="nameP">{props.name}</p>
                    <p id="usernameP" className="usernameP">@{props.username}</p>
                  </div>
                </div>
                <div className="locationDiv" id="locationDiv">
                  <p className="locationP">{props.location ?  props.location : "no location provided"} </p>
                  <img alt="location_icon" src={locationIcon} className="locationIcon" /> 
                </div>
            </div>
            <div className="outerPicDiv" id="outerPicDiv">
              <div id="picDiv" className="">
                <img id="pic" className="" alt="pic" src={props.rawImg} />
              </div>
            </div>

            {/* just for resize */}
            <div className="resize__locationDiv" id="resize__locationDiv">
              <img alt="location_icon" src={locationIcon} className="resize__location_icon" /> 
              <p className="resize__locationP">{props.location ?  props.location : "no location provided"} </p>
            </div>

          </div>
        </div>
      </div>
    )
  }