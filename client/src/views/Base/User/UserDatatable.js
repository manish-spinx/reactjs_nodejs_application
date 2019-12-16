
import '../Datatablecss/datatable.css';
import React, { Component } from 'react';
import ReactDOM from 'react-dom';


// import { Badge, Card, CardBody, CardHeader, Col, Pagination, PaginationItem, 
//   PaginationLink, Row, Table } from 'reactstrap';

const $ = require('jquery');
$.DataTable = require('datatables.net');

export default class UserDatatable extends Component {

  constructor(props) 
  {
    super(props);
    //this.manish_two = this.manish_two.bind(this);
    this.minusclick = this.minusclick.bind(this);
    
    
  }

  minusclick = (e)=>{
    alert('sdffdd');
    console.log('The link was clicked.111111111111111111');
  }
  

  // manish_two = function()
  // {
  //   alert('hiiiiii');
  //   console.log('aaaaaaaaaaaaaaaaaaaaaaaaaa');
  // }
  
  componentDidMount()
  {
    
      this.$el = $(this.el);

       this.$el.DataTable({
            data:this.props.data,
            columns:[
              {title:"Id",visible:false},
              {title:"Name"},
              {title:"Mobile"},
              {title:"Email"},
              {title:"Status"},
              {title:"Created"},
              {title:"Updated"},
              //{title:"Updated"},
              {title:"Action",
              "render": function(data, type, row, meta)
                {
                  
                    //data = `<input type="button" value="X" className="del-btn" onclick=${(e) => this.minusclick(e)} />`;
                    data = '<a href="#/admin/edit_user/' + row[0] + '">' + 'Edit' + '</a>';
                    //data = '<input type="button" key="11" value="X" className="del-btn" onClick={this.minusClick_one()} />';
                    //data = '<a href="javascript:void(0)" onClick={this.minusClick_one()}>' +  'Edit' + '</a>';
                    data += ' | ';
                    data += '<a href="javascript:void(0)">' + 'Delete' + '</a>';
                    //data += '<a href="' + row[0] + '">' + 'Delete' + '</a>';
                    return data;
                }
               },
            ] 
       });
  }



  componentWillMount()
  {
     //console.log('when calling this function ..................');
       //this.$el.DataTable.destory(true);

      // $('#user_table_listing').destroy();
      // $('#user_table_listing').DataTable().clear();
      //$('#user_table_listing').DataTable().clear().destroy();
      //$('#user_table_listing').DataTable().clear();
      
       
  }


  render() {
    return (
       <div>
           <table className="display" width="100%" clickHandler={this.handleTableClick} ref = {el=>this.el=el}>               
           </table>
       </div>  
    );
  }
}

