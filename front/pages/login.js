import React, { Component } from 'react';
import axios from 'axios'; 
import localStorage from "localStorage";

import Layout from '../components/Layout';
import { Router } from '../routes';
import {
        FETCH_NODE_API_URL,
        BACKEND_FETCH_NODE_API_URL,
        simple_header
       } from '../components/ServerApi';

const login_initialState = {
    email : '',
    password : '',
    emailError:'',
    passwordError:'',
}; 

export default class Login extends Component 
{
    constructor(props) {
        super(props)

        const token = localStorage.getItem("token");
        let loggedIn = true
        if(token == null)
        {
            loggedIn = false
        }
        else{
            Router.pushRoute('/').then(() => window.scrollTo(0, 0));
        }

        this.state = {
            api_data:[],
            email:'',
            password:'',
            emailError:'',
            passwordError:'',
            username_and_password:'',
            loggedIn
        };
        
        this.submitForm = this.submitForm.bind(this);
        this.onChange_watch = this.onChange_watch.bind(this);
        this.check_validation = this.check_validation.bind(this);
        this.keyPress = this.keyPress.bind(this);
    }

async componentDidMount()
{
    

}

check_validation = () =>
{
    let emailError = "";
    let passwordError = "";

    if(!this.state.email)
    {
        emailError = 'Email is Required.';
    }

    if(!this.state.password)
    {
        passwordError = 'Password is Required.';
    }

    if(emailError || passwordError)
    {
        this.setState({emailError,passwordError});
        return false;
    }
    else{
         return true; 
    }

}

submitForm(e){
    e.preventDefault(); 

    const isVaild = this.check_validation();

    if(isVaild)
    {
        axios.post(BACKEND_FETCH_NODE_API_URL()+'login', {'email':this.state.email,'password':this.state.password},{
            headers :  simple_header()
          }) 
          .then((response) => 
          {
              if(response.status == 200)
              {
                  localStorage.setItem("token",response.data.data.access_token);
                  localStorage.setItem("login_user_id",response.data.data._id);
                  //localStorage.setItem("user_profile_link",response.data.data.profile_image_link);

                  this.setState({
                              loggedIn : true
                           });

                           Router.pushRoute('/').then(() => window.scrollTo(0, 0));
              }
              else{
                 let username_and_password = response.data.message.message;//'Email And Password is Wrong. Please Try Again.';
                 this.setState({username_and_password});
              }

          })
          .catch((error) => 
          {
            let username_and_password = 'Something wrong at Server side.';
            this.setState({username_and_password});
          })

          this.setState(login_initialState);


    }
}
    
onChange_watch(e){
    e.preventDefault(); 
    this.setState({
        [e.target.name] : e.target.value
    });
} 

register_form(e)
{
    e.preventDefault(); 
    Router.pushRoute('/Register').then(() => window.scrollTo(0, 0));
}

forget_password_link(e)
{
    e.preventDefault(); 
    Router.pushRoute('/Forgetpassword').then(() => window.scrollTo(0, 0));
}

keyPress(e){
    if(e.keyCode == 13){
      e.preventDefault();
       this.submitForm(e);
    }
  }

    render() {

        
        return (             
            <Layout title='Login - Aurora Capital Partners'>
                {/* <section className="cmn-banner page-title" >
                    <div className="imgDiv web-view" style={{"backgroundImage":"url(/static/images/about-banner.jpg)"}}></div>
                    <div className="imgDiv mob-view" style={{"backgroundImage":"url(/static/images/about-banner.jpg)"}}></div>
                    <div className="banner-title">
                    <h1>Login</h1>
                    </div>                
                </section> */}
                
                <br/>
        <section className="portfolio-content our-team-content">

        <div id="logreg-forms">
            <form className="form-signin" method="post">
                <h1 className="h3 mb-3 font-weight-normal" style={{'textAlign':'center'}}> Sign in</h1>
      
                <input type="text" id="email" onKeyDown={this.keyPress} name="email" value={this.state.email} className="form-control" placeholder="Email address" onChange={this.onChange_watch}/>
                <span className="validation-error">{this.state.emailError}</span>
                
                <input type="password" id="password" onKeyDown={this.keyPress} name="password" value={this.state.password} className="form-control" placeholder="Password" onChange={this.onChange_watch}/>
                <span className="validation-error">{this.state.passwordError}</span>
                <span className="validation-error">{this.state.username_and_password}</span>
                <br/>
                <button className="btn btn-primary btn-block" 
                type="button" onClick={this.submitForm}><i className="fas fa-sign-in-alt"></i> Sign in</button>
                <a href="#" id="forgot_pswd" onClick={this.forget_password_link}>Forgot password?</a>
                <hr/>
                
                <button className="btn btn-primary btn-block" type="button" id="btn-signup" onClick={this.register_form}>
                    <i className="fas fa-user-plus"></i> Sign up New Account</button>
                </form>

                {/* <form action="" className="form-reset">
                    <input type="email" id="resetEmail" className="form-control" placeholder="Email address" required="" autofocus="" />
                    <button className="btn btn-primary btn-block" type="submit">Reset Password</button>
                    <a href="#" id="cancel_reset"><i className="fas fa-angle-left"></i> Back</a>
                </form>
                
                <form action="" className="form-signup">
                    <div className="social-login">
                        <button className="btn facebook-btn social-btn" type="button"><span><i className="fab fa-facebook-f"></i> Sign up with Facebook</span> </button>
                    </div>
                    <div className="social-login">
                        <button className="btn google-btn social-btn" type="button"><span><i className="fab fa-google-plus-g"></i> Sign up with Google+</span> </button>
                    </div>
                    
                    <p style={{"text-align":" center"}}>OR</p>

                    <input type="text" id="user-name" className="form-control" placeholder="Full name" required="" autofocus="" />
                    <input type="email" id="user-email" className="form-control" placeholder="Email address" required autofocus="" />
                    <input type="password" id="user-pass" className="form-control" placeholder="Password" required autofocus="" />
                    <input type="password" id="user-repeatpass" className="form-control" placeholder="Repeat Password" required autofocus="" />
                    <button className="btn btn-primary btn-block" type="submit"><i className="fas fa-user-plus"></i> Sign Up</button>
                    <a href="#" id="cancel_signup"><i className="fas fa-angle-left"></i> Back</a>
                </form> */}
            
                 </div>

                
                </section>

            </Layout>             
        );
      }
}
