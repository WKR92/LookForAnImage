import React from "react";

export default class ImagesBlock extends React.Component{
    constructor(props) {
        super(props);
        this.state ={
          showParticularPic: false,
          thisBlockImages: []
        }
      this.setPicData = this.setPicData.bind(this);
      this.showOnImageInfo = this.showOnImageInfo.bind(this);
      this.hideOnPicImageInfo = this.hideOnPicImageInfo.bind(this);
      }
    componentDidMount(){

      if (this.props.orientation === "left") {this.setState({thisBlockImages: this.props.images === "empty"
      ? this.state.thisBlockImages
      : this.state.thisBlockImages.concat(this.props.images.filter((function(_, i){return i % 3 === 0})))})}

      if (this.props.orientation === "mid") {this.setState({thisBlockImages: this.props.images === "empty"
      ? this.state.thisBlockImages
      : this.state.thisBlockImages.concat(this.props.images.slice(2).filter((function(_, i){return i % 3 === 0})))})}
      
      if (this.props.orientation === "right") {this.setState({thisBlockImages: this.props.images === "empty"
      ? this.state.thisBlockImages
      : this.state.thisBlockImages.concat(this.props.images.slice(1).filter((function(_, i){return i % 3 === 0})))})}
      
      if (this.props.orientation === "resize") {this.setState({thisBlockImages: this.props.images === "empty"
      ? this.state.thisBlockImages
      : this.state.thisBlockImages.concat(this.props.images)})}
    }
    showOnImageInfo(event){

      this.setPicData(event)
      
      const id = event.target.id

      if(this.props.orientation === "resize"){
        const resizeUserInfoDiv = document.getElementById("resize__onImg__innerInfoDiv"+id)
        resizeUserInfoDiv.style["display"] = "flex";
      } else{
        const userInfoDiv = document.getElementById("onImg__innerInfoDiv"+id)
        userInfoDiv.style["display"] = "flex";
      }
    }
    hideOnPicImageInfo(event){
      
      const id = event.target.id

      if(this.props.orientation === "resize"){
        const resizeUserInfoDiv = document.getElementById("resize__onImg__innerInfoDiv"+id)
        resizeUserInfoDiv.style["display"] = "none";
      } else{
        const userInfoDiv = document.getElementById("onImg__innerInfoDiv"+id)
        userInfoDiv.style["display"] = "none";
      }
    }
    setPicData(event){
        
      const id = event.target.id
      const pic = this.state.thisBlockImages.filter(elem => elem.includes(id))        
      
      this.setState({
          imgId: pic[0][6],
          name: pic[0][2],
          profileImg: pic[0][5],
      })
    }
    render(){
        return(
            <div className={this.props.orientation+"ImagesDiv"} id={this.props.orientation+"ImagesDiv"}>
  
            {this.state.thisBlockImages.length > 0 ? this.state.thisBlockImages.map(elem => {
              return (
                <div className={this.props.orientation+"ImageHolder"} id={this.props.orientation+"ImageHolder"+elem[6]}
                 onClick={this.props.getDataOfParticularPic} key={elem[6]} imgid={elem[6]}>
                  <img onMouseEnter={this.showOnImageInfo} onMouseLeave={this.hideOnPicImageInfo} id={elem[6]}
                   className={this.props.orientation+"Img"} alt={elem[7]} src={elem[0]} title={elem[7]} />
                  <div className={this.props.orientation !== "resize" ? "onImg__innerInfoDiv" : "resize__onImg__innerInfoDiv"}
                  id={this.props.orientation !== "resize" ? "onImg__innerInfoDiv"+elem[6] : "resize__onImg__innerInfoDiv"+elem[6]}>
                    <img className="onImg__profile_photo" alt="profile_photo" src={this.state.profileImg} />
                    <div className="onImg__userInfoDiv">
                      <p className="onImg__nameP">{this.state.name}</p>
                    </div>
                  </div>
                </div>
              )
            }) : null}
          </div>
        )
    }
}