import React, { Component } from 'react';
import { Link,Redirect } from 'react-router-dom';
import { Button, Card, CardBody, CardGroup, Col, Container, Form, Input, InputGroup,
  InputGroupAddon, InputGroupText, Row } from 'reactstrap';
import axios from 'axios';  
import {simple_header} from '../../Helper/Loginhelper';

 const login_initialState = {
    username : '',
    password : '',
    usernameError:'',
    passwordError:'',
 }; 

 
//const ADMIN_API_URL = 'http://localhost:3005/admin_api/';
const ADMIN_API_URL = process.env.REACT_APP_ADMIN_API_URL;
const headers = simple_header();

export default class Login extends Component {
  
   constructor(props)
   {
      super(props)

      const token = localStorage.getItem("token");
      let loggedIn = true
      if(token == null)
      {
        loggedIn = false
      }
 
       this.state = {
            username : '',
            password : '',
            usernameError:'',
            passwordError:'',
            username_and_password:'',
            loggedIn
       }

      this.onChange = this.onChange.bind(this)
      this.submitForm = this.submitForm.bind(this)
      this.forget_password = this.forget_password.bind(this)

   }
 
   onChange(e){
       this.setState({
          [e.target.name] : e.target.value
       });
   }  

    // check custom validation
    check_validation = () =>
    {
        let usernameError = "";
        let passwordError = "";

        if(!this.state.username)
        {
          usernameError = 'Email is Required.';
        }

        if(!this.state.password)
        {
          passwordError = 'Password is Required.';
        }

         if(usernameError || passwordError)
         {
              this.setState({usernameError,passwordError});
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
            axios.post(ADMIN_API_URL+'login', {'email':this.state.username,'password':this.state.password},{
              headers :  headers
            }) 
            .then((response) => 
            {
                if(response.status == 200)
                {
                    localStorage.setItem("token",response.data.data.access_token);
                    localStorage.setItem("login_user_id",response.data.data._id);
                    localStorage.setItem("user_profile_link",response.data.data.profile_image_link);

                    this.setState({
                                loggedIn : true
                             });
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

            // const {username,password} = this.state;
            //   if(username=='admin' && password=='admin')
            //   {
            //       localStorage.setItem("token",'Any-Random-String');

            //       this.setState({
            //           loggedIn : true
            //       });

            //   }
            //   else{
            //       let username_and_password = 'Username And Password is Wrong. Please Try Again.';
            //       this.setState({username_and_password});
            //   }
            //this.setState(login_initialState);
              
       }
      
   }

   forget_password()
   {
     this.props.history.push('/forgetpassword');
   } 


  render() {
 
           if(this.state.loggedIn)
           {
              return <Redirect to="/dashboard" />
           }
     
    return (
      <div className="app flex-row align-items-center">
        <Container>
          <Row className="justify-content-center">
            <Col md="8">
              <CardGroup>
                
                <Card className="p-4">
                  <CardBody>

                    <form onSubmit={this.submitForm} method="post">

                      <h1>Login</h1>
                      <p className="text-muted">Sign In to your account</p>

                    <div className="mb-3">
                        <InputGroup>
                          <InputGroupAddon addonType="prepend">
                            <InputGroupText>
                              <i className="icon-user"></i>
                            </InputGroupText>
                          </InputGroupAddon>
                          <Input type="text" name="username" placeholder = "Email" className="form-control" value={this.state.username} onChange={this.onChange} />
                        </InputGroup>
                        <div className="validation-error">{this.state.usernameError}</div>
                    </div> 
                      

                    <div className="mb-4">
                        <InputGroup>
                          <InputGroupAddon addonType="prepend">
                            <InputGroupText>
                              <i className="icon-lock"></i>
                            </InputGroupText>
                          </InputGroupAddon>
                          <Input type="password" name="password" placeholder = "Password" className="form-control" value={this.state.password} onChange={this.onChange}/>
                          </InputGroup>
                          <div className="validation-error">{this.state.passwordError}</div>
                          <div className="validation-error">{this.state.username_and_password}</div>
                      </div>
                      
                      <Row>
                        <Col xs="6">
                          <Button color="primary" type="submit" className="px-4">Login</Button>
                        </Col>
                        <Col xs="6" className="text-right">
                          <Button onClick={this.forget_password} color="link" className="px-0">Forgot password?</Button>
                        </Col>
                      </Row>
                    </form>

                  </CardBody>
                </Card>
              </CardGroup>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

//export default Login;
