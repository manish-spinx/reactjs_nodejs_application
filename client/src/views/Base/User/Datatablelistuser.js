import React, { Component } from 'react';
import { Badge, Card, CardBody, CardHeader, Col, Pagination, PaginationItem, PaginationLink, Row, Table } from 'reactstrap';
import UserDatatable from './UserDatatable';
import { Link,Redirect } from 'react-router-dom';
import faker from 'faker';
import ReactDOM from 'react-dom';
import axios from 'axios';  
import Swal from 'sweetalert2';
import { ToastContainer, toast } from 'react-toastify';
import SmartDataTable from '../../lib/SmartDataTable';

import {checkLogin,token_header} from '../../Helper/Loginhelper';

//const ADMIN_API_URL = 'http://localhost:3005/admin_api/';
const ADMIN_API_URL = process.env.REACT_APP_ADMIN_API_URL;
const headers = token_header();

const sematicUI = {
    segment: 'ui basic segment',
    message: 'ui message',
    input: 'ui icon input',
    searchIcon: 'search icon',
    rowsIcon: 'numbered list icon',
    table: 'ui compact selectable table',
    select: 'ui dropdown',
    refresh: 'ui labeled primary icon button',
    refreshIcon: 'sync alternate icon',
    change: 'ui labeled secondary icon button',
    changeIcon: 'exchange icon',
    checkbox: 'ui toggle checkbox',
    loader: 'ui active text loader',
    deleteIcon: 'trash red icon',
    EditIcon: 'edit blue icon',
  }

  const apiDataUrls = [
    'https://jsonplaceholder.typicode.com/users',
    'https://jsonplaceholder.typicode.com/todos',
    'https://jsonplaceholder.typicode.com/albums',
    'https://jsonplaceholder.typicode.com/photos',
  ]

  const generateData_new = (numResults = 0) => 
  {

    let total = numResults || 0
    if (typeof numResults === 'string') {
      total = parseInt(numResults, 10)
    }
    const data = []
    for (let i = 0; i < total; i += 1) {
      data.push({
        _id: i,
        avatar: faker.image.avatar(),
        fullName: faker.name.findName(),
        //_username: faker.internet.userName(),
        //password_: faker.internet.password(),
        //'email.address': faker.internet.email(),
        //phone_number: faker.phone.phoneNumber(),
        //address: {
          //city: faker.address.city(),
          //state: faker.address.state(),
          //country: faker.address.country(),
        //  },
        //url: faker.internet.url(),
        //isMarried: faker.random.boolean(),
        actions: null,
      })
    }
    return data
  }

  const generateData = (numResults = 0) => 
  { 
    return new Promise((resolve, reject) => 
    {

      let total = numResults || 0
      if (typeof numResults === 'string') 
      {
        total = parseInt(numResults, 10)
      }

      var new_headers = token_header();

      axios.post(ADMIN_API_URL+"list_users",{'login_user_id':localStorage.getItem("login_user_id")},
        {
          headers :  new_headers
        }) 
        .then((response,reject) => 
        {
          const data_new = [];
           if(response.status==200)
           {
              var data_rows =  response.data.data.rows; 
              for (var i = 0; i < data_rows.length; i += 1) 
              {
                data_new.push({
                    _id: data_rows[i]._id,
                    avatar: (data_rows[i].profile_image!='')?data_rows[i].profile_image:'-',
                    name: data_rows[i].name,
                    mobile: data_rows[i].mobile,
                    email: data_rows[i].email,
                    status:(data_rows[i].status=='1')?'Active':'Inactive',
                    updated_at : data_rows[i].updated_at,
                    actions: null,
                  })
              }
           }
          return resolve(data_new);
        }).catch(reason => reject(reason));       
    });

  }

export default class Datatablelistuser extends Component {

