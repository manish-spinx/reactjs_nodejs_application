import React, { Component } from 'react';
import {
  Badge,
  Card,
  Button,
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
  Pagination,
  PaginationItem,
  PaginationLink,
  Table
} from 'reactstrap';


import { Link,Redirect } from 'react-router-dom';
import axios from 'axios';  
import ReactDOM from 'react-dom';
import Swal from 'sweetalert2';
import { ToastContainer, toast } from 'react-toastify';
import Moment from 'react-moment';

// Toggle button
import { AppSwitch } from '@coreui/react'

import DataTable,{memoize } from 'react-data-table-component';
import styled, { keyframes } from 'styled-components';

import {checkLogin,token_header} from '../../Helper/Loginhelper';
import HOCdatatable from '../../HOC/HOCdatatable';

const ADMIN_API_URL = '/admin_api/';
const MODULE_REDIRECT_URL='/admin/list_peoples';


const columns = memoize(clickHandler => [  
  {
    name: 'People Type',
    label: true,
    cell: row => (row.p_type==1)?<label>Team Member</label>:(row.p_type==2)?<label>Advisor</label>:<label>CEO</label>,
    width:"14%"
  },  
  {
    name: 'Name',
    selector: 'name',
    sortable: true,
    width:"14%"
  },
  {
    name: 'Job title',
    selector: 'job_title_name',
    sortable: true,
    width:"15%"
  },
  {
    name: 'Job title others',
    selector: 'job_title_other',
    sortable: true,
    width:"24%"
  },
  {
    name: 'Status',
    label: true,
    cell: row => (row.status==1)?<AppSwitch onClick={clickHandler} id={row._id} value='status_active' className={'mx-1'} variant={'3d'} color={'primary'} checked  />:<AppSwitch id={row._id} value='status_inactive' onClick={clickHandler} className={'mx-1'} variant={'3d'} color={'primary'}/>,
    width:"7%"
  },
  {
    name: 'CreatedAt',
    selector: 'created_at',
    sortable: true,
    width:"9%",
    cell: row => <Moment format="YYYY/MM/DD">{row.created_at}</Moment>,
  },
  { 
    cell: (row) => <div><Button color="primary" onClick={clickHandler} id={row._id} value='edit'>Edit</Button> &nbsp;&nbsp;|&nbsp;&nbsp; <Button color="danger" onClick={clickHandler} id={row._id} value='delete'>Delete</Button></div>,
    ignoreRowClick: true,
    allowOverflow: true,
    button: true,
    name:'Action',
    width:"10%"
  },
]);

class Listpeople extends Component {

  constructor(props) {
    super(props);

    this.state = {
      data: [],
      loading: false,
      totalRows: 0,
      perPage: 10,
      selectedRows: [],
      page_rows: [2,5,10,15,20,25,30,35,40,45],
      custom_paginationPerPage : 2,
      search_name:'',
      search_people_type:'',
      search_job_other:'',
      reset_pagination:false,
      bulk_flag:false,
      bulk_type:0,
      bulk_typeError:'',
    };
 
  this.componentDidMount = this.componentDidMount.bind(this);
  this.handlePageChange = this.handlePageChange.bind(this);
  this.handlePerRowsChange = this.handlePerRowsChange.bind(this);
  this.serverside_pagination_logic = this.serverside_pagination_logic.bind(this);
  this.reset_search_filter = this.reset_search_filter.bind(this);


  // search related function
  this.onChange_watch = this.onChange_watch.bind(this);
  this.submitForm = this.submitForm.bind(this);
  this.keyPress = this.keyPress.bind(this);
  this.handleChange = this.handleChange.bind(this);
  this.bulk_submitForm = this.bulk_submitForm.bind(this);
  

  }


