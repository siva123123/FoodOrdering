import React, { Component } from "react";
import '../style/home.css';
import Quicksearchitem from "./quicksearchItem";

class Quicksearch extends Component {
  render() {
    const { mealsData } = this.props;

    return (
      <div className="bottom-section">
        <h1>Quick Search</h1>
        <h2>Discover the new variety of food</h2>

        <div className="search">
          {mealsData.length > 0 ? (
            mealsData.map((item, index) => (
              <Quicksearchitem key={index} QuicksearchitemData={item} />
            ))
          ) : (
            <p>No data available</p>
          )}
        </div>
      </div>
    );
  }
}

export default Quicksearch;
