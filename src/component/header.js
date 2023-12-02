import React, { Component } from 'react';

import Modal from 'react-modal';
import GoogleLogin from 'react-google-login';
import '../style/header.css'
import { withRouter } from "react-router-dom/cjs/react-router-dom";
import axios from 'axios';


// This is custom styles for modal
const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        padding: '20px'
    }
};

class User extends Component {
    constructor(props) {
        super(props);
        this.state = {
            signinModalOpen: false,
            signupModalOpen: false,
            username: undefined,
            isLoggedin: false,
            imageUrl: undefined,
            email: undefined,
            password: undefined,
            confirmPassword: undefined,
            openCart: false,
            handleEmptyCart: false,
            cartMenuitems: [],
            oldCartRestaurant: '',
            cartSubtotal: undefined,
            openOrder: false,
            orderData: [],
            orderRestaurant: {},
            orderSubtotal: undefined,
            signupError: "",
            loading: false,
            userAddress: {},
            date: '',
        }
    }
    componentDidMount = () => {
        //Get the login credentials from local storage
        let valueOfLocal = localStorage.getItem('loginData');
        let shouldLogin = localStorage.getItem('shouldLogin');
        // User order items when not logged in, Login modal will open
        if (shouldLogin) {
            localStorage.removeItem('shouldLogin');
            this.handleSignin();
        }
        valueOfLocal = JSON.parse(valueOfLocal);
        // If user already logged in get user credential from local storage and set state.
        if (valueOfLocal && valueOfLocal.username) {
            this.setState({ isLoggedin: true, username: valueOfLocal.username, imageUrl: valueOfLocal.imageUrl });
        }
    }
    // It will open login form
    handleSignin = () => {
        this.setState({ signinModalOpen: true });
    }
    // It will close login form
    closeModal = () => {
        this.setState({ signinModalOpen: false, signupError: "", loading: false });
    }
    // It will open sign up form
    handleSignup = () => {
        this.setState({ signupModalOpen: true });
    }
    // It will close sign up form
    closeSignupModal = () => {
        this.setState({ signupModalOpen: false, signupError: "", loading: false });
    }
    // We can switch from login form to signup form
    switchToSignup = () => {
        this.setState({ signinModalOpen: false, signupModalOpen: true, signupError: "", loading: false });
    }
    // we can switch from signup form login form
    switchToSignin = () => {
        this.setState({ signupModalOpen: false, signinModalOpen: true, signupError: "", loading: false });
    }
    // This method authenticate the user through google.
    responseGoogle = (response) => {
        this.setState({ username: response.profileObj.name, imageUrl: response.profileObj.imageUrl, signinModalOpen: false, loading: true });
        localStorage.setItem('loginData', JSON.stringify(this.state));
        window.location.reload();
    }
    // When you click logout button this method will handle.
    handleLogout = () => {
        localStorage.removeItem('loginData');
        window.location.reload();
    }
    // This method authenticate the user through facebook.
  