 handleChange = async state_data => {

  if(state_data.selectedCount > 0)
  {
    await this.setState({ bulk_flag: true });  
  }
  else{
    await this.setState({ bulk_flag: false });  
  }
 
  await this.setState({ selectedRows: state_data.selectedRows });

}

async bulk_submitForm()
{

    const perPage  = this.state.perPage;      
    var new_obj = {};
    if(this.state.bulk_type!=0)
    {
      new_obj.bulk_type = this.state.bulk_type;
      new_obj.selectedRows = this.state.selectedRows;
      new_obj.perPage = perPage;
      new_obj.page = 0;
      new_obj.schema = 'People';
      await this.setState({reset_pagination:true});
      this.serverside_pagination_logic(new_obj,'bulk_action_update');
    }
    else{
      await this.setState({bulk_typeError:'Please Select Action'});
    }
    
     
}


handleButtonClick = (state) => 
{
  if(state.target.value==='edit')
  {
    this.props.history.push('/admin/edit_people/'+state.target.id);
  }
  else if(state.target.value==='delete')
  {
    this.props.handleDelete_hoc({'p_id':state.target.id},'delete_people','people').then(data => {
        if(data.status==200)
        {
          toast.success(data.msg,{ autoClose: 1000 });
          this.componentDidMount()
        }
    });

  }
  else if(state.target.value==='status_active')
  {
    this.handleStatusUpdate(state.target.id,'0');
  }
  else if(state.target.value==='status_inactive')
  {
    this.handleStatusUpdate(state.target.id,'1');
  }
};


handleStatusUpdate(status_id,update_value)
{
    this.props.handleStatusUpdate_hoc({'people_id':status_id,'value':update_value},'update_status_people','People').then(data => {
        var new_obj = {};
        new_obj.page = this.state.page_no;
        new_obj.perPage = this.state.perPage;

        if(data.status==200)
        {        
          toast.success(data.msg,{ autoClose: 1000 });
          this.serverside_pagination_logic(new_obj);
        }
        else{
          this.serverside_pagination_logic(new_obj);
        }
  });

}

add_job_url= ()=>{
    this.props.history.push('/admin/add_people');
}


async serverside_pagination_logic(new_obj,api_name='')
{
    var new_headers = token_header();    
    new_obj.search_name = this.state.search_name;
    new_obj.search_people_type = this.state.search_people_type;
    new_obj.search_job_other = this.state.search_job_other;
    
    new_obj.login_user_id = localStorage.getItem("login_user_id");
    this.setState({ loading: true });

    this.props.serverside_pagination_api(new_obj,(api_name=='')?'list_people_pagination':api_name).then(response => {
      if(response.status==200)
      {
          this.setState({
              data: response.data.data.rows,
              totalRows: response.data.data.count,
              loading: false,
              reset_pagination:false,
              bulk_flag:false,
              bulk_type:0,
              bulk_typeError:'',
          });

          if(api_name!='')
          {
              toast.success(response.data.message,{ autoClose: 1000 });
              this.componentDidMount();
          }
      }
  });
    
}

componentDidMount() 
{  
    const perPage  = this.state.perPage;      
    var new_obj = {};
    new_obj.perPage = perPage;
    this.serverside_pagination_logic(new_obj);
}

handlePageChange = async page => 
{ 
    const perPage  = this.state.perPage;      
    var new_obj = {};
    new_obj.page = parseInt(page-1);
    new_obj.perPage = perPage;

    this.setState({page_no: new_obj.page});
    this.serverside_pagination_logic(new_obj);
}

handlePerRowsChange = async (perPage, page) => {

      this.setState({ loading: true,perPage:perPage});
      var new_obj = {};
      new_obj.page = parseInt(page-1);
      new_obj.perPage = perPage;

      this.setState({page_no: new_obj.page});
      this.serverside_pagination_logic(new_obj);
}

onChange_watch(e){

    this.setState({
       [e.target.name] : e.target.value
    });
} 

async submitForm()
  {
     const perPage  = this.state.perPage;      
     var new_obj = {};
     new_obj.perPage = perPage;
     new_obj.page = 0;
     await this.setState({reset_pagination:true});
     this.serverside_pagination_logic(new_obj);

  } 

  keyPress(e){
    if(e.keyCode == 13){
      e.preventDefault();
       this.submitForm();
    }
  }

  async reset_search_filter()
  { 
    await this.setState({search_name:'',search_people_type:'',search_job_other:'',reset_pagination:true});
    var new_obj = {};
    new_obj.perPage = 10;
    new_obj.page = parseInt(0);
    await this.serverside_pagination_logic(new_obj);
  }

