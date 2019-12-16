import React, { Component } from 'react';
import { Badge, Card, CardBody, CardHeader, Col, Pagination, PaginationItem, PaginationLink, Row, Table } from 'reactstrap';
import UserDatatable from './UserDatatable';
import { Link,Redirect } from 'react-router-dom';
import axios from 'axios';  
import ReactDOM from 'react-dom';

const $ = require('jquery');
$.DataTable = require('datatables.net');

const headers = {
  Accept: 'application/json',
  'Content-Type': 'application/json',
  'token':localStorage.getItem("token")
}

const ADMIN_API_URL = '/admin_api/';

const DeleteAccount = () => (<div name='h22'><input type="button" name='Save' value="Save" onClick=''/></div>);

export default class Listuser extends Component {

  constructor(props) {
    super(props);
    
    const token = localStorage.getItem("token");
    if(token == null)
      {
          this.props.history.push('/login');
      }
      
      this.state = 
      {
        dataset : [], 
      }

      //this.props = {dataset: [] };

     this.componentDidMount = this.componentDidMount.bind(this);     
     this.componentWillMount = this.componentWillMount.bind(this);
     /*this.componentWillUpdate = this.componentWillUpdate.bind(this);*/

    this.custom_function = this.custom_function.bind(this);
    this.minusclick = this.minusclick.bind(this);

  }

 
  


// minusclick = (data) =>{
//   alert('sdffdd');
//   console.log('aaaaaaaaaaa11aaaaaaaaaaaaa');
//   return 'true';
  
// }


minusclick(){
  alert('sdffdd');
  console.log('aaaaaaaaaaa11aaaaaaaaaaaaa');
}

// minusclick = (e)=>{
//   alert('sdffdd');
//   console.log('The link was clicked.111111111111111111');
// }


shouldComponentUpdate(props, state)
{
   console.log('--------should---------------------------------');
   return true;
}

custom_function = () =>{
    console.log('custom function timeout calling...');

    // var dataset = [
    //   [
    //     "Tiger Nixon1 manish ok",
    //     "System Architect1",
    //     "Edinburgh",
    //     "5421",
    //     "2011/04/25",
    //     "$320,800",
    //     "aa",
    //     `<div><button onClick=${(e) => this.minusclick(e)}>Click me</button></div>`
    //   ],
    //   [
    //     "Tiger Nixon1 sharma",
    //     "System Architect2",
    //     "Edinburgh",
    //     "5421",
    //     "2011/04/25",
    //     "$320,800",
    //     "aa",
    //     `<div><button onClick=${(e) => this.minusclick(e)}>Click me</button></div>`
    //   ],
    // ];


    // this.setState({
    //   dataset: dataset
    // });


    


  axios.post(ADMIN_API_URL+"list_users",{},
        {
          headers :  headers
        }) 
        .then((response) => 
        {
            var data_rows =  response.data.data.rows; 
            var i;
            var check1 = [];

            //for(i = 0; i < data_rows.length-2; i++) 
            //{
              //data_rows[i][7] = `<input type="button"  name="edit" value="edit" onClick=${() => this.minusclick(this)} />`;  

              //data_rows[i][7] = `<div><input type="button"  name="edit" value="edit" onClick = ${() => this.minusclick(data_rows[i][0])} /></div>`;              

              //data_rows[i][7] = `<button onClick=${(e) => this.minusclick(e)}>Click me</button>`;
              //check1.push(data_rows[i]);
            //}


            data_rows.map((item, key) =>{

               if(data_rows[key][4]=='1')
               {
                data_rows[key][4] = 'Active';
               }
               else{
                data_rows[key][4] = 'Inactive';
               }
                 
              //data_rows[key][7] = `<div><button onClick=${(e) => this.minusclick(e)}>Click me</button></div>`;
              data_rows[key][7] = '';
            });
            
             console.log('check html source code');
             console.log(check1);

             this.setState({
                  dataset: data_rows
                });
                
                
            ReactDOM.render(<UserDatatable data = {this.state.dataset} />,document.getElementById('user_table_listing'));

              // setTimeout(() => {
              //   ReactDOM.render(
              //     <UserDatatable data = {this.state.dataset}  />,document.getElementById('user_table_listing'));      
              // }, 100);

        });
}


custom_function_two= () =>{

  setTimeout(() => {

    axios.post(ADMIN_API_URL+"list_users",{},
        {
          headers :  headers
        }) 
        .then((response) => 
        {
            var data_rows =  response.data.data.rows; 
            var i;
            var check1 = [];

            data_rows.map((item, key) =>{
              data_rows[key][7] = `<button onClick=${(e) => this.minusclick(e)}>Click me</button>`;
            });
            
            this.setState({
                  dataset: data_rows
                });
        });

  }, 800);
  
  

}


componentDidMount = ()=>{

  console.log('....componentDidMount calling......List....user..');     
  //this.custom_function();

}

componentWillMount = () =>{
     console.log('componentWillMount calling.........List.......user.......'); 
     this.custom_function();
     
   
  }




  render() {

      console.log('-----render----------user------calling----------');
      console.log(this.state.dataset);


    return (

      <div className="animated fadeIn">
        <Row>
          <Col xs="12" lg="12">
            <Card>
              <CardHeader>
                <i className="fa fa-align-justify"></i> List User
              </CardHeader>
               <br/>
              <div id="user_table_listing"> 
                    <UserDatatable data = {this.state.dataset} /> 
                
               </div>  
            </Card>
          </Col>
        </Row>
        </div>


    );
  }
}