    // This method get the values of input fields from signup form
    handlesSignupFields = (event) => {
        let name = event.target.name;
        let value = event.target.value;
        this.setState({ [name]: value });
    }
    // This method get the values of input fields from login form
    handleLoginFields = (event) => {
        let name = event.target.name;
        let value = event.target.value;
        this.setState({ [name]: value });
    }
    // This method will handle form validation of signup form
    handleSignupForm = (event) => {
        event.preventDefault();
        const { password, confirmPassword } = this.state;
        let condition = true;
        if (password !== confirmPassword) {
            condition = false;
            this.setState({ signupError: 'Password doesn"t match!' });
        }
        var lowerCaseLetters = /[a-z]/g;
        var numbers = /[0-9]/g;
        if (!numbers.test(password) || !lowerCaseLetters.test(password)) {
            condition = false;
            this.setState({ signupError: "Password should contains letters and numbers" });
        }
        if (condition) {
            this.signupFormApiCall();
        }

    }
    // This method will handle API call to register the new user 
    signupFormApiCall = async () => {
        this.setState({ loading: true });
        const { username, email, password, confirmPassword } = this.state;

        const inputObj = {
            username: username,
            email: email,
            password: password,
            confirmPassword:confirmPassword
        }
        const result = await axios({
            method: 'POST',
            url: 'http://localhost:8060/register',
            headers: { 'Content-Type': 'application/json' },
            data: inputObj
        })
        if (result.data === false) {
            this.setState({ signupError: "you are already logged in! Please Sign in!", loading: false });
        }
        else if(result.data.password!==result.data.confirmPassword){
            this.setState({ signupError: " logged in failed! Please Sign in!", loading: false });
        } 
        else {
            localStorage.setItem('loginData', JSON.stringify(this.state));
            window.location.reload();
        }
    }
    // this method will handle the api call to login user.
    handleLogin = async (event) => {
        event.preventDefault();
        const { email, password } = this.state;
        this.setState({ loading: true });

        const inputObj = {
            email: email,
            password: password
        }
        const result = await axios({
            method: 'POST',
            url: 'http://localhost:8060/login',
            headers: { 'Content-Type': 'application/json' },
            data: inputObj
        })
        if (result.data.length > 0) {
            this.setState({ username: result.data[0].fullname });
            localStorage.setItem('loginData', JSON.stringify(this.state));
            window.location.reload();
        } else {
            this.setState({ signupError: "Please provide a valid username and password.", loading: false });
        }
    }
     openOrderDetails = () => {
        let orderData = localStorage.getItem('orderData');
        orderData = JSON.parse(orderData);
        let orderRestaurant = localStorage.getItem('restaurant');
        orderRestaurant = JSON.parse(orderRestaurant);
        let userAddress = localStorage.getItem('address');
        userAddress = JSON.parse(userAddress);
        let orderSubtotal = localStorage.getItem('subTotal');
        let date = localStorage.getItem('date');
        this.setState({ openOrder: true, orderData, orderRestaurant, orderSubtotal, userAddress, date });
    }
    // This method will close the order details modal
    closeOrderDetails = () => {
        this.setState({ openOrder: false });
    }
    handlelogo=()=>{
        this.props.history.push('/');
    }

