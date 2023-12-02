import React, { Component } from "react";
import '../style/filter.css';
import Card from 'react-bootstrap/Card';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import ButtonToolbar from 'react-bootstrap/ButtonToolbar';
import querString from 'query-string';
import axios from "axios";



class Filter extends Component{
    constructor(){
        super();
        this.state={
            restaurents:[],
            locations:[],
            mealtype_id:undefined,
            location:0,
            cusine:[],
            lcost:undefined,
            hcost:undefined,
            sort:1,
            page:1,
            pagecount:[]
        }
    }
    componentDidMount(){
       const qs= querString.parse(this.props.location.search)
       const mealtype_id=Number(qs.meals)
       const location=Number(qs.location)
        
       const filterobj={
        mealtype_id:mealtype_id,
        location,
        
       }
        axios({
        method: 'POST',
        url: 'http://localhost:8060/filter',
        headers: { "Content-Type": 'application/json' },
        data:filterobj
      })
        .then(res => {            
           console.log(res.data.restaurents) 
          this.setState({ restaurents: res.data.restaurents, mealtype_id,location, pagecount:res.data.pagecount});
        })
        .catch(err => console.log(err));

        axios({
            method:'GET',
            url:'http://localhost:8060/location',
             headers: { 'Content-Type': 'application/json' } })
      .then((response) => {
        this.setState({ locations: response.data.location });
      })
      .catch((error) => {
        console.error(error);
      });
    }

