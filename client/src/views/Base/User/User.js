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

import DatePicker from "react-datepicker";
import CKEditor from "react-ckeditor-component";
import "react-datepicker/dist/react-datepicker.css";
import axios from 'axios'; 
import { ToastContainer, toast } from 'react-toastify';
//import 'react-toastify/dist/ReactToastify.css';

import {checkLogin,image_token_header} from '../../Helper/Loginhelper';

const ADMIN_API_URL = process.env.REACT_APP_ADMIN_API_URL;

const headers = image_token_header();

export default class User extends Component 
{
  constructor(props) {
    super(props)

        //this.toggle = this.toggle.bind(this);
        //this.toggleFade = this.toggleFade.bind(this);
        checkLogin();
      // const token = localStorage.getItem("token");
      // if(token == null)
      //   {
      //       this.props.history.push('/login');
      //   }

        this.state = {
            collapse: true,
            fadeIn: true,
            timeout: 300,
            file:'',
            imagePreviewUrl:'',
            startDate: new Date(),
            content:'',
            content_idea:'',
            name:'',
            email:'',
            mobile:'',
            address:'',
            hobby:'',
            password:'',
            nameError:'',
            emailError:'',
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
        this.cancel_page = this.cancel_page.bind(this);


  }


  formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
 }

  handleChange_date(date) 
  {
    //var new_date = this.formatDate(date);
    //console.log('new date----------');
    //console.log(new_date);
    

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



//   toggle() {
//     this.setState({ collapse: !this.state.collapse });
//   }

//   toggleFade() {
//     this.setState((prevState) => { return { fadeIn: !prevState }});
//   }

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
            //formdata.append('skills',this.state.skills);
            formdata.append('status',this.state.status);
            formdata.append('password',this.state.password);
            formdata.append('files',this.state.file);
            


          axios.post(ADMIN_API_URL+'add_user', formdata,{
            headers :  headers
          }) 
          .then((response) => 
          {
              console.log('check response ');
              console.log(response);

              //toast('Upload in Progress',{ autoClose: false });
               if(response.status==200)
               {
                  toast.success(response.data.message,{ autoClose: 1000 });
                  setTimeout(() => {
                    this.setState({disabled:false});
                    this.props.history.push('/admin/list_user');
                  }, 1500);

               }
               else{
                  this.setState({disabled:false,emailError:response.data.message.message});
               }                
          })
          .catch((error) => 
          {
             this.setState({disabled:false});
          })

     }
     else{
      console.log('validation fire');
     }
    
 }

 cancel_page(e)
 {
   this.props.history.push('/admin/list_user');
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
                <strong>Add User Information</strong>
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
                      <Label htmlFor="email">Password</Label>
                    </Col>
                    <Col xs="12" md="9">
                      <Input type="password" id="password" name="password" placeholder="Password" value={this.state.password} onChange={this.onChange_watch}/>
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
                      <Input type="select" name="skills" id="skills" multiple onChange={this.onChange_multiple_select}>
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
                        <Input className="form-check-input" type="checkbox" id="checkbox1" name="role" value="Developer" onClick={this.onChange_check_box}/>
                        <Label check className="form-check-label" htmlFor="checkbox1">Developer</Label>
                      </FormGroup>

                      <FormGroup check className="checkbox">
                        <Input className="form-check-input" type="checkbox" id="checkbox1" name="role" value="Designer" onClick={this.onChange_check_box}/>
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
                    <Input className="form-check-input" type="radio" id="active" name="status" value="Active" onChange={this.onChange_radio_button} />
                    <Label check className="form-check-label" htmlFor="radio1">Active</Label>
                    </FormGroup>
                    
                    <FormGroup check className="radio">
                    <Input className="form-check-input" type="radio" id="inactive" name="status" value="Inactive" onChange={this.onChange_radio_button}/>
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
                 <div>
                    <Button color="primary" type="submit" className="mr-2 px-4" disabled={this.state.disabled}>{this.state.disabled ? 'Add...' : 'Add'}</Button>
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


