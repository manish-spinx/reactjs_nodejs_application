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

//import { ToastContainer, toast } from 'react-toastify';
//import 'react-toastify/dist/ReactToastify.css';



export default class Register extends Component 
{
    constructor(props) {
        super(props)

        this.state = {
            api_data:[],
            email:'',
            password:'',
            repassword:'',
            name:'',
            emailError:'',
            passwordError:'',
            repasswordError:'',
            nameError:'',
            username_and_password:'',
            server_msg_display:false,
        };
        
        this.submitForm = this.submitForm.bind(this);
        this.onChange_watch = this.onChange_watch.bind(this);
        this.check_validation = this.check_validation.bind(this);
        this.keyPress = this.keyPress.bind(this);
        this.close_alert = this.close_alert.bind(this);
        
    }

async componentDidMount()
{
    

}

check_validation = () =>
{
    let emailError = "";
    let passwordError = "";
    let repasswordError="";
    let nameError="";

    if(!this.state.email)
    {
        emailError = 'Email is Required.';
    }

    if(!this.state.password)
    {
        passwordError = 'Password is Required.';
    }

    if(!this.state.repassword)
    {
        repasswordError = 'Repeat Password is Required.';
    }

    if(!this.state.name)
    {
        nameError = 'Name is Required.';
    }

    if(this.state.password!=this.state.repassword)
       {
        repasswordError = 'New And Repeat Password does not match.';
       }

    if(emailError || passwordError || nameError || repasswordError)
    {
        this.setState({emailError,passwordError,nameError,repasswordError});
        return false;
    }
    else{
         return true; 
    }
}

backurl(e)
{
    e.preventDefault(); 
    Router.pushRoute('/login').then(() => window.scrollTo(0, 0));

}

submitForm(e){
    e.preventDefault(); 
    const isVaild = this.check_validation();
    if(isVaild)
    {
        axios.post(FETCH_NODE_API_URL()+'register', 
                                                  {
                                                    'email':this.state.email,
                                                    'password':this.state.password,
                                                    'name':this.state.name,
                                                  }) 
          .then((response) => 
          {
              if(response.status==200)
              {
                    this.setState({
                        server_msg_display : true,
                        email:'',
                        password:'',
                        repassword:'',
                        name:'',
                        emailError:'',
                        passwordError:'',
                        repasswordError:'',
                        nameError:'',
                        username_and_password:'',
                    });
              }
              else{

                let emailError = response.data.message.message;
                this.setState({emailError});
              }
          })
          .catch((error) => 
          {
            // let username_and_password = 'Something wrong at Server side.';
            // this.setState({username_and_password});
          })
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
    Router.pushRoute('/register').then(() => window.scrollTo(0, 0));

}

keyPress(e){
    if(e.keyCode == 13){
      e.preventDefault();
       this.submitForm(e);
    }
  }

  async close_alert(e)
    {
        e.preventDefault(); 

        await this.setState({
            server_msg_display:false
          });
    }

    render() {

        
        return (             
            <Layout title='Register - Aurora Capital Partners'>              
                <br/>

        <section className="portfolio-content our-team-content">
        <div id="logreg-forms">            
                
                <form method="post" className="form-signup">
                <h1 className="h3 mb-3 font-weight-normal" style={{'textAlign':'center'}}> Sign Up</h1>
                                        
                    <p style={{'textAlign':'center'}}></p>

                    {
                        this.state.server_msg_display &&
                        <div data-msg="">
                            <div className="alert alert-success fade in">
                                <a data-dismiss="alert" className="close" onClick={this.close_alert}>×</a>
                                <i className="fa-fw fa fa-check"></i>
                                Registration Successfully
                            </div>
                        </div>
                    }

                    <input type="text" id="name" onKeyDown={this.keyPress} name="name" className="form-control" placeholder="Full name" value={this.state.name} onChange={this.onChange_watch} />
                    <span className="validation-error">{this.state.nameError}</span>

                    <input type="email" id="email" onKeyDown={this.keyPress} name="email" className="form-control" placeholder="Email address" value={this.state.email} onChange={this.onChange_watch} />  
                    <span className="validation-error">{this.state.emailError}</span>                  

                    <input type="password" id="password" onKeyDown={this.keyPress} name="password" className="form-control" placeholder="Password" value={this.state.password} onChange={this.onChange_watch} />
                    <span className="validation-error">{this.state.passwordError}</span>

                    <input type="password" id="repassword" onKeyDown={this.keyPress} name="repassword" className="form-control" placeholder="Repeat Password" value={this.state.repassword} onChange={this.onChange_watch} />
                    <span className="validation-error">{this.state.repasswordError}</span>
                    <br/>
                    <button className="btn btn-primary btn-block" type="button" onClick={this.submitForm} ><i className="fas fa-user-plus"></i> Sign Up</button>
                    <a href="#" onClick={this.backurl} id="cancel_signup"><i className="fas fa-angle-left"></i>{'<-'}Login</a>
                </form>
            
                 </div>
                </section>
            </Layout>             
        );
      }
}
