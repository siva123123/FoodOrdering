import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../style/detail.css';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import queryString from 'query-string'
import axios from 'axios';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal'
import ModalBody from 'react-bootstrap/esm/ModalBody';
import StripeCheckout from 'react-stripe-checkout'



class Detail extends Component {
  constructor(){
    super();
    this.state={
      restaurents:{},
      resid:undefined,
      menuItem:[],
      ismodalOpen:false,
      ispayopen:false,
      closePaymentForm:false,
      closePaymentSuccess:false,
      paymentform:false,
      orderedMenuItem:[],
      shouldLogin: false,
      subTotal:0,
      email:'',
      username:undefined,
      Address:undefined,
      contact:undefined
    }
  }
  componentDidMount(){
    const qs=queryString.parse(this.props.location.search)
    const {restaurent}=qs
   
    axios({
      method:'GET',
      url:`http://localhost:8060/restaurent/${restaurent}`,
      headers:{"Content-Type":"application/json"}
    })
    .then(res=>{
      
      this.setState({restaurents:res.data.restaurent, resid:restaurent})})
    .catch(err=>console.log(err))
  }
  handleorder=(resid)=>{
    axios({
      method:'GET',
      url:`http://localhost:8060/meanuitem/${resid}`,
      headers:{"Content-Type":"application/json"}
    })
    .then(res=>{
      
      this.setState({menuItem:res.data.meanu})})
    .catch(err=>console.log(err))
  }
 
  handlemodal=(state,value)=>{
    const {resid}= this.state
    if(state==="ismodalOpen" && value===true){
      axios({
        method:'GET',
        url:`http://localhost:8060/meanuitem/${resid}`,
        headers:{"Content-Type":"application/json"}
      })
      .then(res=>{
       
        this.setState({menuItem:res.data.meanu})})
        
      .catch(err=>console.log(err))
    }
    this.setState({[state]:value})
  }

  handlepayopen=()=>{
   const orderedItem=this.state.menuItem.filter((item)=>item.qty!==0)
   console.log(orderedItem)
   if(orderedItem && this.state.subTotal>0){
    localStorage.setItem('cartvalue',JSON.stringify(this.state))
   }
   const loginData=localStorage.getItem('loginData')
   console.log(loginData)
   if(loginData){
    this.setState({paymentform:true, orderedMenuItem:orderedItem})
   }
   else{
    localStorage.setItem('shouldLogin', true)
    this.setState({shouldLogin:true, ismodalOpen:false})
   }

  }

   
    handleitem = (index, operation) => {
      let total=0;
      let items=[...this.state.menuItem]
      items[index].menu_items.map(item=>{
  
      if(operation==='add'){
        item.qty +=1
      }
      else{
        item.qty -=1
      }
      total += item.qty * item.price
    })
      this.setState({menuItem:items, subTotal:total})
    };

    handleform=(event,state)=>{
      this.setState({[state]:event.target.value})
    }



    closePaymentForm = () => {
      this.setState({ paymentform: false });
  }
  // this method is making payment with stripe-checkout
  makePayment = (token) => {
      this.setState({ loading: true });
      const { subTotal } = this.state;
      const productList = this.state.menuItem.filter((item) => item.price !== 0);
      const product = productList.map(item => item.name);
      const body = {
          token,
          product,
          subTotal
      };
      const headers = {
          "Content-Type": "application/json"
      };
      // Make the api call to make payment.
      return fetch(`http://localhost:8060/charge`, {
          method: "POST",
          headers,
          body: JSON.stringify(body)
      })
          .then(response => {
              console.log("RESPONSE ", response);
              const { status } = response;
              console.log("STATUS ", status);
              // Get the user address
              const address = {
                  name: token.card.name,
                  address_line: token.card.address_line1,
                  city: token.card.address_city
              }
              // Get the order time and date
              var d = new Date();
              const date = d.toString();

              // Remove cart values from cart once user ordered.
              localStorage.removeItem('cartValue');
              localStorage.removeItem('cartQty');
              // Store the order details, user-address, order-date and time in local storage.
              localStorage.setItem('orderData', JSON.stringify(this.state.orderMenuItems));
              localStorage.setItem('restaurents', JSON.stringify(this.state.restaurents));
              localStorage.setItem('subTotal', this.state.subTotal);
              localStorage.setItem('address', JSON.stringify(address));
              localStorage.setItem('date', date);
              this.setState({ cartQty: 0, isPaymentSuccess: true, paymentForm: false, menuModalIsOpen: false, subTotal: 0 });
          })
          .catch(error => console.log(error));
  };
  // once payment success a modal will open. we can close it
  closePaymentSuccess = () => {
      this.setState({ isPaymentSuccess: false });
  }

