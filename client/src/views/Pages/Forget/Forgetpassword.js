import React, { Component } from 'react';
import { Button, Card, CardBody, CardFooter, Col, Container, Form, Input, InputGroup, 
    InputGroupAddon, InputGroupText, Row,FormGroup,Label } from 'reactstrap';

import axios from 'axios';  
import { ToastContainer, toast } from 'react-toastify';
import {simple_header} from '../../Helper/Loginhelper';

const ADMIN_API_URL = process.env.REACT_APP_ADMIN_API_URL;
const RESET_PASSWORD_LINK = process.env.REACT_APP_RESET_PASSWORD_LINK;
const headers = simple_header();

export default class Forgetpassword extends Component {

constructor(props)
    {
       super(props)

        this.state = {
             email : '',
             emailError:'',
             disabled_button:'',
        }

       this.onChange = this.onChange.bind(this)
       this.submitForm = this.submitForm.bind(this)
    }

onChange(e){
    this.setState({
        [e.target.name] : e.target.value
    });
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

submitForm(e){
    e.preventDefault(); 
    const isVaild = this.check_validation();

       if(isVaild)
       {
        this.setState({disabled: true});

            axios.post(ADMIN_API_URL+'forget_password', {'email':this.state.email,'client_website_link':RESET_PASSWORD_LINK},{
                headers :  headers
              }) 
              .then((response) => 
              {  
                    if(response.status==200)
                    {
                        toast.success(response.data.data.message,{ autoClose: 1200 });
                        this.setState({
                            email : '',
                            emailError:'',
                         });
                    }
                    else{
                        let emailError = response.data.message.message;
                        this.setState({emailError});
                    }
                    this.setState({disabled:false});
              })
              .catch((error) => 
              {
                let emailError = 'Something wrong at Server side.';
                this.setState({emailError});
                this.setState({disabled:false});
              })
       }
}    

  render() {
    return (
      <div className="app flex-row align-items-center">
        <Container>
          <Row className="justify-content-center">
            <Col md="9" lg="7" xl="6">
              <Card className="mx-4">
                <CardBody className="p-4">
                  <Form onSubmit={this.submitForm} method="post">
                    <h1>Forget Password</h1>
                    <p className="text-muted">Enter Your Email Id</p>

                    <div className="mb-3">
                    <InputGroup>
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>@</InputGroupText>
                      </InputGroupAddon>
                      <Input type="text" name="email" placeholder = "Email Id" className="form-control" value={this.state.email} onChange={this.onChange} />
                    </InputGroup>
                        <div className="validation-error">{this.state.emailError}</div>
                    </div>  
                    <Button color="success" block disabled={this.state.disabled}>{this.state.disabled ? 'Sending Email...' : 'Submit'}</Button>

                  </Form>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}


