import { useState, useEffect } from "react";



export default function Tags(props){
    const [tags, setTags] = useState([])
    useEffect(() => {
        let getTagsFromImages = []
        if (props.images.length > 0) {
        getTagsFromImages = Object.values(props.images)
        .map(e => e[8] !== undefined && e[8].length > 0 ? e[8][1] : null)
        .filter(e => e !== null)
        .map(e => e !== undefined && e.title)
        .filter(e => e !== JSON.parse(localStorage.getItem('query')))
        .filter(e => e.length <= 16)}
        setTags([...new Set(getTagsFromImages)])
        
    }, [props])
    useEffect(() => {
        if(tags.length > 1){
            const rA = document.getElementById("rightArrowHolder")
            const tagHolderslist = document.querySelectorAll(".tagHolder")
            if(tagHolderslist[tagHolderslist.length -1].getBoundingClientRect().right > rA.getBoundingClientRect().left
            && tagHolderslist[tagHolderslist.length -1].getBoundingClientRect().right > rA.getBoundingClientRect().right){
                rA.style["visibility"] = "visible";
            }
        }
    })
    function scrollRigth(){

        const lA = document.getElementById("leftArrowHolder")
        lA.style["visibility"] = "visible";
  
        function firstToGo(callback){
          const innerTagsDiv = document.getElementById("innerTagsDiv")
          innerTagsDiv.scrollBy(350, 0);
        }
  
        function secondToGo(){ setTimeout(() => {
          const tagHolderslist = document.querySelectorAll(".tagHolder")
          const rA = document.getElementById("rightArrowHolder")
          if(tagHolderslist[tagHolderslist.length -1].getBoundingClientRect().right < rA.getBoundingClientRect().right){
            rA.style["visibility"] = "hidden";
            }
          }, 350)
        }
  
        firstToGo();
        secondToGo();
      }
      function scrollLeft(){
  
        const rA = document.getElementById("rightArrowHolder")
        rA.style["visibility"] = "visible";
  
        function firstToGo(callback){
            const innerTagsDiv = document.getElementById("innerTagsDiv")
            innerTagsDiv.scrollBy(-350, 0);
        }
  
        function secondToGO(){ setTimeout(() => {
          const tagHolderslist = document.querySelectorAll(".tagHolder")
          const lA = document.getElementById("leftArrowHolder")
          if(tagHolderslist[0].getBoundingClientRect().left > lA.getBoundingClientRect().left){
            lA.style["visibility"] = "hidden";
            }
          }, 350)
        }
  
        firstToGo();
        secondToGO();
  
      }
    return(
        <div className="mainTagsDiv" id="mainTagsDiv">
          <div className="leftArrowHolder" id="leftArrowHolder">
            <div onClick={scrollLeft}  className="leftArrow"></div>
          </div>
          <div className="rightArrowHolder" id="rightArrowHolder">
            <div onClick={scrollRigth}  className="rightArrow"></div>
          </div>
          <div className="innerTagsDiv" id="innerTagsDiv">
          {tags.map(elem => {
                  return <div onClick={props.handleTag} id={elem} key={elem + "LI"} className="tagHolder">
                      <p id={elem} key={elem} className="tagP">{elem.charAt(0).toUpperCase() + elem.slice(1)}</p>
                        </div>
                      })}
          </div>
        </div>
    )
}