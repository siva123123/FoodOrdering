import React, { useState, useEffect } from "react";
import '../style/filter.css';
import Card from 'react-bootstrap/Card';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import ButtonToolbar from 'react-bootstrap/ButtonToolbar';
import querString from 'query-string';
import axios from "axios";
import { useLocation, useNavigate } from 'react-router-dom';

const Filter = () => {
    const [restaurents, setRestaurents] = useState([]);
    const [locations, setLocations] = useState([]);
    const [mealtype_id, setMealtypeId] = useState(undefined);
    const [location, setLocation] = useState(0);
    const [cusine, setCusine] = useState([]);
    const [lcost, setLcost] = useState(undefined);
    const [hcost, setHcost] = useState(undefined);
    const [sort, setSort] = useState(1);
    const [page, setPage] = useState(1);
    const [pagecount, setPagecount] = useState([]);

    const locationHook = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const qs = querString.parse(locationHook.search);
        const mealtype_id = Number(qs.meals);
        const location = Number(qs.location);
        
        const filterobj = {
            mealtype_id: mealtype_id,
            location,
        };

        axios({
            method: 'POST',
            url: 'http://localhost:8060/filter',
            headers: { "Content-Type": 'application/json' },
            data: filterobj
        })
        .then(res => {            
            console.log(res.data.restaurents);
            setRestaurents(res.data.restaurents);
            setMealtypeId(mealtype_id);
            setLocation(location);
            setPagecount(res.data.pagecount);
        })
        .catch(err => console.log(err));

        axios({
            method: 'GET',
            url: 'http://localhost:8060/location',
            headers: { 'Content-Type': 'application/json' }
        })
        .then((response) => {
            setLocations(response.data.location);
        })
        .catch((error) => {
            console.error(error);
        });
    }, [locationHook.search]);

    const handlelocationchange = (event) => {
        const locationId = event.target.value;
        const qs = querString.parse(locationHook.search);
        const meal = Number(qs.meals);

        const filterobj = {
            mealtype_id: meal,
            location_id: locationId,
        };

        axios({
            method: 'POST',
            url: 'http://localhost:8060/filter',
            headers: { 'Content-Type': 'application/json' },
            data: filterobj,
        })
        .then((res) => {
            console.log(res.data, locationId);
            setRestaurents(res.data.restaurents);
            setLocation(locationId);
            setPagecount(res.data.pagecount);
        })
        .catch((err) => console.log(err));
    };

    const handlecusine = (cusineId) => {
        const updatedCusine = [...cusine];
        const index = updatedCusine.indexOf(cusineId);
        
        if (index !== -1) {
            updatedCusine.splice(index, 1);
        } else {
            updatedCusine.push(cusineId);
        }

        const filterobj = {
            mealtype_id: Number(mealtype_id),
            locations,
            cuisine_id: updatedCusine.length === 0 ? undefined : updatedCusine,
            lcost,
            hcost,
            sort,
            page,
            pagecount
        };

        axios({
            method: 'POST',
            url: `http://localhost:8060/filter`,
            headers: { "Content-Type": 'application/json' },
            data: filterobj
        })
        .then(res => {            
            console.log(res.data, updatedCusine);
            setRestaurents(res.data.restaurents);
            setCusine(updatedCusine);
            setPagecount(res.data.pagecount);
        })
        .catch(err => console.log(err));
    };

    const handlecost = (newLcost, newHcost) => {
        const filterobj = {
            mealtype_id: Number(mealtype_id),
            lcost: newLcost,
            hcost: newHcost
        };

        axios({
            method: 'POST',
            url: `http://localhost:8060/filter`,
            headers: { "Content-Type": 'application/json' },
            data: filterobj
        })
        .then(res => {            
            console.log(res.data);
            setRestaurents(res.data.restaurents);
            setLcost(newLcost);
            setHcost(newHcost);
            setPagecount(res.data.pagecount);
        })
        .catch(err => console.log(err));
    };

    const handlesort = (newSort) => {
        const filterobj = {
            mealtype_id: Number(mealtype_id),
            sort: newSort,
            locations,
            cusine,
            lcost,
            hcost,
            page,
            pagecount
        };

        axios({
            method: 'POST',
            url: `http://localhost:8060/filter`,
            headers: { "Content-Type": 'application/json' },
            data: filterobj
        })
        .then(res => {            
            console.log(res.data);
            setRestaurents(res.data.restaurents);
            setSort(newSort);
            setPagecount(res.data.pagecount);
        })
        .catch(err => console.log(err));
    };

    const pagechange = (newPage) => {
        const filterObj = {
            mealtype_id: Number(mealtype_id),
            page: newPage,
        };

        axios({
            method: 'POST',
            url: `http://localhost:8060/filter`,
            headers: { "Content-Type": 'application/json' },
            data: filterObj,
        })
        .then(res => {            
            console.log(res.data);
            setRestaurents(res.data.restaurents);
            setPagecount(res.data.pagecount);
            setPage(newPage);
        })
        .catch(err => console.log(err));
    };

    const handlenavigate = (resid) => {
        navigate(`/details?restaurent=${resid}`);
    };

    return (
        <div>
            <h1>Restaurent Place in TamilNadu</h1>
            <div className="filter">
                <div className="left-side">
                    <h2>Filters</h2>
                    <div className="left-margin">
                        <label style={{fontWeight:"bold"}}>Select Location</label>
                        <br></br>
                        <select onChange={handlelocationchange} className="left-option">
                            <option value={0}>Select the option</option>
                            {locations.map(item => {
                                return <option key={item.location_id} value={item.location_id} className="Bengaluru">
                                    {item.name},
                                </option>
                            })}
                        </select>
                        <br></br>

                        <label style={{fontWeight:"bold"}}>Cusine</label>
                        <br></br>
                        <input style={{marginTop:"15px"}} type="checkbox" onChange={() => handlecusine(1)}/>NorthIndian<br></br>
                        <input type="checkbox" onChange={() => handlecusine(2)}/>SouthIndian<br></br>
                        <input type="checkbox" onChange={() => handlecusine(3)}/>Chines<br></br>
                        <input type="checkbox" onChange={() => handlecusine(4)}/>Fast Food<br></br>
                        <input style={{marginBottom:"15px"}} type="checkbox" onChange={() => handlecusine(5)}/>Street Food<br></br>

                        <label style={{fontWeight:"bold"}}>Cost </label> <br></br>
                        <input style={{marginTop:"15px"}} name="radio" type="radio" onChange={() => handlecost(1,200)}/>Less than 200 <br></br>
                        <input type="radio" name="radio" onChange={() => handlecost(200,500)}/>200 to 500 <br></br>
                        <input type="radio" name="radio" onChange={() => handlecost(500,800)}/>500 to 800 <br></br>
                        <input style={{marginBottom:"15px"}} type="radio" name="radio" onChange={() => handlecost(800,5000)}/>800 to 1000<br></br>
                        <label style={{fontWeight:"bold"}}>Sort</label><br></br>

                        <input style={{marginTop:"15px"}} type="radio" name="sort" onChange={() => handlesort('asc')} checked={sort === 'asc'}/>Price Low to High<br></br>
                        <input type="radio" name="sort" onChange={() => handlesort('desc')} checked={sort === 'desc'}/>price High to Low<br></br>
                    </div>                    
                </div>
                <div className="Right-side">
                    {restaurents.length > 0 ? (
                        <div>
                            {restaurents.map(item => {
                                return (
                                    <div key={item._id} className="right-list">
                                        <div className="card" style={{backgroundColor:"lightgray"}} onClick={() => handlenavigate(item._id)}>
                                            <Card style={{display:"flex", width: '100%', backgroundColor:"lightgray"}}>
                                                <Card.Img className="imgae-right" variant="left" src={`${item.thumb}`} width={150} height={120} />
                                                <Card.Body className="text-right">
                                                    <Card.Title style={{fontWeight:"bold", fontSize:"30px"}}>{item.name}</Card.Title>
                                                    <Card.Text>{item.locality}</Card.Text>
                                                    <Card.Text>{item.city}</Card.Text>
                                                </Card.Body>
                                            </Card>
                                            <hr className="line-right"></hr>
                                            <h5>Cusine:{item.cuisine_id.map((cuisineItem, index) => {
                                                return <span key={index}>{cuisineItem.name} </span>
                                            })}</h5>
                                            <h5>Cost: {item.cost}</h5>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <h1>No Records Found</h1>
                    )}
                    
                    {restaurents.length > 0 ? (
                        <ButtonToolbar style={{marginLeft:"40%", marginBottom:"20px", textAlign:"center"}} aria-label="Toolbar with button groups">
                            <ButtonGroup className="me-2" aria-label="First group">
                                <div>
                                    {pagecount.map((pageNum) => {
                                        return (
                                            <button 
                                                style={{fontSize:"20px", width:"25px", cursor:"pointer", backgroundColor:"#0b5ed7", borderColor:"white"}} 
                                                key={pageNum} 
                                                onClick={() => pagechange(pageNum)}
                                            >
                                                {pageNum}
                                            </button>
                                        );
                                    })}
                                </div>
                            </ButtonGroup>
                        </ButtonToolbar>
                    ) : null}
                </div>
            </div>
        </div>
    );
};

export default Filter;