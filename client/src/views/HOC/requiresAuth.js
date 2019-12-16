import React, { PropTypes } from 'react';  

export function requiresAuth(Component) {
    return class AuthenticatedComponent extends React.Component {
        /**
         * Render
         */

        constructor(props){
            super(props)
             
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
                    { isAuthenticated === true ? <Component {...this.props} /> : window.location.href = "#/login" }
                </div>
            );
        }
    };
}

export default requiresAuth;