  render() {

    const { 
              loading,
              data,
              totalRows,
              page_rows,
              custom_paginationPerPage,
              reset_pagination,
              bulk_flag,
              bulk_typeError
           } = this.state;

    return (
         <div>

      <div className="animated fadeIn">
          <Row>
            <Col xs="12" md="12">
              <Card>
                  <CardHeader>
                    <strong>Search</strong> <span className="float-right"><Button block color="primary" onClick={this.add_job_url} className="btn-pill">Add People</Button></span>
                  </CardHeader>
                <CardBody>
                    <Form className="form-horizontal">
                        <FormGroup row>
                              <Col md="1">
                                  <Label htmlFor="search_name">Name</Label>
                              </Col>
                              <Col xs="6" md="3">
                                  <Input type="text" onKeyDown={this.keyPress} id="search_name" name="search_name" placeholder="Name" value={this.state.search_name} onChange={this.onChange_watch}/>
                              </Col>
                              <Col md="1">
                                  <Label htmlFor="search_people_type">People Type</Label>
                              </Col>
                              
                              {/* <Col xs="6" md="3">
                                  <Input type="text" id="search_people_type" name="search_people_type" placeholder="Name" value={this.state.search_people_type} onChange={this.onChange_watch}/>
                              </Col> */}

                              <Col xs="6" md="3">
                                  <Input type="select" name="search_people_type" id="search_people_type" value={this.state.search_people_type} onChange={this.onChange_watch}>
                                  <option value="0">Please select</option>
                                  <option value="2">Advisor</option>
                                  <option value="3">CEO</option>                        
                                  <option value="1">Team member</option>
                                  </Input>
                             </Col>

                              <Col md="1">
                                  <Label htmlFor="search_job_other">Job Title Otheres</Label>
                              </Col>
                              <Col xs="6" md="3">
                                  <Input type="text" onKeyDown={this.keyPress} id="search_job_other" name="search_job_other" placeholder="Job Title Otheres" value={this.state.search_job_other} onChange={this.onChange_watch}/>
                              </Col>

                        </FormGroup>                    
                        <div>
                            <Button color="primary" onClick={this.submitForm} className="mr-2 px-4">Search</Button>
                            <Button onClick={this.reset_search_filter} color="danger">Reset</Button>
                        </div>
                    
                    </Form>
                </CardBody>
              </Card>
            </Col>
          </Row>
      </div>

            <Card style={{ height: '100%' }}>
              { 
                bulk_flag && 
                    <Row>
                        <Col xs="12" md="12">
                          <Card>
                              <CardHeader>
                                <strong>Bulk Action</strong>
                              </CardHeader>
                              <CardBody>
                                    <Form className="form-horizontal">
                                          <FormGroup row>
                                                <Col xs="1" md="2">
                                                    <Input type="select" name="bulk_type" id="bulk_type" value={this.state.bulk_type} onChange={this.onChange_watch}>
                                                    <option value="0">Select</option>
                                                    <option value="1">Status Active</option>
                                                    <option value="2">Status Inactive</option>                        
                                                    <option value="3">Delete Record</option>
                                                    </Input>
                                                    <span className="validation-error">{bulk_typeError}</span>
                                              </Col>
                                            <div> 
                                              <Button color="primary" onClick={this.bulk_submitForm} className="mr-2 px-4 btn-success">Submit</Button>
                                            </div>
                                          </FormGroup>                    
                                    </Form>
                              </CardBody>
                          </Card>
                        </Col>
                  </Row>
                 
              }
              <DataTable
              title="People List"
              columns={columns(this.handleButtonClick)}
              data={data}
              onSelectedRowsChange={this.handleChange}
              selectableRows                
              progressPending={loading}
              pagination              
              paginationServer
              paginationTotalRows={totalRows}
              paginationResetDefaultPage={reset_pagination}
              onChangeRowsPerPage={this.handlePerRowsChange}
              onChangePage={this.handlePageChange}
              progressComponent={this.props.CustomLoader}
              paginationRowsPerPageOptions = {page_rows}  
            />   
            </Card>          
        </div>  
    );
  }
}

export default HOCdatatable(Listpeople);