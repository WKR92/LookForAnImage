import React from 'react';
import arrow from './icons/arrow.png'
import arrowUp from './icons/up-arrow.png'
import SearchInput from './searchInput'
import { withRouter } from 'react-router';
import Tags from './tags'
import ImagesBlock from './imagesBlock'
import OpenedImage from './openedImage'

const APIAccessKey = "6PMB_sssC924TiZ3jPaY4Iwo4KZ0E6d6xZ0dgSbK4_g";
class SecondPage extends React.Component{
    constructor(props) {
      super(props);
      this.state = {
        showParticularPic: false,
        updatedKeyImgs: 0,
        updatedKeyTags: 1,
        checkIfParticularPicIsOpen: false,
        checkIfFetchReturnsNothing: false,
        images: [],
        query: JSON.parse(localStorage.getItem('query')),
        scrollnum: 1,
        picToOpenData: "",
      }
      this.scrollToTopRef = React.createRef();
      this.fetchAPI = this.fetchAPI.bind(this);
      this.refreshBlocksOfImagesAndTags = this.refreshBlocksOfImagesAndTags.bind(this);
      this.checkIfParticularPicIsOpen = this.checkIfParticularPicIsOpen.bind(this);
      this.showArrowOnScroll = this.showArrowOnScroll.bind(this);
      this.scrollUpdate = this.scrollUpdate.bind(this);
      this.handleArrowBack = this.handleArrowBack.bind(this);
      this.handleTag = this.handleTag.bind(this);
      this.openImage = this.openImage.bind(this);
      this.scrolToTop = this.scrolToTop.bind(this);
      this.getDataOfParticularPic = this.getDataOfParticularPic.bind(this);
      this.propsForDidMountInSearchInput = this.propsForDidMountInSearchInput.bind(this);
      this.propsForHandleSubmitInSearchInput = this.propsForHandleSubmitInSearchInput.bind(this);
    }
    scrolToTop(){
      this.scrollToTopRef.current.scrollIntoView();
    }
    openImage(){
      this.setState({showParticularPic: !this.state.showParticularPic});
      this.setState({checkIfParticularPicIsOpen: !this.state.checkIfParticularPicIsOpen})
    }
    getDataOfParticularPic(event){
      const id = event.target.id
      const pic = this.state.images.filter(elem => elem.includes(id))     
      this.setState({picToOpenData: pic})
      this.openImage();
    }
    checkIfParticularPicIsOpen(){
      this.setState({
        checkIfParticularPicIsOpen: !this.state.checkIfParticularPicIsOpen
      });
    }
    refreshBlocksOfImagesAndTags(){
      this.setState({
        updatedKeyImgs: this.state.updatedKeyImgs -1,
        updatedKeyTags: this.state.updatedKeyTags +1
      })
    }
    fetchAPI(page){
  
      fetch("https://api.unsplash.com/search/photos/?"
      + "&client_id=" + APIAccessKey
      + "&query=" + JSON.parse(localStorage.getItem('query'))
      + "&per_page=30"
      + "&page=" + page
      )
      .then(response => response.json())
      .then((data, fetchedUrls) => fetchedUrls = data.results.map(elem => 
      [elem.urls.small, 
      elem.urls.regular, 
      elem.user.name,
      elem.user.username, 
      elem.user.location, 
      elem.user.profile_image.medium,
      elem.id,
      elem.alt_description !== null ? elem.alt_description : "no description", 
      elem.tags]))
      .then(data => this.setState({images: data.length > 0 ? this.state.images.concat(data) : this.state.images,
        checkIfFetchReturnsNothing: data.length > 0 ? false : true}))
      .catch(err => console.log(err))
    }
    scrollUpdate(){
      if(this.state.checkIfParticularPicIsOpen === true || this.state.images.length < 1){
        return;
      }
      const lastDiv = document.querySelector(".secondPageMainDiv")
      if(lastDiv.getBoundingClientRect().bottom -1 < window.innerHeight){
        this.fetchAPI(this.state.scrollnum + 1);
        this.setState({
          scrollnum: this.state.scrollnum + 1
        })
        setTimeout(() => {
          this.setState({
            updatedKeyImgs: this.state.updatedKeyImgs -1,
            updatedKeyTags: this.state.updatedKeyTags +1
          })
        }, 500)
      }
    }
    showArrowOnScroll(){
      const lastDiv = document.querySelector(".secondPage__imagesContainer")
      const arrowUpHolder = document.querySelector(".arrowUpHolder")
      if(lastDiv.getBoundingClientRect().top < 0){
        arrowUpHolder.style["display"] = "flex"
      }else{
        arrowUpHolder.style["display"] = "none"
      }
    }
    componentDidMount(){
      window.onbeforeunload = () => {
        localStorage.setItem('query', JSON.stringify(this.state.query));
      }
  
      this.fetchAPI(1);
  
      // scroll functions
      window.addEventListener('scroll', this.scrollUpdate);
      window.addEventListener('scroll', this.showArrowOnScroll);
    }
    componentWillUnmount(){
      // clear scroll functions
      window.removeEventListener('scroll', this.scrollUpdate);
      window.removeEventListener('scroll', this.showArrowOnScroll);
    }
    componentDidUpdate(){
      if(this.state.checkIfFetchReturnsNothing === true){
        window.removeEventListener('scroll', this.scrollUpdate);
      } else{
        window.addEventListener('scroll', this.scrollUpdate);
      }
    }
    propsForDidMountInSearchInput(value){
      this.setState({images: []});
      this.setState({query: value});
      this.fetchAPI(1);
      this.refreshBlocksOfImagesAndTags();
    }
    propsForHandleSubmitInSearchInput(){
      this.setState({images: []});
      this.fetchAPI(1);
      this.setState({query: this.props.mainInput});
      this.refreshBlocksOfImagesAndTags();
    }
    handleArrowBack(){
      this.props.history.push("/LookForAnImage");
    }
    handleTag(event){
      const tag = event.target.id;
      this.setState({query: tag});
      this.setState({images: []});
      this.props.setHints([]);
      localStorage.setItem('query', JSON.stringify(tag));
      this.fetchAPI(1);
    }
    render(){
    return(
      <div ref={this.scrollToTopRef} className="secondPageMainDiv" id="secondPageMainDiv">
        <img onClick={this.handleArrowBack} alt="left_arrow_icon" src={arrow} title="Go back" className="arrowBack" id="arrowBack" />
        <div onClick={this.scrolToTop} className="arrowUpHolder">
          <img alt="up_arrow_icon" src={arrowUp} title="Go up" className="arrowUp" id="arrowUp" />
        </div>

        <SearchInput
          hints={this.props.hints} mainInput={this.props.mainInput} 
          setMainInput={this.props.setMainInput}
          setHints={this.props.setHints} 
          handleSubmitForConcretePage={this.propsForHandleSubmitInSearchInput}
          didMountForConcretePage={this.propsForDidMountInSearchInput}
        />

        <div className="alertDiv">
          <p className="alertP">{this.props.hints[0] === "No hints for choosen query" ? " -- " + this.props.hints[0] : null}</p>
        </div>
        <h1 className="secondPage__h1">{this.state.query.charAt(0).toUpperCase() + this.state.query.slice(1)}</h1>

        {this.state.images.length > 0
        ? <Tags key={this.state.updatedKeyTags} handleTag={this.handleTag} images={this.state.images} mainInput={this.props.mainInput} />
        : null}
       
        <div key={this.state.updatedKeyImgs} className="secondPage__imagesContainer" id="secondPage__imagesContainer">
          {this.state.images.length < 1
          ? <h2 style={{color: "red"}}>No results for the chosen queries. Please, try with another ones.</h2>
          : null}

          {this.state.images.length > 0
          ? <ImagesBlock orientation="left" images={this.state.images} checkIfParticularPicIsOpen={this.checkIfParticularPicIsOpen}
          getDataOfParticularPic={this.getDataOfParticularPic} />
          : null}

          {this.state.images.length > 0
          ? <ImagesBlock orientation="mid" images={this.state.images} checkIfParticularPicIsOpen={this.checkIfParticularPicIsOpen}
          getDataOfParticularPic={this.getDataOfParticularPic} />
          : null}

          {this.state.images.length > 0
          ? <ImagesBlock orientation="right" images={this.state.images} checkIfParticularPicIsOpen={this.checkIfParticularPicIsOpen}
          getDataOfParticularPic={this.getDataOfParticularPic} />
          : null}

          {this.state.images.length > 0
          ? <ImagesBlock orientation="resize" images={this.state.images} checkIfParticularPicIsOpen={this.checkIfParticularPicIsOpen}
          getDataOfParticularPic={this.getDataOfParticularPic} />
          : null}
          
          {this.state.showParticularPic ? <OpenedImage picToOpenData={this.state.picToOpenData} 
          openImage={this.openImage} /> : null}
        </div>
          {this.state.checkIfFetchReturnsNothing && this.state.images.length > 0
          ? <p id="noMoreImgs">No more photos to display for '{this.state.query}' query.</p>
          : null}
      </div>
    )}
  }

  export default withRouter(SecondPage)