  constructor(props) {
    super(props);

    checkLogin();

    this.state = {
        useApi: false,
        apiData: '',
        apiIdx: -1,
        numResults: 10,
        data: [],
        filterValue: '',
        perPage: 10,
        showOnRowClick: true,
      }

      this.setNewData = this.setNewData.bind(this)
      this.setApiData = this.setApiData.bind(this)
      this.changeData = this.changeData.bind(this)
      this.handleOnChange = this.handleOnChange.bind(this)
      this.handleOnPerPage = this.handleOnPerPage.bind(this)
      this.handleCheckboxChange = this.handleCheckboxChange.bind(this)
      this.onRowClick = this.onRowClick.bind(this)
      this.handleEdit = this.handleEdit.bind(this)

      
  }

componentDidMount() {

    const { numResults } = this.state
    this.setNewData(numResults)
    this.setApiData()
}

setNewData() {
    const { numResults } = this.state
    const records = generateData(numResults);

    records.then((res,err)=>{

        if(err)
        {
          console.log('issue at server side..');
        }
        else{
          this.setState({
            data: res,
            })
        }
    });
}

setApiData() {
    let { apiIdx } = this.state
    const N = apiDataUrls.length
    apiIdx += 1
    if (apiIdx === N) apiIdx -= N
    const apiData = apiDataUrls[apiIdx]
    this.setState({ apiData, apiIdx })
}

handleDelete(event, idx, row) {
    /*event.preventDefault()
    event.stopPropagation()
    const { data } = this.state
    const { _id, id } = row
    let orgInd
    if (_id) orgInd = data.findIndex(({ _id: thisId }) => thisId === _id)
    if (id) orgInd = data.findIndex(({ id: thisId }) => thisId === id)
    data.splice(orgInd, 1)
    this.setState({ data })*/

    Swal.fire({
      title: 'Are you sure?',
      text: 'You want to delete User',
      type: 'warning',
      showCancelButton: true, allowOutsideClick: false, allowEscapeKey: false,
      confirmButtonText: 'Yes',
      cancelButtonText: 'Cancel'
    }).then((result) => 
    {
      if (result.value) 
      {
          axios.post(ADMIN_API_URL+"delete_user",{'user_id':row._id},
          {
            headers : token_header()
          }) 
          .then((response) => 
          {
               if(response.data.status==200)
               {
                  toast.success(response.data.message,{ autoClose: 1000 });
                  this.setNewData()
               }
          });
      }
    });

}

handleEdit(event, idx, row)
{
  event.preventDefault()
  event.stopPropagation()
  this.props.history.push('/admin/edit_user/'+row._id);
}

getHeaders() {
    return {
      id: {
        text: 'Identifier',
        invisible: true,
        filterable: false,
        transform: value => `Row #${value}`,
      },
      _id: {
        text: 'ID',
        invisible: true,
        filterable: false,
        transform: value => `${value}`,
      },
      avatar: {
        text: 'Profile Pic',
        sortable: false,
        filterable: false,
      },
      actions: {
        text: 'Actions',
        sortable: false,
        filterable: false,
        transform: (value, idx, row) => (
           <div>
              <i
                className={sematicUI.EditIcon}
                style={{ cursor: 'pointer' }}
                onClick={e => this.handleEdit(e, idx, row)}
                onKeyDown={e => this.handleEdit(e, idx, row)}
                role='anchor'
                tabIndex='0'
              /> | <i
                className={sematicUI.deleteIcon}
                style={{ cursor: 'pointer' }}
                onClick={e => this.handleDelete(e, idx, row)}
                onKeyDown={e => this.handleDelete(e, idx, row)}
                role='button'
                tabIndex='0'
              />
          </div>
        ),
      },
      thumbnailUrl: {
        text: 'Thumbnail',
        sortable: false,
        filterable: false,
        isImg: true,
      },
    }
}

handleOnChange({ target: { name, value } }) {
    this.setState({ [name]: value }, () => {
    if (name === 'numResults') this.setNewData()
    })
}

handleOnPerPage({ target: { name, value } }) {
    this.setState({ [name]: parseInt(value, 10) })
}

changeData() {
    const { useApi } = this.state
    this.setState({
    useApi: !useApi,
    filterValue: '',
    perPage: 0,
    })
}

handleCheckboxChange() {
    const { showOnRowClick } = this.state
    this.setState({ showOnRowClick: !showOnRowClick })
}

onRowClick(event, { rowData, rowIndex, tableData }) 
{
    // const { showOnRowClick } = this.state
    // if (showOnRowClick) {
    // const { fullName, name, id } = rowData
    // let value = fullName || name || id
    // if (!value) {
    // const [key] = Object.keys(rowData)
    // value = `${key}: ${rowData[key]}`
    // }
    // window.alert(`You clicked ${value}'s row !`)
    // } else {
    // console.log(rowData, tableData[rowIndex])
    // }
}

render() 
    {

        const {
            useApi, apiData, data, filterValue, perPage, numResults, showOnRowClick,
          } = this.state
          const divider = <span style={{ display: 'inline-block', margin: '10px' }} />
          const headers = this.getHeaders()
    
        return (
           
            <div>
              <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.3.3/semantic.min.css"></link>
                <div className={sematicUI.segment}>
                <div className={sematicUI.input}>
                    <input
                    type='text'
                    name='filterValue'
                    value={filterValue}
                    placeholder='Filter results...'
                    onChange={this.handleOnChange}
                    />
                    <i className={sematicUI.searchIcon} />
                </div>
                {divider}
                <select
                    name='perPage'
                    value={perPage}
                    className={sematicUI.select}
                    onChange={this.handleOnPerPage}
                >
                    <option value='0'>
                    Per Page
                    </option>
                    <option value='10'>
                    10
                    </option>
                    <option value='25'>
                    25
                    </option>
                    <option value='50'>
                    50
                    </option>
                    <option value='100'>
                    100
                    </option>
                    <option value='100'>
                    500
                    </option>
                </select>
                {divider}
                </div>               
                <SmartDataTable
                data={useApi ? apiData : data}
                dataKey=''
                headers={headers}
                name='test-table'
                className={sematicUI.table}
                filterValue={filterValue}
                perPage={perPage}
                sortable
                
                withLinks
                withHeader
                loader={(
                    <div className={sematicUI.loader}>
                    Loading...
                    </div>
                )}
                onRowClick={this.onRowClick}
                parseBool={{
                    yesWord: 'Indeed',
                    noWord: 'Nope',
                }}
                parseImg={{
                    style: {
                    border: '1px solid #ddd',
                    borderRadius: '2px',
                    padding: '3px',
                    width: '60px',
                    },
                }}
                dynamic
                emptyTable={(
                    <div className={sematicUI.message}>
                    There is no data available to display.
                    </div>
                )}
                />
          </div>
            
        );
    }
    

   
}


