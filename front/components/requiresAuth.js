import React, { PropTypes } from 'react';  
import localStorage from "localStorage";

export function requiresAuth(Component) {
    return class AuthenticatedComponent extends React.Component {
        constructor(props){
            super(props)
        }

        async componentDidMount()
        {
            if(localStorage.getItem("token")==null)
            {
                window.location.href = '/login';
                await this.setState({
                    visiable_flag : false,
                 });
                return false
            }
            else{
                
                await this.setState({
                    visiable_flag : true,
                 });
            }
        }

        render() {

            var isAuthenticated = '';

            if(localStorage.getItem("token")!==null)
            {
                isAuthenticated = true;
            }
            else{
                isAuthenticated = false;
            }

            return (
                <div>
                    { isAuthenticated === true ? <Component {...this.props} /> : ''}
                </div>
            );
        }
    };
}

export default requiresAuth;
