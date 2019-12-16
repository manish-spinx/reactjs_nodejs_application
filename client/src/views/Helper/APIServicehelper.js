import axios from 'axios'; 
import { ToastContainer, toast } from 'react-toastify';
import {simple_header,token_header,image_token_header} from './Loginhelper';
const ADMIN_API_URL = process.env.REACT_APP_ADMIN_API_URL;


export function api_service(api_slug,post_obj,header_flag='1') 
{
      return new Promise((resolve, reject) => 
        {
            axios.post(ADMIN_API_URL+api_slug,post_obj,{
                  headers : (header_flag=='1')? token_header() : (header_flag=='2')?image_token_header():simple_header()
                }) 
                .then((response) => 
                {
                     if(response.status==200)
                     {
                        return resolve(response);
                     }
                     else if(response.status==202)
                     {
                        return resolve({status:202,err_msg:response.data.message});  
                     }
                                         
                })
                .catch((error) => 
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