    render() {
        const { pathname } = this.props.location;
    const home = pathname === '/' || pathname === '/home'
        // Destructure some variables from state.
        const { signinModalOpen, signupModalOpen, isLoggedin, username,  loading } = this.state;
        let userDetails;
        let firstLetter;
        username ? firstLetter = username[0].toLowerCase() : firstLetter = undefined
        if ( isLoggedin) {
            userDetails = <div>
                 {!home&& <div style={{backgroundColor:"red", height:"50px"}}> 
                
                <span className="firstletter-logo" onClick={this.handlelogo}>{firstLetter}</span>
                <button className="signup" style={{ border: 'none', marginLeft:"-10px",fontSize:"20px" }}>{username}</button>
                <button className="logout" style={{marginLeft:'-50px', top:"12px", color: '#fff'}} onClick={this.handleLogout}>Logout</button>
                
                </div>
                 }
                 {home&& <div> 
                
                <span className="firstletter-logo" >{firstLetter}</span>
                <button className="signup" style={{ border: 'none', marginLeft:"-18px", fontSize:"25px" }}>{username}</button>
                <button className="logout" style={{marginLeft:'-40px', color: 'black', top:"16px"}} onClick={this.handleLogout}>Logout</button>
               
                </div>
                 }
            </div>
        }
        else {
            userDetails = <div>
                {!home&& <div style={{backgroundColor:"red", height:"50px"}}> 
                <div></div>
                <button className="login" onClick={this.handleSignin} style={{ marginLeft: '0px' }}>Login</button>
                <button className="signup" onClick={this.handleSignup}>Create an account</button>
                </div>
                }
                {home&& <div>
                
                <button className="login" onClick={this.handleSignin} style={{ marginLeft: '0px' }}>Login</button>
                <button className="signup" onClick={this.handleSignup}>Create an account</button>
                </div>
                }
            </div>
        }
        return (
            <div>
                {/* This is the user details which renders on top on nav-bar                        */}
                {userDetails}
                
                

                {/* This is the Login modal */}
                <Modal
                    isOpen={signinModalOpen}
                    style={customStyles}
                >

                    <div className="container-login">

                        <div className="wrap-login">
                            <button className="login-close" style={{width:"50px", height:"25px"}} onClick={this.closeModal}>close</button><br/>

                            <span className="signin-with" style={{marginBottom: '20px'}}>Sign In With</span>

                            <div>
                                {/* This is the react-facebook authentication component */}
                               
                            </div>
                            <div>
                                {/* This is React-Google Authentication component */}
                                <GoogleLogin
                                    clientId="794615780258-24gp7nm6j9j1ged4gsaagp1ropmlpdhf.apps.googleusercontent.com"
                                    render={renderProps => (
                                        <button className="google-auth-button" onClick={renderProps.onClick} disabled={renderProps.disabled}><img src="https://colorlib.com/etc/lf/Login_v5/images/icons/icon-google.png" alt='imgae not found' />Google</button>
                                    )}
                                    buttonText="Login"
                                    onSuccess={this.responseGoogle}
                                    onFailure={this.responseGoogle}
                                    cookiePolicy={'single_host_origin'}
                                />
                            </div>
                            {/* This is the Login form */}
                            <form className="login-form" onSubmit={this.handleLogin}>
                                <div style={{ color: 'red', textAlign: 'center', fontSize: '14px' }}>{loading ? null : this.state.signupError}</div>
                                <div class="wrap-input100 validate-input alert-validate" data-validate="Username is required">
                                    <input class="input100 form-control" type="email" name="email" placeholder="Email" onChange={this.handleLoginFields} required />
                                </div>
                                <div class="wrap-input100 validate-input alert-validate" data-validate="Username is required">
                                    <input class="input100 form-control" type="password" name="password" placeholder="password" onChange={this.handleLoginFields} required />
                                </div>
                                <div style={{ marginTop: '17px' }}>
                                    <button className="login-submit" disabled={loading}>{loading ? <i class="fa fa-refresh fa-spin"></i> : <i ></i>}Sign In</button>
                                </div>
                                <div style={{ marginTop: '17px', fontSize: '16px', textAlign: 'center' }}>Don't have an account? <a href="/" onClick={this.switchToSignup}>Sign up now</a></div>
                            </form>
                        </div>
                    </div>

                </Modal>

                {/* This is User create account form                             */}
                <Modal
                    isOpen={signupModalOpen}
                    style={customStyles}
                >

                    <div className="container-login">

                        <div className="wrap-login">
                            <button className="login-close" style={{width:"50px", height:"25px"}}  onClick={this.closeSignupModal}>Close</button><br/>
                            <form className="login-form" onSubmit={this.handleSignupForm}>

                                <div className="signin-with" style={{ justifyContent: 'normal' }}>Sign Up</div>
                                <div style={{ color: 'red', textAlign: 'center', fontSize: '14px' }}>{loading ? null : this.state.signupError}</div>

                                <div class="wrap-input100 validate-input alert-validate" data-validate="Username is required">
                                    <input class="input100 form-control" type="text" name="username" onChange={this.handlesSignupFields} placeholder="Full Name" required />
                                </div>
                                <div class="wrap-input100 validate-input alert-validate" data-validate="Username is required">
                                    <input class="input100 form-control" type="email" name="email" onChange={this.handlesSignupFields} placeholder="Email" required />
                                </div>
                                <div class="wrap-input100 validate-input alert-validate" data-validate="Username is required">
                                    <input class="input100 form-control" type="password" name="password" onChange={this.handlesSignupFields} placeholder="Password" minlength="8" required />
                                </div>
                                <div class="wrap-input100 validate-input alert-validate" data-validate="Username is required">
                                    <input class="input100 form-control" type="password" name="confirmPassword" onChange={this.handlesSignupFields} placeholder="Confirm Password" minlength="8" required />
                                </div>
                                <div style={{ marginTop: '17px' }}>
                                    <button type="submit" className="login-submit" disabled={loading}>{loading ? <i class="fa fa-refresh fa-spin"></i> : <i ></i>}Create account</button>
                                </div>
                                <div style={{ marginTop: '17px', fontSize: '16px', textAlign: 'center' }}>Already have an account? <a href="/" onClick={this.switchToSignin}>Sign in now</a></div>
                            </form>
                        </div>
                    </div>

                </Modal>             


            </div>
        )
    }
}

export default withRouter(User);