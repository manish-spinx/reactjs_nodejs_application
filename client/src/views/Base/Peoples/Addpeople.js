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

import {checkLogin,image_token_header,token_header} from '../../Helper/Loginhelper';
const ADMIN_API_URL = process.env.REACT_APP_ADMIN_API_URL;
const MODULE_REDIRECT_URL='/admin/list_peoples';

export default class Addpeople extends Component 
{
  constructor(props) {
    super(props)

        checkLogin();

        this.state = {
            collapse: true,
            fadeIn: true,
            timeout: 300,
            file:'',
            imagePreviewUrl:'',
            content:'',
            name:'',
            people_type:'',
            job_other:'',
            job_title:'',
            status:'1',
            nameError:'',
            people_typeError:'',
            job_otherError:'',
            job_titleError:'',
            default_view:false,
            other_view:false,
            title_view:false,
        };

        // ckeditor related below function
        this.onChange = this.onChange.bind(this);

        this.onChange_watch = this.onChange_watch.bind(this);
        this.submitForm = this.submitForm.bind(this);
        this.notify = this.submitForm.bind(this);
        this.cancel_page = this.cancel_page.bind(this);
        this.check_people_type = this.check_people_type.bind(this);
        
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
        let people_typeError = "";
        let job_otherError = "";
        let job_titleError = "";

        if(!this.state.name)
        {
           nameError = 'Name is Required.';
        }

        if(!this.state.people_type || this.state.people_type==0)
        {
           people_typeError = 'People type is Required.';
        }

        if((this.state.people_type==2 || this.state.people_type==3) && !this.state.job_other)
        {
            job_otherError = 'Job title other is Required.';
        }

        if((this.state.people_type==1) && !this.state.job_title)
        {
            job_titleError = 'Job title is Required.';
        }

        if(nameError || people_typeError || job_otherError || job_titleError)
         {
              this.setState({nameError,people_typeError,job_otherError,job_titleError});
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
            formdata.append('bio',this.state.content);
            formdata.append('p_type',this.state.people_type);
            formdata.append('job_title_other',this.state.job_other);
            formdata.append('job_id',this.state.job_title);
            formdata.append('status',this.state.status);
            formdata.append('profile_image',this.state.file);


          axios.post(ADMIN_API_URL+'add_people', formdata,{
            headers :  image_token_header()
          }) 
          .then((response) => 
          {   
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
          .catch((error) => 
          {
             console.log('check add user catch error');
             console.log(error);
             this.setState({disabled:false});

          })

     }
    
    
 }

 cancel_page(e)
 {
   this.props.history.push(MODULE_REDIRECT_URL);
 }

  /**********New Function*****************/ 
 check_people_type(e)
 {
     var myobj = {};
      if(e.target.value==2 || e.target.value==3)
      {
            myobj.other_view = true;
            myobj.default_view = true;
            myobj.title_view=false;
      }
      else if(e.target.value==1)
      {
            myobj.other_view = false;
            myobj.default_view = true;
            myobj.title_view=true;
      }
      else if(e.target.value==0)
      {
            myobj.other_view = false;
            myobj.default_view = false;
            myobj.title_view=false;
      }

      myobj.people_type=e.target.value;
      this.setState(myobj);  
 }

 async componentDidMount()
 {
    const get_job_title_list = await axios.post(ADMIN_API_URL+'list_job_title',{},{
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

          if(get_job_title_list.data.status==1)
          {
            var obj_value = get_job_title_list.data.data.rows

                this.setState({ 
                        job_id_array:obj_value,
                }); 
          }

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

    const { default_view,other_view,title_view,job_id_array } = this.state;


    return (
      <div className="animated fadeIn">
        <Row>
          <Col xs="12" md="12">
            <Card>
              <CardHeader>
                <strong>Add People</strong>
              </CardHeader>
              <CardBody>

                <Form onSubmit={this.submitForm} method="post" encType="multipart/form-data" className="form-horizontal">

                <FormGroup row>
                    <Col md="3">
                        <Label htmlFor="people_type">People Type</Label>
                    </Col>
                    <Col xs="12" md="9">
                        <Input type="select" name="people_type" id="people_type" value={this.state.people_type} onChange={this.check_people_type}>
                        <option value="0">Please select</option>
                        <option value="2">Advisor</option>
                        <option value="3">CEO</option>                        
                        <option value="1">Team member</option>
                        </Input>
                        <div className="validation-error">{this.state.people_typeError}</div>
                    </Col>
                </FormGroup>  
                
                
                <FormGroup row>
                    <Col md="3">
                        <Label htmlFor="name">Name</Label>
                    </Col>
                    
                    <Col xs="12" md="9">
                        <Input type="text" id="name" name="name" placeholder="Name" value={this.state.name} onChange={this.onChange_watch}/>
                        <div className="validation-error">{this.state.nameError}</div>
                    </Col>
                </FormGroup>

                {
                   default_view && other_view && (
                    <FormGroup row>
                        <Col md="3">
                            <Label htmlFor="job_other">Job title other</Label>
                        </Col>                    
                        <Col xs="12" md="9">
                            <Input type="text" id="job_other" name="job_other" placeholder="Job title other" value={this.state.job_other} onChange={this.onChange_watch}/>
                            <div className="validation-error">{this.state.job_otherError}</div>
                        </Col>
                     </FormGroup>
                   ) 
                }
                
                {
                   default_view && title_view && (
                    <React.Fragment>
                        <FormGroup row>
                            <Col md="3">
                                <Label htmlFor="job_title">Job Title</Label>
                            </Col>
                            <Col xs="12" md="9">
                                <Input type="select" name="job_title" id="job_title" value={this.state.job_title} onChange={this.onChange_watch}>
                                <option value="0">Select Job Title</option>
                                 {
                                    job_id_array.map(msgTemplate => {
                                        return (
                                            <option key={msgTemplate._id} value={msgTemplate._id}>{msgTemplate.name}</option>
                                        )
                                    })
                                }
                                </Input>
                                <div className="validation-error">{this.state.job_titleError}</div>
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
                    </React.Fragment>
                   ) 
                }


                <FormGroup row>
                    <Col md="3">
                        <Label htmlFor="name">BIO</Label>
                    </Col>
                    <Col xs="12" md="9">
                    <CKEditor id="textarea_id" name="textarea_id" activeClass="p10" 
                        content={this.state.content}
                        config={{allowedContent:true,contentsCss:'https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css'}}
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


