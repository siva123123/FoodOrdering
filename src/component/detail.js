import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../style/detail.css';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import queryString from 'query-string';
import axios from 'axios';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import ModalBody from 'react-bootstrap/esm/ModalBody';
import StripeCheckout from 'react-stripe-checkout';
import { useLocation } from 'react-router-dom';

const Detail = () => {
  const [restaurents, setRestaurents] = useState({});
  const [resid, setResid] = useState(undefined);
  const [menuItem, setMenuItem] = useState([]);
  const [ismodalOpen, setIsModalOpen] = useState(false);
  const [ispayopen, setIspayopen] = useState(false);
  const [closePaymentForm, setClosePaymentForm] = useState(false);
  const [closePaymentSuccess, setClosePaymentSuccess] = useState(false);
  const [paymentform, setPaymentform] = useState(false);
  const [orderedMenuItem, setOrderedMenuItem] = useState([]);
  const [shouldLogin, setShouldLogin] = useState(false);
  const [subTotal, setSubTotal] = useState(0);
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState(undefined);
  const [Address, setAddress] = useState(undefined);
  const [contact, setContact] = useState(undefined);
  const [loading, setLoading] = useState(false);
  const [isPaymentSuccess, setIsPaymentSuccess] = useState(false);

  const location = useLocation();

  useEffect(() => {
    const qs = queryString.parse(location.search);
    const { restaurent } = qs;

    axios({
      method: 'GET',
      url: `http://localhost:8060/restaurent/${restaurent}`,
      headers: { "Content-Type": "application/json" }
    })
    .then(res => {
      setRestaurents(res.data.restaurent);
      setResid(restaurent);
    })
    .catch(err => console.log(err));
  }, [location.search]);

  const handleorder = (resid) => {
    axios({
      method: 'GET',
      url: `http://localhost:8060/meanuitem/${resid}`,
      headers: { "Content-Type": "application/json" }
    })
    .then(res => {
      setMenuItem(res.data.meanu);
    })
    .catch(err => console.log(err));
  };

  const handlemodal = (state, value) => {
    if (state === "ismodalOpen" && value === true) {
      axios({
        method: 'GET',
        url: `http://localhost:8060/meanuitem/${resid}`,
        headers: { "Content-Type": "application/json" }
      })
      .then(res => {
        setMenuItem(res.data.meanu);
      })
      .catch(err => console.log(err));
    }
    
    if (state === "ismodalOpen") {
      setIsModalOpen(value);
    }
  };

  const handlepayopen = () => {
    const orderedItem = menuItem.filter((item) => item.qty !== 0);
    console.log(orderedItem);
    
    if (orderedItem && subTotal > 0) {
      localStorage.setItem('cartvalue', JSON.stringify({
        restaurents,
        resid,
        menuItem,
        orderedMenuItem: orderedItem,
        subTotal,
        email,
        username,
        Address,
        contact
      }));
    }
    
    const loginData = localStorage.getItem('loginData');
    console.log(loginData);
    
    if (loginData) {
      setPaymentform(true);
      setOrderedMenuItem(orderedItem);
    } else {
      localStorage.setItem('shouldLogin', true);
      setShouldLogin(true);
      setIsModalOpen(false);
    }
  };

  const handleitem = (index, operation) => {
    let total = 0;
    let items = [...menuItem];
    
    items[index].menu_items.map(item => {
      if (operation === 'add') {
        item.qty += 1;
      } else {
        item.qty -= 1;
      }
      total += item.qty * item.price;
    });
    
    setMenuItem(items);
    setSubTotal(total);
  };

  const handleform = (event, state) => {
    const value = event.target.value;
    switch (state) {
      case 'email':
        setEmail(value);
        break;
      case 'username':
        setUsername(value);
        break;
      case 'Address':
        setAddress(value);
        break;
      case 'contact':
        setContact(value);
        break;
      default:
        break;
    }
  };

  const closePaymentFormHandler = () => {
    setPaymentform(false);
  };

  const makePayment = (token) => {
    setLoading(true);
    const productList = menuItem.filter((item) => item.price !== 0);
    const product = productList.map(item => item.name);
    const body = {
      token,
      product,
      subTotal
    };
    const headers = {
      "Content-Type": "application/json"
    };

    return fetch(`http://localhost:8060/charge`, {
      method: "POST",
      headers,
      body: JSON.stringify(body)
    })
    .then(response => {
      console.log("RESPONSE ", response);
      const { status } = response;
      console.log("STATUS ", status);
      
      const address = {
        name: token.card.name,
        address_line: token.card.address_line1,
        city: token.card.address_city
      };
      
      var d = new Date();
      const date = d.toString();

      localStorage.removeItem('cartValue');
      localStorage.removeItem('cartQty');
      localStorage.setItem('orderData', JSON.stringify(orderedMenuItem));
      localStorage.setItem('restaurents', JSON.stringify(restaurents));
      localStorage.setItem('subTotal', subTotal);
      localStorage.setItem('address', JSON.stringify(address));
      localStorage.setItem('date', date);
      
      setIsPaymentSuccess(true);
      setPaymentform(false);
      setIsModalOpen(false);
      setSubTotal(0);
      setLoading(false);
    })
    .catch(error => {
      console.log(error);
      setLoading(false);
    });
  };

  const closePaymentSuccessHandler = () => {
    setIsPaymentSuccess(false);
  };

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
        <Button 
          onClick={() => handlemodal("ismodalOpen", true)} 
          style={{ position: 'absolute', right: "0", backgroundColor: 'red' }}
        >
          Place an Order
        </Button>

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

      <Modal 
        show={ismodalOpen} 
        onHide={() => handlemodal("ismodalOpen", false)} 
        size="lg md sm"
        aria-labelledby="modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <h1>{restaurents.name}</h1>
        </Modal.Header>
        <ModalBody>
          <h3>SubTotal:{subTotal}</h3>
          <h3><button onClick={handlepayopen}>Continue</button></h3>
          {menuItem && menuItem.map((item, index) => {
            return (
              <div key={index}>
                {item.menu_items && item.menu_items.map((menuItemDetail) => {
                  return (
                    <div key={menuItemDetail.id} className='outer'>
                      <div className='left'>
                        <h2>{menuItemDetail.name}</h2>
                        <h4>${parseFloat(menuItemDetail.price)}</h4>
                        <p>{menuItemDetail.description}</p>
                      </div>
                      <div className='right'>
                        <div>
                          <img 
                            src={`${menuItemDetail.image_url}`} 
                            alt='not found' 
                            width="100px" 
                            height="60px"
                          />
                        </div>
                        {menuItemDetail.qty <= 0 ?
                          <button 
                            className='addItem' 
                            onClick={() => handleitem(index, 'add')}
                          >
                            ADD
                          </button>
                          :
                          <div>
                            <button 
                              className='plusItem' 
                              onClick={() => handleitem(index, 'decrease')}
                            >
                              -
                            </button>
                            <span className='plusItem-out'>{menuItemDetail.qty}</span>
                            <button 
                              className='minusItem' 
                              onClick={() => handleitem(index, 'add')}
                            >
                              +
                            </button>
                          </div>
                        }
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </ModalBody>
      </Modal>

      <Modal 
        show={paymentform}  
        size="lg md sm"
        aria-labelledby="modal-title-vcenter"
        centered
      >
        <button style={{ width: "50px" }} onClick={closePaymentFormHandler}>Close</button>
        {subTotal > 0 ? 
          <div style={{ width: '80%' }}>
            <h1 style={{ margin: '10px' }}>Order Summary</h1>
            <div style={{ height: '350px', marginLeft: "20%" }}>
              <div style={{ padding: '10px', background: 'rgb(248, 248, 248)' }}>
                <div style={{ fontSize: '24px', fontWeight: '600px', color: '#192f60' }}>
                  {restaurents.name}
                </div>
                <div style={{ fontSize: '14px' }}>
                  {restaurents.locality}, {restaurents.city_name}
                </div>
              </div>

              {orderedMenuItem.map((item, index) => {
                return (
                  <div key={index}>
                    <img 
                      src={restaurents.thumb} 
                      alt="" 
                      height="50" 
                      width="50" 
                      style={{ borderRadius: '10px', margin: '10px' }} 
                    />
                    <span style={{ fontSize: '12px' }}>
                      {item.qty} &#215; {item.name}
                    </span>
                    <span style={{ fontSize: '12px', margin: '25px 10px 0 0px', float: 'right' }}>
                      ₹{item.qty * item.price}
                    </span>
                    <hr style={{ margin: '0' }} />
                  </div>
                );
              })}
              
              <div style={{ padding: '10px' }}>
                <span style={{ fontSize: '18px', fontWeight: 'bold' }}>Grandtotal</span>
                <span style={{ fontSize: '18px', float: 'right', fontWeight: 'bold' }}>
                  ₹{subTotal}
                </span>
              </div>
              <hr />
            </div>
            
            <div className="payment-form-footer">
              <StripeCheckout
                stripeKey="pk_test_51OHhpdSHOPCy8W3AVQIjiMuS5IfbM65Tex6d5uBnxijrTIUDyzr8QDnUQZLgVs9pe9kaOQTw2WhHCZKwzqQ8TxII00ZR46g3hA"
                token={makePayment}
                name={restaurents.name}
                amount={subTotal * 100}
                currency="INR"
                image={restaurents.thumb}
                shippingAddress
                billingAddress
                alipay
                bitcoin
              >
                <button className="payment-form-button">Proceed</button>
              </StripeCheckout>
            </div>
          </div> 
          :
          <div style={{ padding: '10px', color: 'orange', width: '300px', fontSize: '16px', fontWeight: 'bold' }}>
            Please select the items!!!
          </div>
        }
      </Modal>

      <Modal show={isPaymentSuccess}>
        <div style={{ padding: '10px 40px' }}>
          <button className="carousel-button" onClick={closePaymentSuccessHandler}>
            <span style={{ margin: '10px' }} className="glyphicon glyphicon-remove"></span>
          </button>
          <img 
            src="https://momentumacademy.net/wp-content/uploads/2020/05/Paymentsuccessful21.png" 
            alt="" 
            width="100%" 
          />
        </div>
      </Modal>
    </div>
  );
};

export default Detail;