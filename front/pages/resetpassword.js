import React, { Component } from 'react';
import axios from 'axios'; 
import Layout from '../components/Layout';
import { Router } from '../routes';
import {
        FETCH_NODE_API_URL,
        BACKEND_FETCH_NODE_API_URL,
        simple_header
       } from '../components/ServerApi';


export default class Resetpassword extends Component 
{
    constructor(props) {
        super(props)

        var separate_url = this.props.url.asPath.split("/");

        this.state = {
            api_data:[],
            password:'',
            repassword:'',
            passwordError:'',
            repasswordError:'',
            username_and_password:'',
            server_msg_display:false,
            separate_url:separate_url
        };
        
        this.submitForm = this.submitForm.bind(this);
        this.onChange_watch = this.onChange_watch.bind(this);
        this.check_validation = this.check_validation.bind(this);
        this.close_alert = this.close_alert.bind(this);
        
    }

async componentDidMount()
{

    axios.post(BACKEND_FETCH_NODE_API_URL()+"reset_pwd_link_check",
    {'forget_password_code':this.state.separate_url[2]}) 
    .then((response) => 
    {
           if(response.status==202)
           { 
                this.setState({
                    server_msg_display : true,
                    server_msg:response.data.message.message,
                });

                setTimeout(() => {
                    Router.pushRoute('/login').then(() => window.scrollTo(0, 0));
                  }, 800); 
           }
    }); 
}

check_validation = () =>
{
    let passwordError = "";
    let repasswordError="";

    if(!this.state.password)
    {
        passwordError = 'New Password is Required.';
    }

    if(!this.state.repassword)
    {
        repasswordError = 'Confirm Password is Required.';
    }

    if(this.state.password!=this.state.repassword)
    {
        repasswordError = 'New And Confirm Password does not match.';
    }

    if(passwordError || repasswordError)
    {
        this.setState({passwordError,repasswordError});
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
        axios.post(BACKEND_FETCH_NODE_API_URL()+'reset_password_update', 
        {
            'forget_password_code':this.state.separate_url[2],
            'npassword':this.state.password,
            'cfmpassword':this.state.repassword
        })
        .then((response) => 
          {
              //console.log(response);

              if(response.status==200)
              {
                    this.setState({
                        server_msg_display : true,
                        server_msg:response.data.data.message,
                        password:'',
                        repassword:'',
                        passwordError:'',
                        repasswordError:'',
                        username_and_password:'',
                    });

                    setTimeout(() => {
                        Router.pushRoute('/login').then(() => window.scrollTo(0, 0));
                      }, 200);   
              }
              else{

                let repasswordError = response.data.message.message;
                this.setState({repasswordError});
              }
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
            <Layout title='Reset Password - Aurora Capital Partners'>              
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
                                {this.state.server_msg}
                            </div>
                        </div>
                    }

                    <input type="password" id="password" onKeyDown={this.keyPress} name="password" className="form-control" placeholder="New Password" value={this.state.password} onChange={this.onChange_watch} />
                    <span className="validation-error">{this.state.passwordError}</span>

                    <input type="password" id="repassword" onKeyDown={this.keyPress} name="repassword" className="form-control" placeholder="Confirm Password" value={this.state.repassword} onChange={this.onChange_watch} />
                    <span className="validation-error">{this.state.repasswordError}</span>
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
