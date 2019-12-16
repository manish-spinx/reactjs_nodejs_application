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
import {checkLogin,token_header,image_token_header} from '../../Helper/Loginhelper';

import {api_service} from '../../Helper/APIServicehelper';


const headers = token_header();
//const headers_image = image_token_header();


const $ = require('jquery');

//const ADMIN_API_URL = 'http://localhost:3005/admin_api/';
//const ADMIN_API_URL = '/admin_api/';
const ADMIN_API_URL = process.env.REACT_APP_ADMIN_API_URL;
const MODULE_REDIRECT_URL='/admin/list_user';


export default class Edituser extends Component 
{
  constructor(props) {
    super(props)

        checkLogin();

        this.toggle = this.toggle.bind(this);
        this.toggleFade = this.toggleFade.bind(this);

        this.state = {
            collapse: true,
            fadeIn: true,
            timeout: 300,
            file:'',
            imagePreviewUrl:'',
            startDate:'',
            content:'',
            content_idea:'',
            name:'',
            email:'',
            mobile:'',
            address:'',
            hobby:'',
            nameError:'',
            emailError:'',
            existing_image_url:'',
            modal_preview: false,
        };

        this.handleChange_date = this.handleChange_date.bind(this);
        this.updateContent = this.updateContent.bind(this);
        this.onChange = this.onChange.bind(this);

        // second editor
        this.updateContent_idea = this.updateContent_idea.bind(this);
        this.onChange_idea = this.onChange_idea.bind(this);
        this.onChange_watch = this.onChange_watch.bind(this);
        this.onChange_radio_button = this.onChange_radio_button.bind(this);
        this.onChange_check_box = this.onChange_check_box.bind(this);
        this.onChange_multiple_select = this.onChange_multiple_select.bind(this);
        
        this.submitForm = this.submitForm.bind(this);
        this.notify = this.submitForm.bind(this);

        this.toggle_image_preview = this.toggle_image_preview.bind(this);
        this.cancel_page = this.cancel_page.bind(this);

       
  }


  handleChange_date(date) 
  {
    this.setState({
      startDate: date
    });
  }

  updateContent(newContent) {
    this.setState({
        content: newContent
    })
}

onChange(evt){
  //console.log("onChange fired with event info: ", evt);
  var newContent = evt.editor.getData();
  this.setState({
    content: newContent
  })
}

updateContent_idea(newContent) {
  this.setState({
      content_idea: newContent
  })
}

onChange_idea(evt){
  //console.log("onChange fired with event info: ", evt);
  var newContent_idea = evt.editor.getData();
  this.setState({
    content_idea: newContent_idea
  })
}

  onBlur(evt){
    console.log("onBlur event called with event info: ", evt);
  }
  
  afterPaste(evt){
    console.log("afterPaste event called with event info: ", evt);
  }

  onBlur_idea(evt){
    console.log("onBlur event called with event info: ", evt);
  }
  
  afterPaste_idea(evt){
    console.log("afterPaste event called with event info: ", evt);
  }

  toggle() {
    this.setState({ collapse: !this.state.collapse });
  }

  toggleFade() {
    this.setState((prevState) => { return { fadeIn: !prevState }});
  }

_handleImageChange(e) 
{
    e.preventDefault();

    let reader = new FileReader();
    let file = e.target.files[0];

    reader.onloadend = () => {
      this.setState({
        file: file,
        imagePreviewUrl: reader.result
      });
    }
    reader.readAsDataURL(file)
  }

/************************************/

onChange_multiple_select(e)
{
   var options = e.target.options;
    var value = [];
    for (var i = 0, l = options.length; i < l; i++) {
      if (options[i].selected) {
        value.push(options[i].value);
      }
    }

    this.setState({
      skills: value
    });
}

/****************Check Box************/  
onChange_check_box(e)
{
  var x = document.getElementsByName('role');
  var i;
  var b = e.target.value;

  for (i = 0; i < x.length; i++) {
    if(x[i].value != b) x[i].checked = false;
  }

  this.setState({
    role: e.target.value
  });
    
}

/****************Radio button************/  
  onChange_radio_button(e){
    this.setState({
      status: e.target.value
    });
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
      //this.setState({disabled: true});
        let nameError = "";
        let emailError = "";

        if(!this.state.name)
        {
          nameError = 'Name is Required.';
        }

        if(!this.state.email)
        {
          emailError = 'Email is Required.';
        }

        if(!this.state.email.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i) && this.state.email!='')
        {
          emailError = 'Please Enter Valid Email id.';
        }

