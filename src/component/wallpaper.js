import React, { useEffect, useState } from "react";
import axios from 'axios';
import "../style/home.css";
import { useNavigate } from "react-router-dom";

const Wallpaper = ({ ddlocations }) => {
  const [restaurants, setRestaurants] = useState([]);
  const [restaurantList, setRestaurantList] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [text, setText] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    axios.get(`http://localhost:8060/restaurent`, {
      headers: { 'Content-Type': 'application/json' }
    })
    .then((response) => {
      
      setRestaurants(response.data.restaurent);
    })
    .catch((error) => {
      console.error(error);
    });
  };

  const handleLocationChange = (event) => {
    const id = event.target.value;
    sessionStorage.setItem("id", id);

    axios.get(`http://localhost:8060/location/${id}`, {
      headers: { 'Content-Type': 'application/json' }
    })
    .then((response) => {
      setRestaurantList(response.data.restaurent);
    })
    .catch((error) => {
      console.error(error);
    });
  };

  const handleSearch = (event) => {
    const inputText = event.target.value.toLowerCase();
    const filteredRestaurants = restaurants.filter(r =>
      r.name.toLowerCase().includes(inputText)
    );
    setSuggestions(filteredRestaurants);
    setText(event.target.value);
  };

  const showSuggestion = () => {
    if (!text) return null;
    if (suggestions.length === 0) {
      return <div><li>No results found</li></div>;
    }

    return (
      <ul className="suggestion">
        {suggestions.map((item, index) => (
          <li className="res_result" key={index} onClick={() => handleNavigate(item._id)}>
            {item.name}
          </li>
        ))}
      </ul>
    );
  };

  const handleNavigate = (resid) => {
    navigate(`/details?restaurent=${resid}`);
  };

  return (
    <div className="head-section">
      <div>
        <div className="image">
          <img
            src="https://wallpapercave.com/wp/wp8202427.jpg"
            height="600px"
            width="100%"
            alt="not found"
          />
        </div>
        <div className="logo">e!</div>
        <h1 className="head-logo">Find the Best Restaurants, Cafes and Bars</h1>

        <form className="form">
          <select className="option" onChange={handleLocationChange}>
            <option className="Bengaluru" value="0">Please Select a location</option>
            {ddlocations.map((item) => (
              <option
                key={item.location_id}
                value={item.location_id}
                className="Bengaluru"
              >
                {item.name}, {item.city}
              </option>
            ))}
          </select>

          <span>
            <input
              className="inputRes"
              placeholder="Type Restaurant name"
              type="text"
              value={text}
              onChange={handleSearch}
            />
            {showSuggestion()}
          </span>
        </form>
      </div>
    </div>
  );
};

export default Wallpaper;
