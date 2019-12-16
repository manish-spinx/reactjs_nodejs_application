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


import CKEditor from "react-ckeditor-component";
import axios from 'axios'; 
import { ToastContainer, toast } from 'react-toastify';

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import {checkLogin,image_token_header,token_header} from '../../Helper/Loginhelper';
import {api_service} from '../../Helper/APIServicehelper';

const ADMIN_API_URL = process.env.REACT_APP_ADMIN_API_URL;
const MODULE_REDIRECT_URL='/admin/list_portfolio';

export default class Manageportfolio extends Component 
{
  constructor(props) {
    super(props)

       // checkLogin();

        this.state = {
            collapse: true,
            fadeIn: true,
            timeout: 300,
            file:'',
            imagePreviewUrl:'',
            content:'',
            name:'',            
            status:'1',  
            startDate: new Date(),
            modal_preview: false,
            e_portfolio_logo_url:'',
            website_url:'',
            hadquarters:'',
            p_t_history:'',
            p_t_industrial:'',
            p_t_software:'',

            p_t_history_flag:false,
            p_t_industrial_flag:false,
            p_t_software_flag:false,

            e_portfolio_logo_url:'',
            title_name:(this.props.match.params.id===undefined)?'Add':'Edit',
            button_name:(this.props.match.params.id===undefined)?'Add':'Update',
            server_progress_button:(this.props.match.params.id===undefined)?'Add...':'Update...',
            api_url_slug:(this.props.match.params.id===undefined)?'add_portfolio':'update_portfolio',
        };

        // ckeditor related below function
        this.onChange = this.onChange.bind(this);
        this.onChange_watch = this.onChange_watch.bind(this);
        this.submitForm = this.submitForm.bind(this);        
        this.cancel_page = this.cancel_page.bind(this);  
        this.toggle_image_preview = this.toggle_image_preview.bind(this);  
        this.handleChange_date = this.handleChange_date.bind(this);  

        // checkbox function 
        this.onChange_check_box = this.onChange_check_box.bind(this);          
        
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

        if(!this.state.name)
        {
           nameError = 'Title is Required.';
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


  /**********Submit Form*****************/
submitForm(e){
    e.preventDefault(); 
    const isVaild = this.user_validation();

     if(isVaild)
     {
         console.log(this.state);

        this.setState({disabled: true});           
        let formdata = new FormData();
        formdata.append('title',this.state.name);
        formdata.append('content',this.state.content);
        formdata.append('status',this.state.status);
        formdata.append('logo_image',this.state.file);
        formdata.append('hadquarters',this.state.hadquarters);
        formdata.append('investment_date',this.state.startDate);
        formdata.append('website_url',this.state.website_url);

        //checkbox
        formdata.append('p_type_history',this.state.p_t_history);
        formdata.append('p_type_industry',this.state.p_t_industrial);
        formdata.append('p_type_software',this.state.p_t_software);

        formdata.append('p_type_history_flag',this.state.p_t_history_flag);
        formdata.append('p_type_industry_flag',this.state.p_t_industrial_flag);
        formdata.append('p_type_software_flag',this.state.p_t_software_flag);

        
        if(this.props.match.params.id!==undefined)
        {
            formdata.append('p_id',this.state.edit_portfolio_idd);
            formdata.append('old_logo_image',this.state.e_portfolio_logo);
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

handleChange_date(date) 
{
    this.setState({
      startDate: date
    });
}


cancel_page(e)
{
   this.props.history.push(MODULE_REDIRECT_URL);
}

async componentDidMount()
{
    if(this.props.match.params.id!==undefined)
    {

      const response_check = api_service('edit_portfolio',{'p_id':this.props.match.params.id});
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
                        content:obj_value.content,                    
                        name:obj_value.title,
                        edit_portfolio_idd:obj_value._id,
                        status:obj_value.status,
                        website_url:obj_value.website_url,
                        hadquarters:obj_value.headquarters,
                        e_portfolio_logo:obj_value.logo_image,
                        e_portfolio_logo_url:obj_value.logo_image_link,
                        p_t_history:obj_value.p_type_history,
                        p_t_industrial:obj_value.p_type_industry,
                        p_t_software:obj_value.p_type_software, 
                        startDate:new Date(obj_value.investment_date),                        
                        p_t_history_flag:(obj_value.p_type_history==1)?true:false,
                        p_t_industrial_flag:(obj_value.p_type_industry==1)?true:false,
                        p_t_software_flag:(obj_value.p_type_software==1)?true:false,
                  });
          }
          else{
            toast.success(response.data.message.message,{ autoClose: 1000 });
            this.props.history.push(MODULE_REDIRECT_URL);
          }            
      })
    }       
}

toggle_image_preview()
{ 
  this.setState({
    modal_preview: !this.state.modal_preview,
  });

  this.setState({modal_preview: !this.state.modal_preview});
}

onChange_check_box(e)
{
   if(e.target.name==='p_t_history')
    {
      if(this.state.p_t_history_flag==false)
      {
          this.setState({
            p_t_history_flag: true
        });
      }
      else{
          this.setState({
            p_t_history_flag: false
        });
      } 
    }

    if(e.target.name==='p_t_industrial')
    {
      if(this.state.p_t_industrial_flag==false)
      {
          this.setState({
            p_t_industrial_flag: true
        });
      }
      else{
          this.setState({
            p_t_industrial_flag: false
        });
      } 
    }


    if(e.target.name==='p_t_software')
    {
      if(this.state.p_t_software_flag==false)
      {
          this.setState({
            p_t_software_flag: true
        });
      }
      else{
          this.setState({
            p_t_software_flag: false
        });
      } 
    }
}

render() {

    let $imagePreview = null;
    let {imagePreviewUrl} = this.state;
    
    if (imagePreviewUrl) 
    {
      $imagePreview = (<img src={imagePreviewUrl} />);
    } else 
    {
      $imagePreview = (<div className="previewText">Please select an Image for Preview</div>);
    }

    
    const { title_name,button_name,server_progress_button } = this.state;

    return (
      <div className="animated fadeIn">
        <Row>
          <Col xs="12" md="12">
            <Card>
              <CardHeader>
                <strong>{title_name} Portfolio</strong>
              </CardHeader>
              <CardBody>

                <Form onSubmit={this.submitForm} method="post" encType="multipart/form-data" className="form-horizontal">
                
                <FormGroup row>
                    <Col md="3">
                        <Label htmlFor="name">Title</Label>
                    </Col>                    
                    <Col xs="12" md="9">
                        <Input type="text" id="name" name="name" placeholder="Title" value={this.state.name} onChange={this.onChange_watch}/>
                        <div className="validation-error">{this.state.nameError}</div>
                    </Col>
                </FormGroup>

                <FormGroup row>
                    <Col md="3">
                        <Label htmlFor="file-input-custom">Logo Image</Label>
                    </Col>
                    <Col xs="12" md="9">
                        <Input className="fileInput" type="file" onChange={(e)=>this._handleImageChange(e)} />
                        {this.state.e_portfolio_logo_url!='' ? <Button onClick={this.toggle_image_preview} className="mr-1">Logo Image</Button> : ''}

                        <Modal isOpen={this.state.modal_preview} toggle={this.toggle_image_preview} className={'modal-lg ' + this.props.className}>
                            <ModalHeader toggle={this.toggle_image_preview}>Logo Image Preview</ModalHeader>
                            <ModalBody>
                                {this.state.e_portfolio_logo_url!='' ? <img src={this.state.e_portfolio_logo_url} alt="new" width="100%" height="100%"/> : 'No Image'}
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
                
               
                
                 {
                   this.props.match.params.id!==undefined &&

                   <FormGroup row>
                    <Col md="3"><Label>Portfolio Type Edit</Label></Col>
                    <Col md="9">
                      <FormGroup check className="checkbox">
                        <Input className="form-check-input" type="checkbox" id="checkbox1" name="p_t_history" value="Historical" checked = {this.state.p_t_history_flag} onChange={this.onChange_check_box}/>
                        <Label check className="form-check-label" htmlFor="checkbox1">Historical</Label>
                      </FormGroup>

                      <FormGroup check className="checkbox">
                        <Input className="form-check-input" type="checkbox" id="checkbox2" name="p_t_industrial" value="Industrial" checked = {this.state.p_t_industrial_flag} onChange={this.onChange_check_box}/>
                        <Label check className="form-check-label" htmlFor="checkbox2">Industrial & Business Services</Label>
                      </FormGroup>

                      <FormGroup check className="checkbox">
                        <Input className="form-check-input" type="checkbox" id="checkbox3" name="p_t_software" value="Software" checked = {this.state.p_t_software_flag} onChange={this.onChange_check_box}/>
                        <Label check className="form-check-label" htmlFor="checkbox3">Software & Tech-Enabled Services</Label>
                      </FormGroup>
                    </Col>
                  </FormGroup>
                 }   
                

                
                {
                  this.props.match.params.id==undefined &&
                   <FormGroup row>
                    <Col md="3"><Label>Portfolio Type add</Label></Col>
                    <Col md="9">
                      <FormGroup check className="checkbox">
                        <Input className="form-check-input" type="checkbox" id="checkbox1" name="p_t_history" value="Historical" checked = {this.state.p_t_history_flag} onChange={this.onChange_check_box}/>
                        <Label check className="form-check-label" htmlFor="checkbox1">Historical</Label>
                      </FormGroup>

                      <FormGroup check className="checkbox">
                        <Input className="form-check-input" type="checkbox" id="checkbox2" name="p_t_industrial" value="Industrial" checked = {this.state.p_t_industrial_flag} onChange={this.onChange_check_box}/>
                        <Label check className="form-check-label" htmlFor="checkbox2">Industrial & Business Services</Label>
                      </FormGroup>

                      <FormGroup check className="checkbox">
                        <Input className="form-check-input" type="checkbox" id="checkbox3" name="p_t_software" value="Software" checked = {this.state.p_t_software_flag} onChange={this.onChange_check_box}/>
                        <Label check className="form-check-label" htmlFor="checkbox3">Software & Tech-Enabled Services</Label>
                      </FormGroup>

                    </Col>
                </FormGroup>
               }

                <FormGroup row>
                    <Col md="3">
                        <Label htmlFor="name">Content</Label>
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
                      <Label htmlFor="invest_date">Investment Date</Label>
                    </Col>
                    <Col xs="12" md="9">
                        <DatePicker 
                          id="invest_date" 
                          name='invest_date' 
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
                        <Label htmlFor="hadquarters">Headquarters</Label>
                    </Col>
                    
                    <Col xs="12" md="9">
                        <Input type="text" id="hadquarters" name="hadquarters" placeholder="Headquarters" value={this.state.hadquarters} onChange={this.onChange_watch}/>
                    </Col>
                </FormGroup>


                <FormGroup row>
                    <Col md="3">
                        <Label htmlFor="website_url">Website url</Label>
                    </Col>
                    
                    <Col xs="12" md="9">
                        <Input type="text" id="website_url" name="website_url" placeholder="Website url" value={this.state.website_url} onChange={this.onChange_watch}/>
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
                    <Button color="primary" type="submit" className="mr-2 px-4" disabled={this.state.disabled}>{this.state.disabled ? server_progress_button : button_name}</Button>
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


