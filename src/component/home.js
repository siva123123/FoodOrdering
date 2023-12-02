import React, { Component } from "react";
import Wallpaper from "./wallpaper";
import Quicksearch from "./quicksearch";
import axios from 'axios';

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      locationData: [],
      mealsData: [],
    };
  }

  componentDidMount() {
    sessionStorage.clear()
    axios({
      url: 'http://localhost:8060/location',
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(res => {
      this.setState({ locationData: res.data.location });
    })
    .catch(err => console.log(err));

    axios({
      url: 'http://localhost:8060/meals',
      method: 'GET',
      headers: { "Content-Type": 'application/json' }
    })
      .then(res => {
        this.setState({ mealsData: res.data.meals });
      })
      .catch(err => console.log(err));
  }

  render() {
    return (
      <div>
        <Wallpaper ddlocations={this.state.locationData} />
        <Quicksearch mealsData={this.state.mealsData} />
      </div>
    );
  }
}

export default Home;
