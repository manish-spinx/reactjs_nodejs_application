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

import {checkLogin,image_token_header,token_header} from '../../Helper/Loginhelper';
import {api_service} from '../../Helper/APIServicehelper';

const ADMIN_API_URL = process.env.REACT_APP_ADMIN_API_URL;
const MODULE_REDIRECT_URL='/admin/list_strategies';

export default class Managestrategy extends Component 
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
            file_icon: '',
            imagePreviewUrl_icon:'',
            content:'',
            name:'',            
            status:'1',  
            modal_preview: false,
            modal_preview_icon: false, 
            e_icon_image_url:'',
            e_strategy_image_url:'',
            title_name:(this.props.match.params.id===undefined)?'Add':'Edit',
            button_name:(this.props.match.params.id===undefined)?'Add':'Update',
            server_progress_button:(this.props.match.params.id===undefined)?'Add...':'Update...',
            api_url_slug:(this.props.match.params.id===undefined)?'add_strategies':'update_strategies',
        };

        // ckeditor related below function
        this.onChange = this.onChange.bind(this);

        this.onChange_watch = this.onChange_watch.bind(this);
        this.submitForm = this.submitForm.bind(this);        
        this.cancel_page = this.cancel_page.bind(this);  
        this.toggle_image_preview = this.toggle_image_preview.bind(this);  
        this.toggle_image_preview_icon = this.toggle_image_preview_icon.bind(this);          
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

_handleImageChange_icon(e)
{
    e.preventDefault();

    let reader = new FileReader();
    let file_icon = e.target.files[0];

    reader.onloadend = () => {
        this.setState({
            file_icon: file_icon,
            imagePreviewUrl_icon: reader.result
        });
      }

    reader.readAsDataURL(file_icon);
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
           nameError = 'Name is Required.';
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

        this.setState({disabled: true});
           
        let formdata = new FormData();
        formdata.append('name',this.state.name);
        formdata.append('content',this.state.content);
        formdata.append('status',this.state.status);
        formdata.append('strategy_image',this.state.file);
        formdata.append('icon_image',this.state.file_icon);

        if(this.props.match.params.id!==undefined)
        {
            formdata.append('s_id',this.state.edit_strategy_idd);
            formdata.append('old_strategy_image',this.state.e_strategy_image);
            formdata.append('old_icon_image',this.state.e_icon_image);
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

async componentDidMount()
{
    if(this.props.match.params.id!==undefined)
    {

      const response_check = api_service('edit_strategies',{'s_id':this.props.match.params.id});
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
                        file_icon: '',
                        imagePreviewUrl_icon:'',
                        content:obj_value.content,                    
                        name:obj_value.name,
                        status:obj_value.status,
                        edit_strategy_idd:obj_value._id,
                        e_icon_image:obj_value.icon_image,
                        e_icon_image_url:obj_value.icon_image_link,
                        e_strategy_image:obj_value.strategy_image,
                        e_strategy_image_url:obj_value.strategy_image_link,
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
}

 toggle_image_preview_icon()
 {
    this.setState({
        modal_preview_icon: !this.state.modal_preview_icon,
      });
 }

  render() {

    let $imagePreview = null;
    let $imagePreview_icon = null;

    let {imagePreviewUrl,imagePreviewUrl_icon} = this.state;

    
    if (imagePreviewUrl) 
    {
      $imagePreview = (<img src={imagePreviewUrl} />);
    } else 
    {
      $imagePreview = (<div className="previewText">Please select an Image for Preview</div>);
    }

    if (imagePreviewUrl_icon) 
    {
      $imagePreview_icon = (<img src={imagePreviewUrl_icon} />);
    } else 
    {
      $imagePreview_icon = (<div className="previewText">Please select an Icon for Preview</div>);
    }

    const { title_name,button_name,server_progress_button } = this.state;

    return (
      <div className="animated fadeIn">
        <Row>
          <Col xs="12" md="12">
            <Card>
              <CardHeader>
                <strong>{title_name} Strategies</strong>
              </CardHeader>
              <CardBody>

                <Form onSubmit={this.submitForm} method="post" encType="multipart/form-data" className="form-horizontal">
                
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
                        <Label htmlFor="file-input-custom">Icon</Label>
                    </Col>
                    <Col xs="12" md="9">
                        <Input className="fileInput" type="file" onChange={(e)=>this._handleImageChange_icon(e)} />
                        {this.state.e_icon_image_url!='' ? <Button onClick={this.toggle_image_preview_icon} className="mr-1">Icon</Button> : ''}

                        <Modal isOpen={this.state.modal_preview_icon} toggle={this.toggle_image_preview_icon} className={'modal-lg ' + this.props.className}>
                            <ModalHeader toggle={this.toggle_image_preview_icon}>Icon Preview</ModalHeader>
                            <ModalBody>
                                {this.state.e_icon_image_url!='' ? <img src={this.state.e_icon_image_url} alt="new" width="100%" height="100%"/> : 'No Image'}
                            </ModalBody>
                            <ModalFooter>
                                <Button color="secondary" onClick={this.toggle_image_preview_icon}>Close</Button>
                            </ModalFooter>
                        </Modal>

                        <div className="imgPreview">{$imagePreview_icon}</div>
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
                        <Label htmlFor="file-input-custom">Strategy Image</Label>
                    </Col>
                    <Col xs="12" md="9">
                        <Input className="fileInput" type="file" onChange={(e)=>this._handleImageChange(e)} />
                        {this.state.e_strategy_image_url!='' ? <Button onClick={this.toggle_image_preview} className="mr-1">Strategy Image</Button> : ''}

                        <Modal isOpen={this.state.modal_preview} toggle={this.toggle_image_preview} className={'modal-lg ' + this.props.className}>
                            <ModalHeader toggle={this.toggle_image_preview}>Strategy Image Preview</ModalHeader>
                            <ModalBody>
                                {this.state.e_strategy_image_url!='' ? <img src={this.state.e_strategy_image_url} alt="new" width="100%" height="100%"/> : 'No Image'}
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
                        <Label htmlFor="name">Page Content</Label>
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


