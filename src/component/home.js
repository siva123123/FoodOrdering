import React, { useState, useEffect } from "react";
import Wallpaper from "./wallpaper";
import Quicksearch from "./quicksearch";
import axios from 'axios';

const Home = () => {
  const [locationData, setLocationData] = useState([]);
  const [mealsData, setMealsData] = useState([]);

  useEffect(() => {
    sessionStorage.clear();
    
    // Fetch location data
    axios({
      url: 'http://localhost:8060/location',
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(res => {
      setLocationData(res.data.location);
    })
    .catch(err => console.log(err));

    // Fetch meals data
    axios({
      url: 'http://localhost:8060/meals',
      method: 'GET',
      headers: { "Content-Type": 'application/json' }
    })
    .then(res => {
      setMealsData(res.data.meals);
    })
    .catch(err => console.log(err));
  }, []); // Empty dependency array means this effect runs once on mount
console.log("0000")
  return (
    <div>
      <Wallpaper ddlocations={locationData} />
      <Quicksearch mealsData={mealsData} />
    </div>
  );
};

export default Home;