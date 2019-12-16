import React, { Component } from 'react';
import axios from 'axios'; 
import localStorage from "localStorage";
import Layout from '../components/Layout';
import { Router } from '../routes';
import {
        FETCH_NODE_API_URL,
        BACKEND_FETCH_NODE_API_URL,
        simple_header,
        FRONT_RESET_PASSWORD_URL
       } from '../components/ServerApi';

export default class Forgetpassword extends Component 
{
    constructor(props) {
        super(props)

        this.state = {
            api_data:[],
            email:'',
            emailError:'',
            username_and_password:'',
            server_msg_display:false,
        };
        
        this.submitForm = this.submitForm.bind(this);
        this.onChange_watch = this.onChange_watch.bind(this);
        this.check_validation = this.check_validation.bind(this);
        this.close_alert = this.close_alert.bind(this);
    }


check_validation = () =>
{
    let emailError = "";
    
    if(!this.state.email)
    {
        emailError = 'Email is Required.';
    }

    if(!this.state.email.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i) && this.state.email!='')
    {
        emailError = 'Please Enter Valid Email id.';
    }
    
    if(emailError)
    {
        this.setState({emailError});
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
        axios.post(BACKEND_FETCH_NODE_API_URL()+'forget_password', 
                                                  {
                                                    'email':this.state.email,
                                                    'client_website_link':FRONT_RESET_PASSWORD_URL(),
                                                  }) 
          .then((response) => 
          {
               console.log('check data:');
               console.log(response);
               
              if(response.status==200)
              {
                    this.setState({
                        server_msg_display : true,
                        sever_msg:response.data.data.message,
                        email:'',
                        emailError:'',
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


async close_alert(e)
{
    e.preventDefault(); 
    await this.setState({
        server_msg_display:false
        });
}

    render() {

        
        return (             
            <Layout title='ForgetPassword - Aurora Capital Partners'>              
                <br/>
            <section className="portfolio-content our-team-content">
            <div id="logreg-forms">
                <form method="post" className="form-signup">
                <h4 className="h3 mb-3 font-weight-normal" style={{'textAlign':'center'}}>Forget Password</h4>
                    <p style={{'textAlign':'center'}}></p>
                    {
                        this.state.server_msg_display &&
                        <div data-msg="">
                            <div className="alert alert-success fade in">
                                <a data-dismiss="alert" className="close" onClick={this.close_alert}>×</a>
                                <i className="fa-fw fa fa-check"></i>
                                 {this.state.sever_msg}
                            </div>
                        </div>
                    }

                    <input type="email" id="email" onKeyDown={this.keyPress} name="email" className="form-control" placeholder="Email address" value={this.state.email} onChange={this.onChange_watch} />  
                    <span className="validation-error">{this.state.emailError}</span>                  
                    <br/>
                    <br/>
                    <button className="btn btn-primary btn-block" type="button" onClick={this.submitForm} ><i className="fas fa-user-plus"></i>Submit</button>
                    <a href="#" onClick={this.backurl} id="cancel_signup"><i className="fas fa-angle-left"></i>{'<-'}Login</a>
                </form>
                 </div>
                </section>
            </Layout>             
        );
      }
}
