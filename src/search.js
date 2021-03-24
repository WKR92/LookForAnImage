import React,  { useEffect, useState, useCallback, useRef } from 'react';
import { useHistory } from "react-router-dom";
import arrow from './icons/arrow.png'
import arrowUp from './icons/up-arrow.png'
import SearchInput from './searchInput'
import { withRouter } from 'react-router';
import Tags from './tags'
import ImagesBlock from './imagesBlock'
import OpenedImage from './openedImage'

const APIAccessKey = "6PMB_sssC924TiZ3jPaY4Iwo4KZ0E6d6xZ0dgSbK4_g";

const SecondPage = (props) => {

  let scroll = 1
  let isPicOpen = useRef(false)
  let isFetchReturningNohing = useRef(false)
  const scrollTopRef = useRef()
  const history = useHistory();
  const orient = ["left", "mid", "right", "resize"]
  const [showParticularPic, setShowParticularPic] = useState(false);
  const [updatedKeyImgs, setUpdatedKeyImgs] = useState(0);
  const [updatedKeyTags, setUpdatedKeyTags] = useState(1);
  const [images, setImages] = useState([]);
  const [query, setQuery] = useState(JSON.parse(localStorage.getItem('query')));
  const [picToOpenData, setPicToOpenData] = useState('');

  function scrolToTop(){
    scrollTopRef.current.scrollIntoView();
  }

  function openImage(){
    setShowParticularPic(!showParticularPic);
    isPicOpen.current = !isPicOpen.current
  }

  function getDataOfParticularPic(event){
    const id = event.target.id
    const pic = images.filter(elem => elem.includes(id))     
    setPicToOpenData(pic)
    openImage();
  }

  const fetchAPI = useCallback((page) => {

    fetch("https://api.unsplash.com/search/photos/?"
    + "&client_id=" + APIAccessKey
    + "&query=" + JSON.parse(localStorage.getItem('query'))
    + "&per_page=30"
    + "&page=" + page
    )
    .then(response => response.json())
    .then((data, fetchedImgInfo) => fetchedImgInfo = data.results.map(elem => 
    [elem.urls.small, 
    elem.urls.regular, 
    elem.user.name,
    elem.user.username, 
    elem.user.location, 
    elem.user.profile_image.medium,
    elem.id,
    elem.alt_description !== null ? elem.alt_description : "no description", 
    elem.tags]))
    .then(data =>
      data.length > 0 ? setImages(images => [...images.concat(data)]) : isFetchReturningNohing.current = true
    )
    .catch(err => console.log(err))
  }, [])

  const scrollUpdate = useCallback(() => {
    if(isPicOpen.current || isFetchReturningNohing.current === true){
      return;
    } 
    const lastDiv = document.querySelector(".secondPageMainDiv");
    if(lastDiv.getBoundingClientRect().bottom -1 < window.innerHeight){ 
      fetchAPI(scroll + 1);
      scroll++
      setTimeout(() => {
        setUpdatedKeyImgs(scroll - 10);
        setUpdatedKeyTags(scroll + 10);
      }, 500)
    }
  }, [fetchAPI, scroll])


  const showArrowOnScroll = useCallback(() => {
    const lastDiv = document.querySelector(".secondPage__imagesContainer")
    const arrowUpHolder = document.querySelector(".arrowUpHolder")
    if(lastDiv.getBoundingClientRect().top < 0){
      arrowUpHolder.style["display"] = "flex"
    }else{
      arrowUpHolder.style["display"] = "none"
    }
  }, [])

  useEffect(() => {
    setImages([]);

    window.onbeforeunload = () => {
      localStorage.setItem('query', JSON.stringify(query));
    }

    fetchAPI(1);

    // scroll functions
    window.addEventListener('scroll', scrollUpdate);
    window.addEventListener('scroll', showArrowOnScroll);
    return () => {
      window.removeEventListener('scroll', scrollUpdate);
      window.removeEventListener('scroll', showArrowOnScroll);
    }
  }, [fetchAPI, scrollUpdate, showArrowOnScroll, query])

  function propsForDidMountInSearchInput(value){
    if(JSON.parse(localStorage.getItem('query')) === query){
      window.location.reload(false)
    }
    setImages([]);
    setQuery(value);
    isFetchReturningNohing.current = false
  }

  function propsForHandleSubmitInSearchInput(){
    if(props.mainInput === query){
      window.location.reload(false)
    }
    setImages([]);
    setQuery(props.mainInput);
    isFetchReturningNohing.current = false
  }

  function handleArrowBack(){
    window.removeEventListener('scroll', showArrowOnScroll);
    window.removeEventListener('scroll', scrollUpdate);
    
    history.push("/");
  }

  function handleTag(event){
    const tag = event.target.id;
    setQuery(tag);
    setImages([]);
    props.setHints([]);
    isFetchReturningNohing.current = false
    localStorage.setItem('query', JSON.stringify(tag)); 
  }

  return(
    <div ref={scrollTopRef} className="secondPageMainDiv" id="secondPageMainDiv">
      <img onClick={handleArrowBack} alt="left_arrow_icon" src={arrow} title="Go back" className="arrowBack" id="arrowBack" />
      <div onClick={scrolToTop} className="arrowUpHolder">
        <img alt="up_arrow_icon" src={arrowUp} title="Go up" className="arrowUp" id="arrowUp" />
      </div>

      <SearchInput
        hints={props.hints} mainInput={props.mainInput} 
        setMainInput={props.setMainInput}
        setHints={props.setHints} 
        handleSubmitForConcretePage={propsForHandleSubmitInSearchInput}
        didMountForConcretePage={propsForDidMountInSearchInput}
      />

      <div className="alertDiv">
        <p id="NoHintsP" className="alertP">{props.hints[0] === "No hints for choosen query" ? " -- " + props.hints[0] : null}</p>
      </div>
      <h1 id="secondPage__h1">{query.charAt(0).toUpperCase() + query.slice(1)}</h1>

      {images.length > 0
      ? <Tags key={updatedKeyTags} handleTag={handleTag} images={images} mainInput={props.mainInput} />
      : null}
     
      <div key={updatedKeyImgs} className="secondPage__imagesContainer" id="secondPage__imagesContainer">
        {images.length < 1
        ? <h2 style={{color: "red"}}>No results for the chosen queries. Please, try with another ones.</h2>
        : orient.map(e => {
          return <ImagesBlock orientation={e} key={e} images={images} getDataOfParticularPic={getDataOfParticularPic} />
        })}
        
        {showParticularPic ? <OpenedImage picToOpenData={picToOpenData} 
        openImage={openImage} /> : null}
      </div>
        {isFetchReturningNohing.current === true && images.length > 0
        ? <p id="noMoreImgs">No more photos to display for '{query}' query.</p>
        : null}
    </div>
  )
}

export default withRouter(SecondPage)