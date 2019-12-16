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
  Alert,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader
} from 'reactstrap';

import DatePicker from "react-datepicker";
import CKEditor from "react-ckeditor-component";
import "react-datepicker/dist/react-datepicker.css";
import axios from 'axios'; 
import { ToastContainer, toast } from 'react-toastify';

//import {checkLogin,token_header,image_token_header} from '../../Helper/Loginhelper';

import {api_service} from '../../Helper/APIServicehelper';
const ADMIN_API_URL = process.env.REACT_APP_ADMIN_API_URL;
const MODULE_REDIRECT_URL='/admin/list_job';


export default class Editjob extends Component 
{
  constructor(props) {
    super(props)

        //checkLogin();

        this.toggle = this.toggle.bind(this);
        this.toggleFade = this.toggleFade.bind(this);

        this.state = {
            collapse: true,
            fadeIn: true,
            timeout: 300,
            name:'',
            nameError:'',
        };

        this.onChange_watch = this.onChange_watch.bind(this);
        this.submitForm = this.submitForm.bind(this);
        this.cancel_page = this.cancel_page.bind(this);
  }

  toggle() {
    this.setState({ collapse: !this.state.collapse });
  }

  toggleFade() {
    this.setState((prevState) => { return { fadeIn: !prevState }});
  }



  /**************Push Value*************/
  onChange_watch(e){
    this.setState({
       [e.target.name] : e.target.value
    });
} 

  /***********Validation  Form***********/

  user_validation = () =>
    {
        let nameError = "";
        if(!this.state.name)
        {
          nameError = 'Job Title Name is Required.';
        }

        if(nameError)
         {
              this.setState({nameError});
              return false;
         }
         else{
          return true; 
         }
         
    }

cancel_page(e)
 {
   this.props.history.push(MODULE_REDIRECT_URL);
 }
  /**********Submit Form*****************/
// submitForm_o(e){
//     e.preventDefault(); 
//     const isVaild = this.user_validation();

//      if(isVaild)
//      {     
//           this.setState({disabled: true});

//           var post_obj = {};
//           post_obj.title_id = this.state.job_id;
//           post_obj.name = this.state.name;

//           axios.post(ADMIN_API_URL+'update_job_title',post_obj,{
//             headers :  token_header()
//           }) 
//           .then((response) => 
//           {
//                if(response.status==200)
//                {
//                   toast.success(response.data.data.message,{ autoClose: 1000 });
//                   setTimeout(() => {
//                     this.setState({disabled: false});
//                     this.props.history.push(MODULE_REDIRECT_URL);
//                   }, 1500);
//                } 
//           })
//           .catch((error) => 
//           {
//              this.setState({disabled: false});
//           })
//      }
//      else{
//       console.log('validation fire');
//      }
//  }

submitForm(e){
  e.preventDefault(); 
  const isVaild = this.user_validation();

   if(isVaild)
   {
      this.setState({disabled: true});
        
      var post_obj = {};
      post_obj.title_id = this.state.job_id;
      post_obj.name = this.state.name;
      post_obj.status = this.state.status;

        const response_check = api_service('update_job_title',post_obj);
        response_check.then(response=>{

              if(response.status==200)
              {
                toast.success(response.data.data.message,{ autoClose: 1000 });
                  setTimeout(() => {
                    this.setState({disabled:false});
                    this.props.history.push(MODULE_REDIRECT_URL);
                  }, 1500);
              }
              else{
                  this.setState({disabled:false});
              }
        })

   }
}

 async componentDidMount()
 {   
      const response_check = api_service('edit_job_title',{'job_id':this.props.match.params.id});
        response_check.then(response=>{

            if(response.status==200)
            {
                var obj_value = response.data.data;

                    this.setState({ 
                            collapse: true,
                            fadeIn: true,
                            timeout: 300,
                            name:obj_value.name,
                            status:obj_value.status,
                            job_id:obj_value._id,
                    }); 
            }
            else{
              toast.success(response.data.message.message,{ autoClose: 1000 });
              this.props.history.push(MODULE_REDIRECT_URL);
            } 
        })
 }


  render() {

    return (
      <div className="animated fadeIn">

        <Row>
          <Col xs="12" md="12">
            <Card>
              <CardHeader>
                <strong>Edit Job Title</strong>
              </CardHeader>
              <CardBody>

                <Form onSubmit={this.submitForm} method="post" className="form-horizontal">

                <FormGroup row>
                    <Col md="3">
                        <Label htmlFor="name">Name</Label>
                    </Col>
                    
                    <Col xs="12" md="9">
                        <Input type="text" id="name" name="name" placeholder="Name" value={this.state.name} onChange={this.onChange_watch}/>
                        <div className="validation-error">{this.state.nameError}</div>
                    </Col>
                </FormGroup>

                <FormGroup row>
                    <Col md="3">
                        <Label htmlFor="hobby">Status</Label>
                    </Col>
                    <Col xs="12" md="9">
                        <Input type="select" name="status" id="status" value={this.state.status} onChange={this.onChange_watch}>                        
                            <option value="1">Active</option>
                            <option value="0">Inactive</option>
                        </Input>
                    </Col>
                </FormGroup>


                <Button color="primary" type="submit" className="mr-2 px-4" disabled={this.state.disabled}>{this.state.disabled ? 'Updating...' : 'Update'}</Button>
                <Button type="reset"  onClick={this.cancel_page} color="danger"><i className="fa fa-ban"></i> Cancel</Button>

                </Form>
              </CardBody>
            </Card>

          </Col>
        </Row>
      </div>
    );
  }
}
