import React, { Component } from "react";
import { withRouter } from "react-router-dom/cjs/react-router-dom.min";
import '../style/home.css'
import Card from 'react-bootstrap/Card';


class Quicksearchitem extends Component{
  handleNavigate=(mealtypeId)=>{
    const location_id=sessionStorage.getItem("id")
    if(location_id){
      this.props.history.push(`/filter?meals=${mealtypeId}&location=${location_id}`)
    }
    else{
      this.props.history.push(`/filter?meals=${mealtypeId}`)
    }
    
  }

    render(){
        const {name,content,image, mealtype_id}=this.props.QuicksearchitemData
       return(
         <div>
      <Card  style={{marginRight:"36px",display:"flex",flexWrap:'wrap', width: '23rem', marginTop:'30px' }} onClick={()=>this.handleNavigate(mealtype_id)}>
      <Card.Img  src={`./${image}`} width="100px" height={150} />
      <Card.Body>
        <Card.Title style={{fontSize:"25px", fontWeight:"bold"}}>{name}</Card.Title>
        <Card.Text>
          {content}
        </Card.Text>
      </Card.Body>  
    </Card>

    </div>
          
        )
    }
}

export default withRouter(Quicksearchitem);