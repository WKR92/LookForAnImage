import React from 'react';
import OpenedImage from './openedImage';
import lupe from './icons/loupe.png';
import cross from "./icons/letter-x.png";
import arrow from './icons/arrow.png'

const tomTomApiKey = "MmTYW8cbCvlP0Ldmo9cUDGwEyyqEUq0G"
const APIAccessKey = "6PMB_sssC924TiZ3jPaY4Iwo4KZ0E6d6xZ0dgSbK4_g";

export default class SecondPage extends React.Component{
    constructor(props) {
      super(props);
      this.state = {
        showParticularPic: false,
        images: [],
        leftImages: [],
        midImages: [],
        rightImages: [],
        query: props.mainInput.charAt(0).toUpperCase() + props.mainInput.slice(1),
        picOrientation: "",
        imgId: "",
        smallImg: "",
        rawImg: "",
        name: "",
        username: "",
        location: "",
        profileImg: "",
        scrollnum: 1,
        imgsFromScroll: [],
        resizeImages: [],
        hints: [],
        tags: []
      }
      this.handleChange = this.handleChange.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
      this.clearInput = this.clearInput.bind(this);
      this.openImage = this.openImage.bind(this);
      this.setPicData = this.setPicData.bind(this);
      this.fetchAPI = this.fetchAPI.bind(this);
      this.scrollUpdate = this.scrollUpdate.bind(this);
      this.preparePicToOpen = this.preparePicToOpen.bind(this);
      this.showOnImageInfo = this.showOnImageInfo.bind(this);
      this.hideOnPicImageInfo = this.hideOnPicImageInfo.bind(this);
      this.fetchApiHints = this.fetchApiHints.bind(this);
      this.handleArrow = this.handleArrow.bind(this);
      this.handleTag = this.handleTag.bind(this);
      this.scrollRigth = this.scrollRigth.bind(this);
      this.scrollLeft = this.scrollLeft.bind(this);
    }
    fetchAPI(page, inpValue){
  
      fetch("https://api.unsplash.com/search/photos/?"
      + "&client_id=" + APIAccessKey
      + "&query=" + this.props.mainInput
      + "&per_page=30"
      + "&page=" + page
      )
      .then(response => response.json())
      .then((data, fetchedUrls) => fetchedUrls = data.results.map(elem => [elem.urls.small, elem.urls.regular, elem.user.name,
      elem.user.username, elem.user.location, elem.user.profile_image.medium, elem.id, elem.alt_description, elem.tags]))
      .then(data => this.setState({images: data.length > 0 ? data : "empty"}))
      .then(data => this.setState({leftImages: this.state.images === "empty" ? this.state.leftImages
       : this.state.leftImages.concat(this.state.images.filter((function(_, i){return i % 3 === 0})))}))
      .then(data => this.setState({midImages: this.state.images === "empty" ? this.state.midImages 
      :this.state.midImages.concat(this.state.images.slice(2).filter((function(_, i){return i % 3 === 0})))}))
      .then(data => this.setState({rightImages: this.state.images === "empty" ? this.state.rightImages 
      :this.state.rightImages.concat(this.state.images.slice(1).filter((function(_, i){return i % 3 === 0})))}))
      .then(data => this.setState({resizeImages: this.state.images === "empty" ? this.state.resizeImages 
      :this.state.resizeImages.concat(this.state.images)}))
      .then(gettags => gettags = this.state.images.map(elem => elem[8].length > 1 ? elem[8][1] : null).filter(elem => elem !== null)
      .map(elem => elem.title).filter(e => e !== this.props.mainInput).filter(e => e.length <= 16))
      .then(data => this.setState({tags: [...new Set(data)]}))
      .catch(err => console.log(err))

      // to hide no hints alert and tags
      this.clearInput()
      this.setState({tags: []})
    }
    scrollUpdate(){
      if(this.state.showParticularPic === true || this.state.images === "empty"){
        return;
      }
      const lastDiv = document.querySelector(".secondPage__imagesContainer")
      if(lastDiv.getBoundingClientRect().bottom -1 < window.innerHeight){
        this.fetchAPI(this.state.scrollnum + 1);
        this.setState({
          scrollnum: this.state.scrollnum + 1
        })
      }
    }
    showOnImageInfo(event){

      this.setPicData(event)
      
      const id = event.target.id
      const userInfoDiv = document.getElementById("onImg__innerInfoDiv"+id)
      const resizeUserInfoDiv = document.getElementById("resize__onImg__innerInfoDiv"+id)
      
      userInfoDiv.style["display"] = "flex";
      resizeUserInfoDiv.style["display"] = "flex";
    }
    hideOnPicImageInfo(event){
      
      const id = event.target.id
      const userInfoDiv = document.getElementById("onImg__innerInfoDiv"+id)
      const resizeUserInfoDiv = document.getElementById("resize__onImg__innerInfoDiv"+id)
      userInfoDiv.style["display"] = "none";
      resizeUserInfoDiv.style["display"] = "none";
    }
    componentDidMount(){
  
      this.fetchAPI(1)
  
      // scroll function
      window.addEventListener('scroll', this.scrollUpdate)

      // fetch on hints list click
      const inp = document.getElementById("secondPage__form__search")
      let eventSource = null;
      let value = '';

      inp.addEventListener('keydown', (e) => {
        eventSource = e.key ? 'input' : 'list';
      });
      inp.addEventListener('input', (e) => {
        value = e.target.value;
        if (eventSource === 'list') {
          this.setState({
            images: [],
            leftImages: [],
            midImages: [],
            rightImages: [],
            resizeImages: []
          })
          this.props.setMainInput(value)
          this.setState({query: value})
          this.fetchAPI(1)
        }
      });

    }
    async handleChange(event){
      await this.props.setMainInput(event.target.value.toLowerCase())

      if(event.target.value.length > 2){
        this.fetchApiHints()        
      } else {
        this.setState({hints: []})
      }
    }
    handleSubmit(event){
      event.preventDefault();
  
      this.setState({
        images: [],
        leftImages: [],
        midImages: [],
        rightImages: [],
        resizeImages: [],
      })
      this.fetchAPI(1)
  
      this.setState({
        query: this.props.mainInput.charAt(0).toUpperCase() + this.props.mainInput.slice(1)
      })
    }
    clearInput(){ 
      const inp = document.querySelector(".secondPage__form__search")
      if(inp.value === ""){
        return;
      }
      inp.value = ""
      this.setState({hints: []})
    }
    openImage(event){
      this.setState({
        showParticularPic: !this.state.showParticularPic
      })
    }
    setPicData(event){
      const pic = []
      const id = event.target.id
      const picContainer = event.target.className
      if(picContainer === "leftImg"){
        this.state.leftImages.map(elem => elem.includes(id) ? pic.push(elem) : null)
      } 
      else if (picContainer === "midImg"){
        this.state.midImages.map(elem => elem.includes(id) ? pic.push(elem) : null)
      }
      else if (picContainer === "rightImg"){
        this.state.rightImages.map(elem => elem.includes(id) ? pic.push(elem) : null)
      }
      else if (picContainer === "resizeImg"){
        this.state.resizeImages.map(elem => elem.includes(id) ? pic.push(elem) : null)
      }
      
      this.setState({
        imgId: pic[0][6],
        rawImg: pic[0][1],
        name: pic[0][2],
        username: pic[0][3],
        location: pic[0][4],
        profileImg: pic[0][5]
      })
    }
    preparePicToOpen(event){
  
      this.setPicData(event)
  
      const picWidth = event.target.width
      const picHeight = event.target.height
  
      if(picWidth >= picHeight){
        this.setState({
          picOrientation: "horizontal"
        }) 
      }else{
        this.setState({
          picOrientation: "vertical"
        }) 
      }
  
      this.openImage()
    }
    fetchApiHints(){
      const regex = new RegExp(`${this.props.mainInput}`)
      fetch("https://api.tomtom.com/search/"
        + "2"
        + "/autocomplete/"
        + this.props.mainInput
        + "."
        + "json"
        + "?key=" + tomTomApiKey
        + "&language=en-GB"
        + "&limit=8")
        .then(res => res.json())
        .then((data, fetchedDesriptions) => fetchedDesriptions = data.results.map(elem => elem.segments[0].value.toLowerCase()))
        .then((data, setData) => setData = [...new Set(data)])
        .then((data, filteredData) => filteredData = data.filter(elem => elem.match(regex)))
        // .then((data, clearedData) => clearedData = data.filter(elem => elem !== this.props.mainInput))
        .then((data) => this.setState({hints: data.length < 1 ? ["No hints for choosen query"] : data}))
        .catch(err => this.setState({hints: []}))
    }
    handleArrow(){
      this.props.changePage()
    }
    async handleTag(event){
      
      const tag = event.target.id
      await this.props.setMainInput(tag)
      this.setState({query: tag.charAt(0).toUpperCase() + tag.slice(1) })
      this.setState({
        images: [],
        leftImages: [],
        midImages: [],
        rightImages: [],
        resizeImages: []
      })
      this.fetchAPI(1);
    }
    scrollRigth(){
      const innerTagsDiv = document.getElementById("innerTagsDiv")
      innerTagsDiv.scrollBy(350, 0);

      const lA = document.getElementById("leftArrowHolder")
      lA.style["visibility"] = "visible";

      const tagHolderslist = document.querySelectorAll(".tagHolder")
      const rA = document.getElementById("rightArrowHolder")
      if(tagHolderslist[tagHolderslist.length -1].getBoundingClientRect().right < rA.getBoundingClientRect().right){
        rA.style["visibility"] = "hidden";
      }
    }
    scrollLeft(){
      const innerTagsDiv = document.getElementById("innerTagsDiv")
      innerTagsDiv.scrollBy(-350, 0);

      const rA = document.getElementById("rightArrowHolder")
      rA.style["visibility"] = "visible";

      const tagHolderslist = document.querySelectorAll(".tagHolder")
      const lA = document.getElementById("leftArrowHolder")
      if(tagHolderslist[0].getBoundingClientRect().left > lA.getBoundingClientRect().left){
        lA.style["visibility"] = "hidden";
        }
    }
    componentDidUpdate(){
      if(this.state.tags.length > 1){
        
        const rA = document.getElementById("rightArrowHolder")
        const tagHolderslist = document.querySelectorAll(".tagHolder")
        if(tagHolderslist[tagHolderslist.length -1].getBoundingClientRect().right > rA.getBoundingClientRect().left &&
        tagHolderslist[tagHolderslist.length -1].getBoundingClientRect().right > rA.getBoundingClientRect().right){
          rA.style["visibility"] = "visible";
        }
      }
    }
    render(){
    return(
      <div className="secondPageMainDiv" id="secondPageMainDiv">
        <img onClick={this.handleArrow} alt="left_arrow_icon" src={arrow} title="Go back" className="arrowBack" id="arrowBack" />
        <form className="secondPage__form" onSubmit={this.handleSubmit}>
          <button onClick={this.handleSubmit} title="Search for pictures" type="button" className="secondPage__form__lupeBtn" ><img className="lupeIcon" alt="lupe_icon" src={lupe} /></button>
          <input list="autocomplite" autoComplete="off" title="Search for pictures" required onChange={this.handleChange} placeholder="Search..." id="secondPage__form__search" className="secondPage__form__search" type="search" />
          <datalist id="autocomplite">
              {this.state.hints.map(elem => {
                return <option key={elem} value={elem}>{elem}</option>
              })}
            </datalist>
          <button title="Clear form" type="button" onClick={this.clearInput} className="secondPage__form__clearBtn"><img className="crossIcon" alt="cross_icon" src={cross} /></button>
        </form>
        <div className="alertDiv">
          <p className="alertP">{this.state.hints[0] === "No hints for choosen query" ? " -- " + this.state.hints[0] : null}</p>
        </div>
        <h1 className="secondPage__h1">{this.state.query}</h1>

        {this.state.tags.length > 1 ?
        <div className="mainTagsDiv" id="mainTagsDiv">
          <div className="leftArrowHolder" id="leftArrowHolder">
            <div onClick={this.scrollLeft} className="leftArrow"></div>
          </div>
          <div className="rightArrowHolder" id="rightArrowHolder">
            <div onClick={this.scrollRigth} className="rightArrow"></div>
          </div>
          <div className="innerTagsDiv" id="innerTagsDiv">
          {this.state.tags.map(elem => {
                  return <div onClick={this.handleTag} id={elem} key={elem + "LI"} className="tagHolder">
                      <p id={elem} key={elem} className="tagP">{elem.charAt(0).toUpperCase() + elem.slice(1)}</p>
                        </div>
                      })}
          </div>
        </div> : null}
       
        <div className="secondPage__imagesContainer" id="secondPage__imagesContainer">
  
          {/* just for resize */}
          <div className="resizeImagesDiv" id="resizeImagesDiv">
            {this.state.resizeImages.length > 0 ? this.state.resizeImages.map(elem => {
                return (
                  <div className="resizeImageHolder" id={"resizeImageHolder"+elem[6]} onClick={this.preparePicToOpen} key={elem[6]} imgid={elem[6]}>
                  <img onMouseEnter={this.showOnImageInfo} onMouseLeave={this.hideOnPicImageInfo} id={elem[6]} className="resizeImg" alt={elem[7]} src={elem[0]} />
                    <div className="resize__onImg__innerInfoDiv" id={"resize__onImg__innerInfoDiv"+elem[6]}>
                      <img className="resize__onImg__profile_photo" alt="profile_photo" src={this.state.profileImg} />
                      <div className="resize__onImg__userInfoDiv">
                        <p className="resize__onImg__nameP">{this.state.name}</p>
                      </div>
                    </div>
                  </div>
                )
              }) : <h2 style={{color: "red"}}>No results for given queries. Try with another ones.</h2> }
          </div>
          <div className="leftImagesDiv" id="leftImagesDiv">
  
            {this.state.leftImages.length > 0 ? this.state.leftImages.map(elem => {
              return (
                <div className="leftImageHolder" id={"leftImageHolder"+elem[6]} onClick={this.preparePicToOpen} key={elem[6]} imgid={elem[6]}>
                  <img onMouseEnter={this.showOnImageInfo} onMouseLeave={this.hideOnPicImageInfo} id={elem[6]} className="leftImg" alt={elem[7]} src={elem[0]} title={elem[7]} />
                  <div className="onImg__innerInfoDiv" id={"onImg__innerInfoDiv"+elem[6]}>
                    <img className="onImg__profile_photo" alt="profile_photo" src={this.state.profileImg} />
                    <div className="onImg__userInfoDiv">
                      <p className="onImg__nameP">{this.state.name}</p>
                    </div>
                  </div>
                </div>
              )
            }) : <h2 style={{color: "red"}}>No results for given queries. Try with another ones.</h2> }
          </div>
          <div className="midImagesDiv" id="midImagesDiv">
            {this.state.midImages.map(elem => {
                return (
                  <div className="midImageHolder" id={"midImageHolder"+elem[6]} onClick={this.preparePicToOpen} key={elem[6]} imgid={elem[6]}>
                    <img onMouseEnter={this.showOnImageInfo} onMouseLeave={this.hideOnPicImageInfo} id={elem[6]} className="midImg" alt={elem[7]} src={elem[0]} title={elem[7]} />
                    <div className="onImg__innerInfoDiv" id={"onImg__innerInfoDiv"+elem[6]}>
                      <img className="onImg__profile_photo" alt="profile_photo" src={this.state.profileImg} />
                      <div className="onImg__userInfoDiv">
                        <p className="onImg__nameP">{this.state.name}</p>
                      </div>
                    </div>
                  </div>
                )
              })}
          </div>
          <div className="rightImagesDiv" id="rightImagesDiv">
            {this.state.rightImages.map(elem => {
                return (
                <div className="rightImageHolder" id={"rightImageHolder"+elem[6]} onClick={this.preparePicToOpen} key={elem[6]} imgid={elem[6]}>
                  <img onMouseEnter={this.showOnImageInfo} onMouseLeave={this.hideOnPicImageInfo} id={elem[6]} className="rightImg" alt={elem[7]} title={elem[7]} src={elem[0]} />
                  <div className="onImg__innerInfoDiv" id={"onImg__innerInfoDiv"+elem[6]}>
                    <img className="onImg__profile_photo" alt="profile_photo" src={this.state.profileImg} />
                    <div className="onImg__userInfoDiv">
                      <p className="onImg__nameP">{this.state.name}</p>
                    </div>
                  </div>
                </div>
                )
              })}
          </div>
        </div>
        {this.state.images === "empty" && this.state.leftImages.length > 1 ? <p id="noMoreImgs">No more photos to display for '{this.state.query}' query.</p> : null}
        {this.state.showParticularPic ? <OpenedImage id={this.state.imgId} rawImg={this.state.rawImg} openImage={this.openImage}
        name={this.state.name} username={this.state.username} location={this.state.location} profileImg={this.state.profileImg} 
        picOrientation={this.state.picOrientation}/> : null}
      </div>
    )}
  }
