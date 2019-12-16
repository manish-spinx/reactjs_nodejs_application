
export function FETCH_NODE_API_URL() 
{
      return process.env.FETCH_API_URL;
}

export function BACKEND_FETCH_NODE_API_URL() 
{
      return process.env.BACKEND_FETCH_API_URL;
}

export function FRONT_RESET_PASSWORD_URL() 
{
      return 'http://localhost:3010/Resetpassword/';//process.env.FRONT_RESET_PASSWORD_LINK;
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

