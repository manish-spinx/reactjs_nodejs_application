import React,{Component} from 'react';
import axios from 'axios';  
import ReactDOM from 'react-dom';
import Swal from 'sweetalert2';
import {token_header} from '../Helper/Loginhelper';
import styled, { keyframes } from 'styled-components';
import {api_service} from '../Helper/APIServicehelper';
import { ToastContainer, toast } from 'react-toastify';

const ADMIN_API_URL = process.env.REACT_APP_ADMIN_API_URL;//'/admin_api/';


const rotate360 = keyframes`
    from {
      transform: rotate(0deg);
    }
  
    to {
      transform: rotate(360deg);
    }
  `;

const Spinner = styled.div`
  margin: 16px;
  animation: ${rotate360} 1s linear infinite;
  transform: translateZ(0);
  border-top: 2px solid grey;
  border-right: 2px solid grey;
  border-bottom: 2px solid grey;
  border-left: 4px solid black;
  background: transparent;
  width: 80px;
  height: 80px;
  border-radius: 50%;
`; 

const HOCdatatable = (OriginalComponent)=>{  
// const CustomLoader = () => (
//     <div>
//       <Spinner />
//       <div>Loading...</div>
//     </div>
//   );

class HOCdatatable extends React.Component
{
    
    constructor(props)
    {
        super(props)
            
        this.state = {
            count:0,
        }
    }

    handleDelete_hoc(obj,api_url,label)
    {
        return new Promise((resolve, reject) => 
        {
            Swal.fire({
                title: 'Are you sure?',
                text: 'You want to delete '+label,
                type: 'warning',
                showCancelButton: true, allowOutsideClick: false, allowEscapeKey: false,
                confirmButtonText: 'Yes',
                cancelButtonText: 'Cancel'
                }).then((result) => 
                {
                    if (result.value) 
                    {
                        axios.post(ADMIN_API_URL+api_url,obj,
                        {
                            headers : token_header()
                        }) 
                        .then((response) => 
                        {
                            if(response.data.status==200)
                            {
                                return resolve({status:200,msg:response.data.message});
                            }
                            else{
                                return resolve({status:response.data.status});
                            }

                        }).catch(reason => reject({status:500,msg:reason})); 
                    }
                    else{
                        return resolve({status:304});
                    }
                });
        });
    }

    handleStatusUpdate_hoc(obj,api_url,label)
    {
        return new Promise((resolve, reject) => 
        {
            Swal.fire({
                title: 'Are you sure?',
                text: (obj.value=='1')?'You want to Active this '+label+' ?':'You want to Inactive this '+label+' ?',
                type: 'warning',
                showCancelButton: true, allowOutsideClick: false, allowEscapeKey: false,
                confirmButtonText: 'Yes',
                cancelButtonText: 'Cancel'
                }).then((result) => 
                {
                    if (result.value) 
                    {
                        axios.post(ADMIN_API_URL+api_url,obj,
                        {
                            headers : token_header()
                        }) 
                        .then((response) => 
                        {

                            if(response.data.status==200)
                            {
                                return resolve({status:200,msg:response.data.message});
                            }
                            else{
                                return resolve({status:response.data.status});
                            }

                        }).catch(reason => reject({status:500,msg:reason})); 
                    }
                    else{
                        return resolve({status:304});
                    }
                });
        });  

    }
    
    serverside_pagination_api(obj,api_url)
    {
        return new Promise((resolve, reject) => 
        {
            const response = axios.post(ADMIN_API_URL+api_url,obj,
                {
                  headers :  token_header()
                }) 
                .then((res,reject) => 
                {
                      return resolve(res);
        
                }).catch((error) => 
                {
                   if(error.response.status==500)
                   {
                        toast.error('Internal Server Error',{ autoClose: 1500 });
                   }
                   else if(error.response.status==401)
                   {
                       toast.error('Unauthorized:Access to this resource is denied.',{ autoClose: 2000 });
                       window.location.href = "#/login";
                   }
                })

        });
    }
        // incrementCount = ()=>{
        //  this.setState(prevState=>{
        //       return {count:prevState.count+1}
        //  })
        // }

        render()
        {
            return <OriginalComponent 
                count={this.state.count} 
                handleDelete_hoc = {this.handleDelete_hoc} 
                handleStatusUpdate_hoc = {this.handleStatusUpdate_hoc} 
                serverside_pagination_api = {this.serverside_pagination_api}
                CustomLoader = {<div><Spinner /><div>Loading...</div></div>}
                //incrementCount = {this.incrementCount} 
                {...this.props}
            />
        }
}

     return HOCdatatable; 
}

export default HOCdatatable;