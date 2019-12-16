import React, { Component } from 'react';
import {
  Badge,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Col,
  Collapse,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Fade,
  Form,
  FormGroup,
  FormText,
  FormFeedback,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupButtonDropdown,
  InputGroupText,
  Label,
  Row,
} from 'reactstrap';
import axios from 'axios';  
import { ToastContainer, toast } from 'react-toastify';
import {checkLogin,token_header} from '../../Helper/Loginhelper';

//const ADMIN_API_URL = 'http://localhost:3005/admin_api/';
//const ADMIN_API_URL = '/admin_api/';
const ADMIN_API_URL = process.env.REACT_APP_ADMIN_API_URL;



const changepassword_initialState = {
  cpassword:'',
  npassword:'',
  cfmpassword:'',
  cpasswordError:'',
  npasswordError:'',
  cfmpasswordError:'',
}; 

export default class Changepassword extends Component 
{
  constructor(props) {
    super(props);

      checkLogin();

        this.state = {
            collapse: true,
            fadeIn: true,
            timeout: 300,
            cpassword:'',
            npassword:'',
            cfmpassword:'',
            cpasswordError:'',
            npasswordError:'',
            cfmpasswordError:'',
        };

        this.submitForm = this.submitForm.bind(this);
        this.onChange = this.onChange.bind(this);
        this.set_blank = this.set_blank.bind(this);
      
  }

  set_blank()
  {
    this.setState({
                  cpassword:'',
                  npassword:'',
                  cfmpassword:'',
                  cpasswordError:'',
                  npasswordError:'',
                  cfmpasswordError:'',
                });
  }

  change_password_validation = () =>
  {
    
      let cpasswordError = "";
      let npasswordError = "";
      let cfmpasswordError = "";


      if(!this.state.cpassword)
      {
        cpasswordError = 'Current Password is Required.';
      }

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

       if(cpasswordError || npasswordError || cfmpasswordError)
       {
            this.setState({cpasswordError,npasswordError,cfmpasswordError});
            return false;
       }
       else{
        return true; 
       }
  }

  onChange(e){
    this.setState({
       [e.target.name] : e.target.value
    });
}  


submitForm(e){
  e.preventDefault(); 
  const isVaild = this.change_password_validation();

    if(isVaild)
    {

      this.setState({disabled: true});

      var pass_obj = {
          'user_id': localStorage.getItem("login_user_id"),
          'cpassword':this.state.cpassword,
          'npassword':this.state.npassword,
          'cfmpassword':this.state.cfmpassword,
      };

          axios.post(ADMIN_API_URL+'change_password',pass_obj,{
            headers :  token_header()
          }) 
          .then((response) => 
          {
              if(response.status == 200)
              {
                toast.success(response.data.message,{ autoClose: 1000 });
                this.setState(changepassword_initialState);
              }
              else{
                  this.setState({cfmpasswordError:'',npasswordError:''});
                   let cpasswordError = response.data.message.message;
                   this.setState({cpasswordError});
              }
              this.setState({disabled:false});
          })
          .catch((error) => 
          {
              console.log('------error change password ----');
              console.log(error);
              
            let cfmpasswordError = 'Something wrong at Server side.';
            this.setState({cfmpasswordError});
          })
    }
}  

  render() {
    
    return (
      <div className="animated fadeIn">

        <Row>
          <Col xs="12" md="12">
            <Card>
              <CardHeader>
                <strong>Change Password</strong>
              </CardHeader>
              <CardBody>

                <Form onSubmit={this.submitForm} method="post" className="form-horizontal">

                <FormGroup row>
                    <Col md="3">
                        <Label htmlFor="cpassword">Current Password</Label>
                    </Col>
                    <Col xs="12" md="9">
                        <Input type="password" id="cpassword" name="cpassword" placeholder="Current Password" value={this.state.cpassword} onChange={this.onChange}/>
                        <div className="validation-error">{this.state.cpasswordError}</div>
                    </Col>
                </FormGroup>


                <FormGroup row>
                    <Col md="3">
                        <Label htmlFor="npassword">New Password</Label>
                    </Col>
                    <Col xs="12" md="9">
                        <Input type="password" id="npassword" name="npassword" placeholder="New Password" value={this.state.npassword} onChange={this.onChange}/>
                        <div className="validation-error">{this.state.npasswordError}</div>
                    </Col>
                </FormGroup>


                <FormGroup row>
                    <Col md="3">
                        <Label htmlFor="cfmpassword">Confirm Password</Label>
                    </Col>
                    <Col xs="12" md="9">
                        <Input type="password" id="cfmpassword" name="cfmpassword" placeholder="Confirm Password" value={this.state.cfmpassword} onChange={this.onChange}/>
                        <div className="validation-error">{this.state.cfmpasswordError}</div>
                    </Col>
                </FormGroup>

                <button type="submit" className="mr-1 btn btn-primary" disabled={this.state.disabled}>{this.state.disabled ? 'Password Changing...' : 'Submit'}</button>
                <button type="reset" onClick={this.set_blank} className="mr-1 btn btn-danger">Reset</button>
                </Form>

              </CardBody>
              <CardFooter>
                {/* <button type="submit" disabled="" class="mr-1 btn btn-primary">Submit</button>
                <button type="reset" class="mr-1 btn btn-danger">Reset</button> */}
              </CardFooter>
            </Card>
          </Col>
        </Row>

      </div>
    );
  }
}


