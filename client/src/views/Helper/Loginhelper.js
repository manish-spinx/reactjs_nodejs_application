export function checkLogin(req,res) 
{
      if(localStorage.getItem("token")!==null)
      {
           return true;
      }
      else{
         // window.location = "#/login"; 
          window.location.href = "#/login";
      }
}

export function simple_header() 
{
      // consider as 0 flag
      return {Accept: 'application/json','Content-Type': 'application/json'}
}

export function token_header() 
{
      // consider as 1 flag
      return {Accept: 'application/json','Content-Type': 'application/json','token':localStorage.getItem("token")}
}

export function image_token_header() 
{
      // consider as 2 flag
      return {Accept: 'application/json','Content-Type': 'image/*','token':localStorage.getItem("token")}
}

