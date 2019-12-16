import React, { Component } from 'react';
import axios from 'axios'; 
import localStorage from "localStorage";
import Layout from '../components/Layout';
import { Router } from '../routes';
import {
        FETCH_NODE_API_URL,
        BACKEND_FETCH_NODE_API_URL,
        simple_header,
        token_header
       } from '../components/ServerApi';
import requiresAuth from '../components/requiresAuth';       

//import { ToastContainer, toast } from 'react-toastify';
//import 'react-toastify/dist/ReactToastify.css';

class Editprofile extends Component 
{
    constructor(props) {
        super(props)

        this.state = {
            api_data:[],
            email:'',
            name:'',
            emailError:'',
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

check_validation = () =>
{
    let emailError = "";
    let nameError="";

    if(!this.state.email)
    {
        emailError = 'Email is Required.';
    }
    if(!this.state.name)
    {
        nameError = 'Name is Required.';
    }

    if(emailError || nameError)
    {
        this.setState({emailError,nameError});
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

async componentDidMount()
{
    axios.post(BACKEND_FETCH_NODE_API_URL()+'edit_user',{'user_id':localStorage.getItem("login_user_id")},
    {
        headers :  token_header()
    })
    .then((response) => 
    {
        if(response.status==200)
        {
        var obj_value = response.data.data;

            this.setState({
                name:obj_value.name,
                email:obj_value.email,
                o_email:obj_value.email
            });
        }

    })
    .catch((error) => 
    {
    // let username_and_password = 'Something wrong at Server side.';
    // this.setState({username_and_password});
    })
    

}

async submitForm(e){
    e.preventDefault(); 
    const isVaild = this.check_validation();
    if(isVaild)
    {
        await axios.post(FETCH_NODE_API_URL()+'front_update_profile', 
        {
            'email':this.state.email,
            'name':this.state.name,
            'o_email':this.state.o_email,
            'user_id': localStorage.getItem("login_user_id"),
        }).then((response) => 
          {
              if(response.status==200)
              {
                this.setState({
                            email:'',
                            name:'',
                            emailError:'',
                            nameError:'',
                            server_msg_display:true,
                            server_msg:response.data.data.message,
                         });
                   
                this.componentDidMount();

              }
              else{
                
                let emailError = response.data.message.message;
                this.setState({emailError});
              }

          }).catch((error) => 
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
            
            <React.Fragment>
                {
                    <Layout title='Editprofile - Aurora Capital Partners'>              
                    <br/>
                <section className="portfolio-content our-team-content">
                <div id="logreg-forms">            
                    <form method="post" className="form-signup">
                    <h3 className="h3 mb-3 font-weight-normal" style={{'textAlign':'center'}}> Edit Profile</h3>
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
                        <input type="text" id="name"  name="name" className="form-control" placeholder="Full name" value={this.state.name} onChange={this.onChange_watch} />
                        <span className="validation-error">{this.state.nameError}</span>
                        <input type="email" id="email" name="email" className="form-control" placeholder="Email address" value={this.state.email} onChange={this.onChange_watch} />  
                        <span className="validation-error">{this.state.emailError}</span>                  
                        <br/>
                        <button className="btn btn-primary btn-block" type="button" onClick={this.submitForm} ><i className="fas fa-user-plus"></i> Submit </button>
                    </form>
                    </div>
                    </section>
                </Layout>  
                }
            </React.Fragment>       
        );
      }
}

export default requiresAuth(Editprofile);
