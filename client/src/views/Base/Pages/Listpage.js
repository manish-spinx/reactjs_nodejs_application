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
import HOCdatatable from '../../HOC/HOCdatatable';


const columns = memoize(clickHandler => [  
  {
    name: 'Title',
    selector: 'title',
    sortable: true,
    width:"30%"
  },
  {
    name: 'Status',
    label: true,
    cell: row => (row.status==1)?<AppSwitch onClick={clickHandler} id={row._id} value='status_active' className={'mx-1'} variant={'3d'} color={'primary'} checked  />:<AppSwitch id={row._id} value='status_inactive' onClick={clickHandler} className={'mx-1'} variant={'3d'} color={'primary'}/>,
    width:"20%"
  },
  {
    name: 'CreatedAt',
    selector: 'created_at',
    sortable: true,
    width:"20%",
    cell: row => <Moment format="YYYY/MM/DD">{row.created_at}</Moment>,
  },
  { 
    cell: (row) => <div><Button color="primary" onClick={clickHandler} id={row._id} value='edit'>Edit</Button></div>,
    ignoreRowClick: true,
    allowOverflow: true,
    button: true,
    name:'Action',
    width:"20%"
  },
]);


class Listpage extends Component {

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
      reset_pagination:false,
      bulk_flag:false,
      bulk_type:0,
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
      new_obj.schema = 'Page';
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
    this.props.history.push('/admin/edit_page/'+state.target.id);
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
    this.props.handleStatusUpdate_hoc({'p_id':status_id,'value':update_value},'update_status_page','Page').then(data => {

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



async serverside_pagination_logic(new_obj,api_name='')
{
    new_obj.search_name = this.state.search_name;
    new_obj.login_user_id = localStorage.getItem("login_user_id");
    this.setState({ loading: true });

    this.props.serverside_pagination_api(new_obj,(api_name=='')?'list_page_pagination':api_name).then(response => {
             if(response.status==200)
             {
                 this.setState({
                     data: response.data.data.rows,
                     totalRows: response.data.data.count,
                     loading: false,
                     reset_pagination:false,
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
  await this.setState({search_name:'',reset_pagination:true});
  var new_obj = {};
  new_obj.perPage = 10;
  new_obj.page = parseInt(0);
  await this.serverside_pagination_logic(new_obj);
}

  render() {

    const { loading, data, totalRows,page_rows,custom_paginationPerPage,reset_pagination,bulk_flag,bulk_typeError } = this.state;

    return (
         <div>

      <div className="animated fadeIn">
          <Row>
            <Col xs="12" md="12">
              <Card>
                  <CardHeader>
                    <strong>Search</strong>
                  </CardHeader>
                <CardBody>
                    <Form className="form-horizontal">
                        <FormGroup row>
                              <Col md="1">
                                  <Label htmlFor="search_name">Title</Label>
                              </Col>
                              <Col xs="6" md="3">
                                  <Input type="text" onKeyDown={this.keyPress} id="search_name" name="search_name" placeholder="Title" value={this.state.search_name} onChange={this.onChange_watch}/>
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
              title="Page List"
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
              //progressComponent={<CustomLoader />}  
              progressComponent={this.props.CustomLoader}  
              paginationRowsPerPageOptions = {page_rows}  
            />   
            </Card>          
        </div>  
    );
  }
}

export default HOCdatatable(Listpage);