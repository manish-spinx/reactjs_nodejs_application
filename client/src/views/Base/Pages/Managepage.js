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
} from 'reactstrap';


import CKEditor from "react-ckeditor-component";
import axios from 'axios'; 
import { ToastContainer, toast } from 'react-toastify';

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import {checkLogin,image_token_header,token_header} from '../../Helper/Loginhelper';
import {api_service} from '../../Helper/APIServicehelper';

const ADMIN_API_URL = process.env.REACT_APP_ADMIN_API_URL;
const FRONT_CSS_PATH = process.env.REACT_APP_FRONT_CSS_PATH;
const MODULE_REDIRECT_URL='/admin/list_pages';

export default class Managepage extends Component 
{
  constructor(props) {
    super(props)

       // checkLogin();

        this.state = {
            // collapse: true,
            // fadeIn: true,
            // timeout: 1000,
            title:'',
            content:'',
            status:'1',
            titleError:'',
        };

        // ckeditor related below function
        this.onChange = this.onChange.bind(this);

        this.onChange_watch = this.onChange_watch.bind(this);
        this.submitForm = this.submitForm.bind(this);        
        this.cancel_page = this.cancel_page.bind(this);
  }

onChange(evt){
    var newContent = evt.editor.getData();
    this.setState({
      content: newContent
    })
}


onBlur(evt){
    console.log("onBlur event called with event info: ", evt);
    }
      
    afterPaste(evt){
    console.log("afterPaste event called with event info: ", evt);
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
        let titleError = "";
      
        if(!this.state.title)
        {
            titleError = 'Title is Required.';
        }

        if(titleError)
         {
              this.setState({titleError});
              return false;
         }
         else{
          return true; 
         }
    }


  /**********Submit Form*****************/
  submitForm(e){
    e.preventDefault(); 
    const isVaild = this.user_validation();

     if(isVaild)
     {

            this.setState({disabled: true});

            var pass_obj = {};
            pass_obj.title = this.state.title;
            pass_obj.content = this.state.content;
            pass_obj.status = this.state.status;
           
            if(this.props.match.params.id!==undefined)  
            {
                pass_obj.p_id = this.state.edit_idd; 
            }

            const response_check = api_service('update_page',pass_obj);
            response_check.then(response=>{

                  if(response.status==200)
                  {
                    toast.success(response.data.message,{ autoClose: 1000 });
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

 cancel_page(e)
 {
   this.props.history.push(MODULE_REDIRECT_URL);
 }


async componentDidMount()
{
    // const response_check = api_service('edit_page',{'p_id':this.props.match.params.id});
    //     response_check.then(response=>{
    //         if(response.status==200)
    //         {
    //             var obj_value = response.data.data;

    //                 this.setState({ 
    //                   collapse: true,
    //                   fadeIn: true,
    //                   timeout: 300,
    //                   content:obj_value.content,
    //                   title:obj_value.title,
    //                   status:obj_value.status,
    //                   edit_idd:obj_value._id,
    //                 }); 
    //         }
    // })

    const edit_page_data = await axios.post(ADMIN_API_URL+'edit_page',{'p_id':this.props.match.params.id},{
      headers :  token_header()
      }) 
      .then((response) => 
      {
          return response;
      })
      .catch((error) => 
      {
          console.log('error');
          console.log(error);
      })

      if(edit_page_data.data.success==1)
      {
          var obj_value = edit_page_data.data.data;

          // await this.setState({ 
          //         // collapse: true,
          //         // fadeIn: true,
          //         // timeout: 300,
          //         content:obj_value.content,
          //         title:obj_value.title,
          //         status:obj_value.status,
          //         edit_idd:obj_value._id,

          // }); 

          setTimeout(() => {

            this.setState({ 
                    content:obj_value.content,
                    title:obj_value.title,
                    status:obj_value.status,
                    edit_idd:obj_value._id,
                }); 
            
          }, 3000);

          
      }
      else{
          toast.success(edit_page_data.data.message.message,{ autoClose: 1000 });
          this.props.history.push(MODULE_REDIRECT_URL);
      }

}

  render() {


    return (
      <div className="animated fadeIn">
        <Row>
          <Col xs="12" md="12">
            <Card>
              <CardHeader>
                <strong>Edit Page</strong>
              </CardHeader>
              <CardBody>

                <Form onSubmit={this.submitForm} method="post" encType="multipart/form-data" className="form-horizontal">
                
                <FormGroup row>
                    <Col md="3">
                        <Label htmlFor="name">Title</Label>
                    </Col>
                    
                    <Col xs="12" md="9">
                        <Input type="text" id="title" name="title" placeholder="Title" value={this.state.title} onChange={this.onChange_watch}/>
                        <div className="validation-error">{this.state.titleError}</div>
                    </Col>
                </FormGroup>

                
                <FormGroup row>
                    <Col md="3">
                        <Label htmlFor="name">Page Content</Label>
                    </Col>
                    <Col xs="12" md="9">
                    <CKEditor id="textarea_id" name="textarea_id" activeClass="p10" 
                        content={this.state.content}
                        config={{allowedContent:true,compile:true,serve_static_assets:true,contentsCss:FRONT_CSS_PATH}}
                        removeButto = 'Form,Checkbox,Radio,TextField,Textarea,Select,Button,ImageButton,HiddenField,SelectAll,Scayt,Flash,Smiley,About'  
                        events={{"blur": this.onBlur,"afterPaste": this.afterPaste,"change": this.onChange}} />
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

                 

                 <div>
                    <Button color="primary" type="submit" className="mr-2 px-4" disabled={this.state.disabled}>{this.state.disabled ? 'Update...' : 'Update'}</Button>
                    <Button type="reset" onClick={this.cancel_page} color="danger"><i className="mr-1 fa fa-ban"></i> Cancel</Button>
                 </div>
                 
                </Form>
              </CardBody>
            </Card>

          </Col>
        </Row>

      </div>
    );
  }
}