        if(nameError || emailError)
         {
              this.setState({nameError,emailError});
              return false;
         }
         else{
          return true; 
         }
         
    }

cancel_page(e)
 {
   this.props.history.push('/admin/list_user');
 }
  /**********Submit Form*****************/
submitForm(e){
    e.preventDefault(); 
    const isVaild = this.user_validation();

     if(isVaild)
     {     
          this.setState({disabled: true});

            let formdata = new FormData();
            formdata.append('name',this.state.name);
            formdata.append('address',this.state.address);
            formdata.append('content',this.state.content);
            formdata.append('content_idea',this.state.content_idea);
            formdata.append('email',this.state.email);
            formdata.append('hobby',this.state.hobby);
            formdata.append('mobile',this.state.mobile);
            formdata.append('role',this.state.role);
            formdata.append('dateofjoin',this.state.startDate);
            formdata.append('skills',JSON.stringify(this.state.skills));
            formdata.append('status',this.state.status);
            formdata.append('files',this.state.file);
            formdata.append('user_id',this.state.user_id);
            formdata.append('existing_image',this.state.existing_image);


          const response_check = api_service('update_user',formdata,'2');
            response_check.then(response=>{

                  console.log('neeed to chjeck response..');
                  console.log(response);

                  if(response.status==200)
                  {
                    toast.success(response.data.message,{ autoClose: 1000 });
                            setTimeout(() => {
                                this.setState({disabled:false});
                                this.props.history.push(MODULE_REDIRECT_URL);
                            }, 1500);
                  }
                  else{
                      this.setState({disabled:false,emailError:response.err_msg.message});
                  }
          })
            
          
            
          // axios.post(ADMIN_API_URL+'update_user', formdata,{
          //   headers :  image_token_header()
          // }) 
          // .then((response) => 
          // {
          //      if(response.status==200)
          //      {
          //         toast.success(response.data.message,{ autoClose: 1000 });
          //         setTimeout(() => {
          //           this.setState({disabled: false});
          //           this.props.history.push('/admin/list_user');
          //         }, 1500);
          //      } 
          // })
          // .catch((error) => 
          // {
          //    this.setState({disabled: false});
          //    console.log('check add user catch error');
          //    console.log(error);
          // })
     }
     else{
      console.log('validation fire');
     }
    
 }

 componentDidMount()
 {
      const response_check = api_service('edit_user',{'user_id':this.props.match.params.id});
      response_check.then(response=>{

            if(response.status==200)
            {
                  var obj_value = response.data.data;
                  this.setState({ 
                      collapse: true,
                      fadeIn: true,
                      timeout: 300,
                      file:'',
                      imagePreviewUrl:'',
                      content:'',
                      content_idea:'',
                      name:obj_value.name,
                      email:obj_value.email,
                      mobile:obj_value.mobile,
                      address:obj_value.address,
                      hobby:obj_value.hobby,
                      content : obj_value.your_post,
                      content_idea : obj_value.new_idea,
                      status:(obj_value.status=='1') ? 'Active' : 'Inactive',
                      selected_status : 'Active',
                      role:obj_value.role,
                      user_id:obj_value._id,
                      existing_image:obj_value.profile_image,
                      existing_image_url:obj_value.profile_image_link,
                      skills:obj_value.skills,
                      startDate:new Date(obj_value.dateofjoin)
                  });

                  $("#skills").val(obj_value.skills);

            }
      })
 }