    handlelocationchange = (event) => {
      const locationId = event.target.value;
      const qs = querString.parse(this.props.location.search);
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
          this.setState({ restaurents: res.data.restaurents, location: locationId ,pagecount:res.data.pagecount});
        })
        .catch((err) => console.log(err));
    };


    handlecusine=(cusineId)=>{
      
      const { mealtype_id,
        locations,
        cusine,
        lcost,
        hcost,
        sort,
        page,
        pagecount}=this.state
        const index=cusine.indexOf(cusineId)
        if (index !== -1) {
          // If found, remove from array
          cusine.splice(index, 1);
        } else {
          // If not found, add to array
          cusine.push(cusineId);
        }
      const filterobj={
       mealtype_id:Number(mealtype_id),
       locations,
       cuisine_id: cusine.length===0 ?undefined:cusine,
        lcost,
        hcost,
        sort,
        page,
        pagecount
       
      }
       axios({
       method: 'POST',
       url: `http://localhost:8060/filter`,
       headers: { "Content-Type": 'application/json' },
       data:filterobj
     })
       .then(res => {            
           console.log(res.data,cusine)
         this.setState({ restaurents: res.data.restaurents,cusineId, pagecount:res.data.pagecount});
       })
       .catch(err => console.log(err));

    }

    handlecost=(lcost,hcost)=>{
      const {mealtype_id}=this.state
      const filterobj = {
        mealtype_id: Number(mealtype_id),
        lcost,
        hcost
      };
      axios({
        method: 'POST',
        url: `http://localhost:8060/filter`,
        headers: { "Content-Type": 'application/json' },
        data:filterobj
      })
        .then(res => {            
            console.log(res.data)
          this.setState({ restaurents: res.data.restaurents,lcost,hcost, pagecount:res.data.pagecount});
        })
        .catch(err => console.log(err));

    }

    handlesort=(sort)=>{
      const {mealtype_id,
        locations,
        cusine,
        lcost,
        hcost,
        page,
        pagecount}=this.state
      const filterobj = {
        mealtype_id: Number(mealtype_id),
        sort:sort,
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
        data:filterobj
      })
        .then(res => {            
            console.log(res.data)
          this.setState({ restaurents: res.data.restaurents, sort, pagecount:res.data.pagecount});
        })
        .catch(err => console.log(err));

    }
    pagechange=(page)=>{
      const { mealtype_id } = this.state; // Assuming you have mealtype_id in your component state
  const filterObj = {
    mealtype_id: Number(mealtype_id),
    page: page,
  };

  axios({
    method: 'POST',
    url: `http://localhost:8060/filter`,
    headers: { "Content-Type": 'application/json' },
    data: filterObj,
  })
    .then(res => {            
      console.log(res.data);
      this.setState({ restaurents: res.data.restaurents, pagecount: res.data.pagecount, currentPage: page });
    })
    .catch(err => console.log(err));
    }

    handlenavigate=(resid)=>{
      this.props.history.push(`/details?restaurent=${resid}`)
    }


    render(){
      
        const {restaurents,locations, pagecount}=this.state
                
    return(
        <div>
            <h1>Restaurent Place in TamilNadu</h1>
            <div className="filter">
                <div className="left-side">
                    <h2>Filters</h2>
                    <div className="left-margin">
                    <label style={{fontWeight:"bold"}}>Select Location</label>
                    <br></br>
                    <select onChange={this.handlelocationchange} className="left-option" >
                        <option value={0}>Select the option</option>
                        {locations.map(item => {
                          return  <option key={item.location_id} value={item.location_id} className="Bengaluru">
                  {item.name},</option>})}
                    </select>
                    <br></br>

                    <label style={{fontWeight:"bold"}}>Cusine</label>
                    <br></br>
                    <input style={{marginTop:"15px"}} type="checkbox" onChange={()=>this.handlecusine(1)}/>NorthIndian<br></br>
                    <input type="checkbox" onChange={()=>this.handlecusine(2)}/>SouthIndian<br></br>
                    <input type="checkbox" onChange={()=>this.handlecusine(3)}/>Chines<br></br>
                    <input type="checkbox" onChange={()=>this.handlecusine(4)}/>Fast Food<br></br>
                    <input style={{marginBottom:"15px"}} type="checkbox" onChange={()=>this.handlecusine(5)}/>Street Food<br></br>

                    <label style={{fontWeight:"bold"}}>Cost </label> <br></br>
                    <input style={{marginTop:"15px"}} name="radio" type="radio" onChange={()=>this.handlecost(1,200)}/>Less than 200 <br></br>
                    <input type="radio" name="radio" onChange={()=>this.handlecost(200,500)}/>200 to 500 <br></br>
                    <input type="radio" name="radio" onChange={()=>this.handlecost(500,800)}/>500 to 800 <br></br>
                    <input style={{marginBottom:"15px"}} type="radio" name="radio" onChange={()=>this.handlecost(800,5000)}/>800 to 1000<br></br>
                    <label style={{fontWeight:"bold"}}>Sort</label><br></br>

                    <input style={{marginTop:"15px"}} type="radio" name="sort" onChange={() => this.handlesort('asc')} checked={this.state.sort === 'asc'}/>Price Low to High<br></br>
                    <input type="radio" name="sort" onChange={() => this.handlesort('desc')} checked={this.state.sort === 'desc'}/>price High to Low<br></br>
                    </div>                    
                </div>
                <div className="Right-side">{restaurents.length>0?<div>
                    {restaurents.map(item=>{
                        return <div className="right-list">
                        <div className="card" style={{backgroundColor:"lightgray"}} onClick={()=>this.handlenavigate(item._id)}>
                        <Card style={{display:"flex", width: '100%',backgroundColor:"lightgray" }}>
                        <Card.Img className="imgae-right" variant="left" src={`${item.thumb}`} width={150} height={120}  />
                        <Card.Body className="text-right">
                            <Card.Title style={{fontWeight:"bold", fontSize:"30px"}}>{item.name}</Card.Title>
                            <Card.Text>{item.locality}</Card.Text>
                            <Card.Text>{item.city}</Card.Text>
                            </Card.Body>
                            </Card>
                        <hr className="line-right" ></hr>
                        <h5>Cusine:{item.cuisine_id.map(item=>{return <span>{item.name} </span>})}</h5>
                        <h5>Cost: {item.cost}</h5>
                        </div>
                        </div>
                    })}</div>: <h1 > No Records Found</h1>}
                    {restaurents.length>0 ?
                    <ButtonToolbar style={{marginLeft:"40%",marginBottom:"20px",textAlign:"center"}} aria-label="Toolbar with button groups">
                    <ButtonGroup className="me-2" aria-label="First group">
                     
                      <div>
                        
                        {pagecount.map((page)=>{
                        return <button style={{fontSize:"20px",width:"25px", cursor:"pointer", backgroundColor:"#0b5ed7", borderColor:"white"}} key={page} onClick={()=>this.pagechange(page)}>{page}</button>
                      })}
                        
                      </div>
                     
                    </ButtonGroup>
                    </ButtonToolbar>
   :null }
                </div>

            </div>

        </div>
    )
}
}

export default Filter