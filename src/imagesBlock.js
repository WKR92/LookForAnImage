import React, { useEffect, useState  } from "react";

const ImagesBlock = (props) => {

  const [thisBlockImages, setThisBlockImages] = useState([]);
  const [name, setName] = useState('');
  const [profileImg, setProfileImg] = useState('');

  useEffect (() => {
    if (props.orientation === "left") 
    {setThisBlockImages(props.images.filter((function(_, i){return i % 3 === 0})))}

    if (props.orientation === "mid") 
    {setThisBlockImages(props.images.slice(2).filter((function(_, i){return i % 3 === 0})))}
    
    if (props.orientation === "right") 
    {setThisBlockImages(props.images.slice(1).filter((function(_, i){return i % 3 === 0})))}
    
    if (props.orientation === "resize") 
    {setThisBlockImages(props.images)}
    
  }, [props])
  function showOnImageInfo(event){

    setPicData(event)
    
    const id = event.target.id

    if(props.orientation === "resize"){
      const resizeUserInfoDiv = document.getElementById("resize__onImg__innerInfoDiv"+id)
      resizeUserInfoDiv.style["display"] = "flex";
    } else{
      const userInfoDiv = document.getElementById("onImg__innerInfoDiv"+id)
      userInfoDiv.style["display"] = "flex";
    }
  }
  function hideOnPicImageInfo(event){
    
    const id = event.target.id

    if(props.orientation === "resize"){
      const resizeUserInfoDiv = document.getElementById("resize__onImg__innerInfoDiv"+id)
      resizeUserInfoDiv.style["display"] = "none";
    } else{
      const userInfoDiv = document.getElementById("onImg__innerInfoDiv"+id)
      userInfoDiv.style["display"] = "none";
    }
  }
  function setPicData(event){
      
    const id = event.target.id
    const pic = thisBlockImages.filter(elem => elem.includes(id))  
    
    setName(pic[0][2]);
    setProfileImg(pic[0][5]);
  }
  return(
      <div className={props.orientation+"ImagesDiv"} id={props.orientation+"ImagesDiv"}>

      {thisBlockImages.length > 0 ? thisBlockImages.map(elem => {
        return (
          <div className={props.orientation+"ImageHolder"} id={props.orientation+"ImageHolder"+elem[6]}
            onClick={props.getDataOfParticularPic} key={elem[6]} imgid={elem[6]}>
            <img onMouseEnter={showOnImageInfo} onMouseLeave={hideOnPicImageInfo} id={elem[6]}
              className={props.orientation+"Img"} alt={elem[7]} src={elem[0]} title={elem[7]} />
            <div className={props.orientation !== "resize" ? "onImg__innerInfoDiv" : "resize__onImg__innerInfoDiv"}
            id={props.orientation !== "resize" ? "onImg__innerInfoDiv"+elem[6] : "resize__onImg__innerInfoDiv"+elem[6]}>
              <img className="onImg__profile_photo" alt="profile_photo" src={profileImg} />
              <div className="onImg__userInfoDiv">
                <p className="onImg__nameP">{name}</p>
              </div>
            </div>
          </div>
        )
      }) : null}
    </div>
  )
}

export default ImagesBlock