import React from "react";
import axios from 'axios';
import "../style/home.css";
import { withRouter } from "react-router-dom/cjs/react-router-dom"; // Corrected import statement

class Wallpaper extends React.Component {
  constructor(props) {
    super(props);       
    this.state = {
      restaurants: [ ],
      restaurantList:[],
      suggestions:[],
      text: '',
      selectedLocation: '',
    };
    this.handleLocationChange = this.handleLocationChange.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
  }
  
  componentDidMount() {
    this.fetchData();
  }

  fetchData() {
      axios.get(`http://localhost:8060/restaurent`, { headers: { 'Content-Type': 'application/json' } })
      .then((response) => {
        console.log(response.data)
        this.setState({ restaurants: response.data.restaurent });
      })
      .catch((error) => {
        console.error(error);
      });
  }

  handleLocationChange(event) {
    const id = event.target.value;
    sessionStorage.setItem("id", id);
    axios.get(`http://localhost:8060/location/${id}`, { headers: { 'Content-Type': 'application/json' } })
      .then((response) => {
        this.setState({ restaurantList: response.data.restaurent });
      })
      .catch((error) => {
        console.error(error);
      });
  }
 
  handleSearch(event) {
    const inputText = event.target.value;
     
    const { restaurants } = this.state;
    const filteredRestaurants = [];
    
    for (let i = 0; i < restaurants.length; i++) {
      const restaurantName = restaurants[i].name.toLowerCase();
      
      if (restaurantName.includes(inputText)) {
        filteredRestaurants.push(restaurants[i]);
      }
    }
    
  
    this.setState({ suggestions: filteredRestaurants, text: inputText });
   
   
   //this.setState({suggestions:suggestions, text:inputText})
  }
  showsuggestion=()=>{
    const{ suggestions, text}= this.state
    console.log(this.state.text+"sug")
    if(suggestions.length===0 && text===undefined){
      return null
    }
    if(suggestions.length>0 && text===""){
      return null
    }
    if(suggestions.length===0&& text){
      return<div><li> no result Found </li></div>
    }
    return(
      <ul className="suggestion">{suggestions.map((item,index)=>(<li className="res_result" key={index} onClick={()=>this.handleNavigate(item._id)}>{item.name}</li>))}</ul>
    )

  }
 
  handleNavigate(resid) {
    this.props.history.push(`/details?restaurent=${resid}`)
  }

  render() {
    const { ddlocations } = this.props;
    console.log(ddlocations)
    return (
      <div className="head-section">
        <div>
          <div className="image">
            <img src="https://wallpapercave.com/wp/wp8202427.jpg" height="600px" width="100%" alt="not found" />
          </div>
          <div className="logo">e!</div>
          <h1 className="head-logo">Find the Best Restaurants, cafes and Bar</h1>

          <form className="form">
            <select className="option" placeholder="Select" onChange={this.handleLocationChange}>
              <option className="Bengaluru" value="0">Please Select a location</option>
              {ddlocations.map((item) => (
                <option key={item.location_id} value={item.location_id} className="Bengaluru">
                  {item.name},{item.city}
                </option>
              ))}
            </select>
            <span>
            <input className="inputRes" placeholder="Type Restaurant name" type="text" onChange={this.handleSearch} />
           {this.showsuggestion()}
           </span>
          </form>
        </div>
      </div>
    );
  }
}

export default withRouter(Wallpaper);
