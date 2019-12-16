import React, { Component } from 'react';
import ReactDOM from 'react-dom';
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


import CKEditor from "react-ckeditor-component";
import axios from 'axios'; 
import { ToastContainer, toast } from 'react-toastify';

import {checkLogin,image_token_header,token_header} from '../../Helper/Loginhelper';
import {api_service} from '../../Helper/APIServicehelper';


const ADMIN_API_URL = process.env.REACT_APP_ADMIN_API_URL;
const MODULE_REDIRECT_URL='/admin/list_peoples';



export default class Managepeople extends Component 
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
            title_name:(this.props.match.params.id===undefined)?'Add':'Edit',
            button_name:(this.props.match.params.id===undefined)?'Add':'Update',
            server_progress_button:(this.props.match.params.id===undefined)?'Add...':'Update...',
            api_url_slug:(this.props.match.params.id===undefined)?'add_people':'update_people',
            existing_image_url:'',
            modal_preview: false,
            select_portfolio:[],
        };

        // ckeditor related below function
        this.onChange = this.onChange.bind(this);

        this.onChange_watch = this.onChange_watch.bind(this);
        this.submitForm = this.submitForm.bind(this);
        this.notify = this.submitForm.bind(this);
        this.cancel_page = this.cancel_page.bind(this);
        this.check_people_type = this.check_people_type.bind(this);

        this.toggle_image_preview = this.toggle_image_preview.bind(this);

        this.onChange_multiple_select = this.onChange_multiple_select.bind(this);
        this.get_portfolio_list_dropdown = this.get_portfolio_list_dropdown.bind(this);
        

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
            formdata.append('select_portfolio',JSON.stringify(this.state.select_portfolio));

            if(this.props.match.params.id!==undefined)
            {
                formdata.append('p_id',this.state.edit_people_idd);
                formdata.append('old_profile_image',this.state.existing_image);
            }
           
            const response_check = api_service(this.state.api_url_slug,formdata,'2');
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

  /**********New Function*****************/ 
check_people_type(e,p_type='')
{
      var target_value = '';
      if(p_type=='')
      {
        target_value = e.target.value;
      }
      else{
        target_value = p_type;
      }

      var myobj = {};
      if(target_value==2 || target_value==3)
      {
            myobj.other_view = true;
            myobj.default_view = true;
            myobj.title_view=false;
      }
      else if(target_value==1)
      {
            myobj.other_view = false;
            myobj.default_view = true;
            myobj.title_view=true;
      }
      else if(target_value==0)
      {
            myobj.other_view = false;
            myobj.default_view = false;
            myobj.title_view=false;
      }

      myobj.people_type=target_value;
      this.setState(myobj);
}

 async get_people_record()
 {
     await axios.post(ADMIN_API_URL+'edit_people',{'people_id':this.props.match.params.id},{
            headers :  token_header()
          }) 
          .then((response) => 
          {
               if(response.status==200)
                {
                   var obj_value = response.data.data;

                  this.check_people_type('',obj_value.p_type);

                    this.setState({ 
                        collapse: true,
                        fadeIn: true,
                        timeout: 300,
                        file:'',
                        imagePreviewUrl:'',
                        content:obj_value.bio,
                        name:obj_value.name,
                        people_type:obj_value.p_type,
                        job_other:obj_value.job_title_other,
                        job_title:obj_value.job_id,
                        status:obj_value.status,
                        edit_people_idd:obj_value._id,
                        existing_image:obj_value.profile_image,
                        existing_image_url:obj_value.profile_image_link,
                        exisitng_select_portfolio:obj_value.portfolios
                    });
                }

                var select = ReactDOM.findDOMNode(this.refs.portfolioList).options;
                var selected_record_db = this.state.exisitng_select_portfolio;

                var value = [];
                for (var i = 0, l = select.length; i < l; i++) 
                {
                     let selected_id = selected_record_db.includes(select[i].value);
                      if(selected_id)
                      {
                        value.push(select[i].value);
                      }
                }

                this.setState({
                  multi_selected_value: value
                });
                
          })
          .catch((error) => 
          {
               console.log('error');
               console.log(error);
          })
 }

async get_job_list_dropdown()
 {
     await axios.post(ADMIN_API_URL+'list_job_title',{},{
            headers :  token_header()
          }) 
          .then((response) => 
          {
              if(response.data.status==1)
              {
                var obj_value = response.data.data.rows

                    this.setState({ 
                            job_id_array:obj_value,
                    }); 
              }
          })
          .catch((error) => 
          {
               console.log('error');
               console.log(error);
          })
}

async get_portfolio_list_dropdown()
{

  let response_check = await api_service('list_portfolio',{});
  //  console.log(response_check);

    if(response_check.status==200)
    {
      this.setState({ 
          portfolio_id_array:response_check.data.data.rows,
        }); 

    }
}

 async componentDidMount()
 {
    let get_job_list = await this.get_job_list_dropdown();

    let get_portfolio_list = await this.get_portfolio_list_dropdown();


    if(this.props.match.params.id!==undefined)
    {
        let getrecord = await this.get_people_record();
    }
 
 }

toggle_image_preview()
{ 
  this.setState({
    modal_preview: !this.state.modal_preview,
  });
}

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
      select_portfolio: value,
      multi_selected_value:value      
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

    const { default_view,other_view,title_view,job_id_array,portfolio_id_array } = this.state;

    // cosmontic changes
    const { title_name,button_name,server_progress_button } = this.state;

    return (
      <div className="animated fadeIn">
        <Row>
          <Col xs="12" md="12">
            <Card>
              <CardHeader>
                <strong>{title_name} People</strong>
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

                          <Col md="3">
                             <Label htmlFor="select_portfolio">Select Portfolio</Label>
                          </Col>
                          <Col xs="12" md="6">
                              <Input type="select" ref="portfolioList" value={this.state.multi_selected_value} name="select_portfolio" id="select_portfolio" multiple onChange={this.onChange_multiple_select}>
                                {
                                    portfolio_id_array.map(msg => {
                                        return (
                                            <option key={msg._id} value={msg._id}>{msg.title}</option>
                                        )
                                    })
                                }

                                  {/* <option>1</option>
                                  <option>2</option>
                                  <option>3</option>
                                  <option>4</option>
                                  <option>5</option> */}
                              </Input>
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
                    <Button color="primary" type="submit" className="mr-2 px-4" disabled={this.state.disabled}>{this.state.disabled ? server_progress_button :button_name}</Button>
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


