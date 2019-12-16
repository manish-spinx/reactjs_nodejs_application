import React, { Component } from 'react';
import axios from 'axios'; 
import Layout from '../components/Layout';
import { Router } from '../routes';
import {
        FETCH_NODE_API_URL,
        BACKEND_FETCH_NODE_API_URL,
        simple_header,
        token_header
       } from '../components/ServerApi';

import requiresAuth from '../components/requiresAuth'; 

class Changepassword extends Component 
{
    constructor(props) {
        super(props)

        this.state = {
            api_data:[],
            o_password:'',
            n_password:'',
            cfm_password:'',            
            o_passwordError:'',
            n_passwordError:'',
            cfm_passwordError:'',
            server_msg_display:false,
            visiable_flag:false,
        };
        
        this.submitForm = this.submitForm.bind(this);
        this.onChange_watch = this.onChange_watch.bind(this);
        this.check_validation = this.check_validation.bind(this);
        
        this.close_alert = this.close_alert.bind(this);
        
    }

async componentDidMount()
{

}

check_validation = () =>
{
    let o_passwordError = "";
    let n_passwordError = "";
    let cfm_passwordError="";
    

    if(!this.state.o_password)
    {
        o_passwordError = 'Current Password is Required.';
    }

    if(!this.state.n_password)
    {
        n_passwordError = 'New Password is Required.';
    }

    if(!this.state.cfm_password)
    {
        cfm_passwordError = 'Confirm Password is Required.';
    }

    if(this.state.n_password!=this.state.cfm_password)
    {
        cfm_passwordError = 'New And Confirm Password does not match.';
    }
    
    if(o_passwordError || n_passwordError || cfm_passwordError)
    {
        this.setState({o_passwordError,n_passwordError,cfm_passwordError});
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
        var pass_obj = {
            'user_id': localStorage.getItem("login_user_id"),
            'cpassword':this.state.o_password,
            'npassword':this.state.n_password,
            'cfmpassword':this.state.cfm_password,
        };

        axios.post(BACKEND_FETCH_NODE_API_URL()+'change_password',pass_obj,{
            headers :  token_header()
          }) 
          .then((response) => 
          {

              if(response.status == 200)
              {
                    this.setState({
                        o_password:'',
                        n_password:'',
                        cfm_password:'',            
                        o_passwordError:'',
                        n_passwordError:'',
                        cfm_passwordError:'',
                        server_msg_display:true,
                    });
              }
              else{
                    this.setState({n_passwordError:'',cfm_passwordError:''});
                   let o_passwordError = response.data.message.message;
                   this.setState({o_passwordError});
              }
              
          })
          .catch((error) => 
          {   
                let cfm_passwordError = 'Something wrong at Server side.';
                this.setState({cfm_passwordError});
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
            <React.Fragment>
                {
                    <Layout title='Changepassword - Aurora Capital Partners'>              
                        <br/>
                        <section className="portfolio-content our-team-content">
                        <div id="logreg-forms">                                        
                            <form method="post" className="form-signup">
                            <h3 className="h3 mb-3 font-weight-normal" style={{'textAlign':'center'}}>Change Password</h3>
                                <p style={{'textAlign':'center'}}></p>
                                {
                                    this.state.server_msg_display &&
                                    <div data-msg="">
                                        <div className="alert alert-success fade in">
                                            <a data-dismiss="alert" className="close" onClick={this.close_alert}>×</a>
                                            <i className="fa-fw fa fa-check"></i>
                                            Password Changed successfully
                                        </div>
                                    </div>
                                }
                                <input type="password" id="o_password" name="o_password" className="form-control" placeholder="Old Password" value={this.state.o_password} onChange={this.onChange_watch} />
                                <span className="validation-error">{this.state.o_passwordError}</span>
                                <input type="password" id="n_password" name="n_password" className="form-control" placeholder="New Password" value={this.state.n_password} onChange={this.onChange_watch} />
                                <span className="validation-error">{this.state.n_passwordError}</span>
                                <input type="password" id="cfm_password" name="cfm_password" className="form-control" placeholder="Confirm Password" value={this.state.cfm_password} onChange={this.onChange_watch} />
                                <span className="validation-error">{this.state.cfm_passwordError}</span>
                                <br/>
                                <button className="btn btn-primary btn-block" type="button" onClick={this.submitForm} ><i className="fas fa-user-plus"></i>Submit</button>
                            </form>
                            </div>
                            </section>
                    </Layout>
                }
            </React.Fragment>    
        );
      }
}

export default requiresAuth(Changepassword);
