import React, { Component } from 'react';
import { Button, Card, CardBody, CardFooter, Col, Container, Form, Input, InputGroup, 
    InputGroupAddon, InputGroupText, Row,FormGroup,Label } from 'reactstrap';

import axios from 'axios';  
import { ToastContainer, toast } from 'react-toastify';
import {simple_header} from '../../Helper/Loginhelper';

const ADMIN_API_URL = process.env.REACT_APP_ADMIN_API_URL;
const headers = simple_header();

export default class Resetpassword extends Component {

constructor(props)
    {
       super(props)

        this.state = {
            npassword : '',
            cfmpassword : '',
            npasswordError : '',
            cfmpasswordError : '',
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
    let npasswordError = "";
    let cfmpasswordError = "";

    if(!this.state.npassword)
    {
      npasswordError = 'New Password is Required.';
    }

    if(!this.state.cfmpassword)
    {
      cfmpasswordError = 'Confirm Password is Required.';
    }

    if(this.state.npassword!=this.state.cfmpassword)
    {
      cfmpasswordError = 'New And Confirm Password does not match.';
    }

    if(npasswordError || cfmpasswordError)
    {
         this.setState({npasswordError,cfmpasswordError});
         return false;
    }
    else{
     return true; 
    }
}

componentWillMount()
{
    this.check_reset_password_url();
}

check_reset_password_url()
{
        axios.post(ADMIN_API_URL+"reset_pwd_link_check",{'forget_password_code':this.props.match.params.id},
        {
          headers :  headers
        }) 
        .then((response) => 
        {
               if(response.status==202)
               { 
                 toast.success(response.data.message.message,{ autoClose: 1500 });
                 setTimeout(() => {
                    this.props.history.push('/login');
                  }, 1550);    
               }
        });       
}


submitForm(e){
    e.preventDefault(); 
    const isVaild = this.check_validation();

       if(isVaild)
       {
            const new_obj = {
                'npassword':this.state.npassword,
                'cfmpassword':this.state.cfmpassword,
                'forget_password_code':this.props.match.params.id,   
            }

            axios.post(ADMIN_API_URL+'reset_password_update',new_obj ,{
                headers :  headers
              }) 
              .then((response) => 
              {  
                    if(response.status==200)
                    {
                        toast.success(response.data.data.message,{ autoClose: 1200 });
                        this.setState({
                            npassword : '',
                            cfmpassword : '',
                            npasswordError : '',
                            cfmpasswordError : '',
                         });
                         setTimeout(() => {
                            this.props.history.push('/login');
                          }, 1250);
                    }
                    else{
                        let cfmpasswordError = response.data.message.message;
                        this.setState({cfmpasswordError});
                    }
              })
              .catch((error) => 
              {
                let cfmpasswordError = 'Something wrong at Server side.';
                this.setState({cfmpasswordError});
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
                    <h1>Reset Password</h1>
                    <div className="mb-3">
                        <InputGroup>
                            <Input type="password" name="npassword" id="npassword" placeholder = "New Password" className="form-control" value={this.state.npassword} onChange={this.onChange} />
                        </InputGroup>
                        <div className="validation-error">{this.state.npasswordError}</div>
                    </div> 

                    <div className="mb-3">
                        <InputGroup>
                            <Input type="password" name="cfmpassword" id="cfmpassword" placeholder = "Confirm Password" className="form-control" value={this.state.cfmpassword} onChange={this.onChange} />
                        </InputGroup>
                        <div className="validation-error">{this.state.cfmpasswordError}</div>
                    </div>  
                    <Button color="success" block>Submit</Button>
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