toggle_image_preview()
{
  
  this.setState({
    modal_preview: !this.state.modal_preview,
  });
}


  render() {
    let {imagePreviewUrl} = this.state;
    let $imagePreview = null;
    if (imagePreviewUrl) 
    {
      $imagePreview = (<img src={imagePreviewUrl} />);
    } else 
    {
      $imagePreview = (<div className="previewText">Please select an Image for Preview</div>);
    }

    return (
      <div className="animated fadeIn">

        <Row>
          <Col xs="12" md="12">
            <Card>
              <CardHeader>
                <strong>Edit User Information</strong>
              </CardHeader>
              <CardBody>

                <Form onSubmit={this.submitForm} method="post" encType="multipart/form-data" className="form-horizontal">

                <FormGroup row>
                    <Col md="3">
                        <Label htmlFor="name">Name</Label>
                    </Col>
                    
                    <Col xs="12" md="9">
                        <Input type="text" id="name" name="name" placeholder="Name" value={this.state.name} onChange={this.onChange_watch}/>
                        {/* <FormText color="muted">This is a help text</FormText> */}
                        <div className="validation-error">{this.state.nameError}</div>
                    </Col>
                </FormGroup>

                <FormGroup row>
                    <Col md="3">
                      <Label htmlFor="email">Email</Label>
                    </Col>
                    <Col xs="12" md="9">
                      <Input type="text" id="email" name="email" placeholder="Email" autoComplete="email" value={this.state.email} onChange={this.onChange_watch}/>
                      {/* <FormText className="help-block">Please enter your email</FormText> */}
                      <div className="validation-error">{this.state.emailError}</div>
                    </Col>
                </FormGroup>

                <FormGroup row>
                    <Col md="3">
                      <Label htmlFor="mobile">Mobile</Label>
                    </Col>
                    <Col xs="12" md="9">
                      <Input type="text" id="mobile" name="mobile" placeholder="Mobile" value={this.state.mobile} onChange={this.onChange_watch}/>
                      {/* <FormText className="help-block">Please enter your mobile no</FormText> */}
                    </Col>
                </FormGroup>

                <FormGroup row>
                    <Col md="3">
                      <Label htmlFor="dofjoin">Date Of Joining</Label>
                    </Col>
                    <Col xs="12" md="9">
                        <DatePicker 
                          id="dofjoin" 
                          name='dofjoin' 
                          selected={this.state.startDate} 
                          onChange={this.handleChange_date}
                          dropdownMode="select"
                          showMonthDropdown
                          showYearDropdown
                          adjustDateOnChange
                        />
                    </Col>
                </FormGroup>

                <FormGroup row>
                    <Col md="3">
                    <Label htmlFor="address">Address</Label>
                    </Col>
                    <Col xs="12" md="9">
                    <Input type="textarea" name="address" id="address" rows="9" placeholder="Address" value={this.state.address} onChange={this.onChange_watch}/>
                    </Col>
                </FormGroup>


                <FormGroup row>
                <Col md="3">
                    <Label htmlFor="hobby">Hobby</Label>
                </Col>
                <Col xs="12" md="9">
                    <Input type="select" name="hobby" id="hobby" value={this.state.hobby} onChange={this.onChange_watch}>
                    <option value="0">Please select</option>
                    <option value="1">Watch Video</option>
                    <option value="2">Traveling</option>
                    <option value="3">Take Rest</option>
                    </Input>
                </Col>
                </FormGroup>  

                <FormGroup row>
                    <Col md="3">
                      <Label htmlFor="skills">Skills</Label>
                    </Col>
                    <Col md="9">
                      <Input type="select" name="skills" id="skills" ref="skills_list" multiple onChange={this.onChange_multiple_select}>
                        <option value="1">Node Js</option>
                        <option value="2">React JS</option>
                        <option value="3">Mongo DB</option>
                        <option value="4">Mysql</option>
                        <option value="5">Elastic Search</option>
                        <option value="6">Block Chain</option>
                        <option value="7">AWS</option>
                      </Input>
                    </Col>
                </FormGroup>

                <FormGroup row>
                    <Col md="3"><Label>Role</Label></Col>
                    <Col md="9">
                      <FormGroup check className="checkbox">
                        <Input className="form-check-input" type="checkbox" id="checkbox1" name="role" value="Developer" checked = {this.state.role==='Developer'} onChange={this.onChange_check_box}/>
                        <Label check className="form-check-label" htmlFor="checkbox1">Developer</Label>
                      </FormGroup>

                      <FormGroup check className="checkbox">
                        <Input className="form-check-input" type="checkbox" id="checkbox1" name="role" value="Designer" checked = {this.state.role==='Designer'} onChange={this.onChange_check_box}/>
                        <Label check className="form-check-label" htmlFor="checkbox2">Designer</Label>
                      </FormGroup>
                    </Col>
                </FormGroup>

                <FormGroup row>
                <Col md="3">
                    <Label>Status</Label>
                </Col>
                <Col md="9">
                    <FormGroup check className="radio">
                    <Input className="form-check-input" type="radio" id="active" name="status" value="Active" checked = {this.state.status==='Active'} onChange={this.onChange_radio_button} />
                    <Label check className="form-check-label" htmlFor="radio1">Active</Label>
                    </FormGroup>
                    
                    <FormGroup check className="radio">
                    <Input className="form-check-input" type="radio" id="inactive" name="status" value="Inactive" checked = {this.state.status==='Inactive'} onChange={this.onChange_radio_button}/>
                    <Label check className="form-check-label" htmlFor="radio2">Inactive</Label>
                    </FormGroup>
                   
                </Col>
                </FormGroup>  

                  <FormGroup row>
                    <Col md="3">
                      <Label htmlFor="file-input-custom">Profile Picture</Label>
                    </Col>
                    <Col xs="12" md="9">
                      <Input className="fileInput" type="file" onChange={(e)=>this._handleImageChange(e)} />
                      
                     {this.state.existing_image_url!='' ? <Button onClick={this.toggle_image_preview} className="mr-1">Profile Image</Button> : ''}

                    <Modal isOpen={this.state.modal_preview} toggle={this.toggle_image_preview} className={'modal-lg ' + this.props.className}>
                        <ModalHeader toggle={this.toggle_image_preview}>Profile Image Preview</ModalHeader>
                          <ModalBody>
                          {this.state.existing_image_url!='' ? <img src={this.state.existing_image_url} alt="new" width="100%" height="100%"/> : 'No Image'}
                          </ModalBody>
                        <ModalFooter>
                          <Button color="secondary" onClick={this.toggle_image_preview}>Close</Button>
                        </ModalFooter>
                    </Modal>


                      <div className="imgPreview">{$imagePreview}</div>
                    </Col>
                  </FormGroup>


                  <FormGroup row hidden>
                    <Col md="3">
                      <Label className="custom-file" htmlFor="custom-file-input">Custom file input</Label>
                    </Col>
                    <Col xs="12" md="9">
                      <Label className="custom-file">
                        <Input className="custom-file" type="file" id="custom-file-input" name="file-input" />
                        <span className="custom-file-control"></span>
                      </Label>
                    </Col>
                  </FormGroup>

                  <FormGroup row>
                    <Col md="2">
                        <Label htmlFor="name">What is Your POST ?</Label>
                    </Col>
                    <Col xs="12" md="10">
                    <CKEditor id="textarea_id" name="textarea_id" activeClass="p10" 
                        content={this.state.content}
                        config={{allowedContent:true,contentsCss:'https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css'}}
                        removeButto = 'Form,Checkbox,Radio,TextField,Textarea,Select,Button,ImageButton,HiddenField,SelectAll,Scayt,Flash,Smiley,About'  
                        events={{"blur": this.onBlur,"afterPaste": this.afterPaste,"change": this.onChange}} />
                    </Col>
                </FormGroup>

                <FormGroup row>
                    <Col md="2">
                        <Label htmlFor="name">What is New Idea ?</Label>
                    </Col>
                    <Col xs="12" md="10">
                    <CKEditor id="idea_id" name="idea_id" activeClass="p10" 
                        content={this.state.content_idea}
                        config={{allowedContent:true,contentsCss:'https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css'}}
                        removeButto = 'Form,Checkbox,Radio,TextField,Textarea,Select,Button,ImageButton,HiddenField,SelectAll,Scayt,Flash,Smiley,About'  
                        events={{"blur": this.onBlur_idea,"afterPaste": this.afterPaste_idea,"change": this.onChange_idea}} />
                    </Col>
                </FormGroup>

                <Button color="primary" type="submit" className="mr-2 px-4" disabled={this.state.disabled}>{this.state.disabled ? 'Updating...' : 'Update User'}</Button>
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