  render() {
    const {restaurents, ismodalOpen, menuItem, subTotal}= this.state
    return (
      <div>
        <div>
          <img
            className="slide"
            src={`${restaurents.thumb}`}
            alt="First slide"
          />
          </div>
       
      
        <div>
      <h1>{restaurents.name}</h1>
      <Button  onClick={()=>this.handlemodal("ismodalOpen",true)} style={{position:'absolute', right:"0", backgroundColor:'red'}}>Place an Order</Button>

      <Tabs
      defaultActiveKey="OverView"
      id="uncontrolled-tab-example"
      className="mb-3"
    >
      <Tab eventKey="OverView" title="OverView">
        <p>About this place</p>
        <div> Name: {restaurents.name}</div>
        <br></br>
        <span>Address: {restaurents.locality},</span>
        <span>{restaurents.city_name}</span>
        <br></br>
        <div>Cost:{restaurents.cost} Max Price</div>
      </Tab>
      <Tab eventKey="Contact" title="Contact">
        <div>{restaurents.contact_number}</div>
        <p>Contact No:988888854</p>
      </Tab>
      
    </Tabs>
      </div>
      <Modal show={ismodalOpen} onHide={()=>this.handlemodal("ismodalOpen",false)} size="lg md sm"
      aria-labelledby="modal-title-vcenter"
      centered>
        <Modal.Header closeButton>
          <h1>{restaurents.name}</h1>
        </Modal.Header>
        <ModalBody>
        <h3>SubTotal:{subTotal}</h3>
          <h3><button onClick={this.handlepayopen}>Continue</button></h3>
          {menuItem && menuItem.map((item, index) => {
  return (
    <div key={index}>
      {item.menu_items && item.menu_items.map((item) => {
         return (
          <div key={item.id} className='outer'>
            <div className='left'>
           <h2>  {item.name}</h2>
            <h4>${parseFloat(item.price)}</h4>
           <p>{item.description}</p>
           </div>
           <div className='right'>
           <div>
           <img src= {`${item.image_url}`} alt='not found' width="100px" height="60px"/>          
           </div> 
           {item.qty<= 0 ?
           <button className='addItem' onClick={()=>this.handleitem(index,'add')} >ADD</button>
           :<div >
            <button className='plusItem' onClick={()=>this.handleitem(index,'decrease')}>-</button>
            <span className='plusItem-out' >{item.qty}</span>
            <button className='minusItem'  onClick={()=>this.handleitem(index,'add')}>+</button>
            </div>}
            </div></div>)})}</div> )})}
                  </ModalBody>
        
      </Modal>

      <Modal show={this.state.paymentform}  size="lg md sm"
      aria-labelledby="modal-title-vcenter"
      centered>
       <button style={{width:"50px"}} onClick={this.closePaymentForm}>Close</button>
        {this.state.subTotal>0?<div style={{ width: '80%' }}>
                            <h1 style={{ margin: '10px' }}>Order Summary</h1>
                            <div style={{ height: '350px', marginLeft:"20%" }}>
                                <div style={{ padding: '10px', background: 'rgb(248, 248, 248)' }}>
                                    <div style={{ fontSize: '24px', fontWeight: '600px', color: '#192f60' }}>{restaurents.name}</div>
                                    <div style={{ fontSize: '14px' }}>{restaurents.locality}, {restaurents.city_name}</div>
                                </div>

                                {this.state.orderedMenuItem.map((item) => {
                                    return <div>
                                        <img src={restaurents.thumb} alt="" height="50" width="50" style={{ borderRadius: '10px', margin: '10px' }} />
                                        <span style={{ fontSize: '12px' }}>{item.qty} &#215; {item.name}</span>
                                        <span style={{ fontSize: '12px', margin: '25px 10px 0 0px', float: 'right' }}>₹{item.qty * item.price}</span>
                                        <hr style={{ margin: '0' }} />
                                    </div>
                                })}
                                <div style={{ padding: '10px' }}>
                                    <span style={{ fontSize: '18px', fontWeight: 'bold' }}>Grandtotal</span>
                                    <span style={{ fontSize: '18px', float: 'right', fontWeight: 'bold' }}>₹{this.state.subTotal}</span>
                                </div>
                                <hr />
                            </div>
                            <div className="payment-form-footer">
                                <StripeCheckout
                                    stripeKey="pk_test_51OHhpdSHOPCy8W3AVQIjiMuS5IfbM65Tex6d5uBnxijrTIUDyzr8QDnUQZLgVs9pe9kaOQTw2WhHCZKwzqQ8TxII00ZR46g3hA"
                                    token={this.makePayment}
                                    name={restaurents.name}
                                    amount={this.state.subTotal * 100}
                                    currency="INR"
                                    image={restaurents.thumb}
                                    shippingAddress
                                    billingAddress
                                    alipay
                                    bitcoin
                                >
                                    <button className="payment-form-button">Proceed</button>
                                </StripeCheckout>
                            </div> </div> 
                            :<div style={{ padding: '10px', color: 'orange', width: '300px', fontSize: '16px', fontWeight: 'bold' }}>Please select the items!!!</div>}
      </Modal>
      <Modal show={this.state.isPaymentSuccess}>
                        <div style={{ padding: '10px 40px' }}>
                            <button className="carousel-button" onClick={this.closePaymentSuccess}><span style={{ margin: '10px' }} className="glyphicon glyphicon-remove"></span></button>
                            <img src="https://momentumacademy.net/wp-content/uploads/2020/05/Paymentsuccessful21.png" alt="" width="100%" />
                        </div>
                    </Modal>
      </div>
    );
  }
}


export default Detail