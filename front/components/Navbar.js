import React, { Component } from 'react';
import axios from 'axios'; 
import moment from "moment";
import Link from 'next/link';
import localStorage from "localStorage";
import withWindowDimensions from './withWindowDimensions';
import { Router } from '../routes';

class Navbar extends Component 
{
    constructor(props) {
        super(props)
        const token = localStorage.getItem("token");      
        let loggedIn = true
        if(token == null)
        {
            loggedIn = false
        }

        this.state = {
             display_status:'none',
             display_sub_status:'none',
             display_sub_status_user:'none',
             responsive:false,
             innerwidth:'',
             loggedIn
        };

        
        this.menu_toggle = this.menu_toggle.bind(this);
        this.menu_sub_toggle = this.menu_sub_toggle.bind(this);
        this.logout_frontend_side = this.logout_frontend_side.bind(this);
        this.menu_sub_toggle_user = this.menu_sub_toggle_user.bind(this);

    }

    async componentDidMount()
    {  
        //console.log('window.innerHeight', window.innerHeight);
        //console.log('window.innerwidth', window.innerWidth);
    }

    async menu_toggle(e)
    {
        e.preventDefault();    
        if(this.props.isMobileSized)
        {
               if(this.state.display_status=='none')
               {
                       await this.setState({
                                display_status:'block',                
                        });
               }
               else{
                await this.setState({
                        display_status:'none',                
                    });
               }
        }
    }

    async menu_sub_toggle(e)
    {
        e.preventDefault();    
        if(this.props.isMobileSized && this.state.display_status=='block')
        {
                if(this.state.display_sub_status=='none')
                {
                    await this.setState({
                        display_sub_status:'block',                
                         });
                }
                else{
                    await this.setState({
                        display_sub_status:'none',                
                         });
                }
        }
    }

    async menu_sub_toggle_user(e)
    {
        e.preventDefault();    
        if(this.props.isMobileSized && this.state.display_status=='block')
        {
                if(this.state.display_sub_status_user=='none')
                {
                    await this.setState({
                        display_sub_status_user:'block',                
                         });
                }
                else{
                    await this.setState({
                        display_sub_status_user:'none',                
                         });
                }
        }

    }

    logout_frontend_side(e)
    {
        e.preventDefault()
        localStorage.removeItem("token");
        localStorage.removeItem("login_user_id");
        this.setState({
            loggedIn:false,                
        }); 
        Router.pushRoute('/').then(() => window.scrollTo(0, 0));
    }

    
    
    render() {

        const {display_status,display_sub_status,display_sub_status_user,loggedIn} = this.state;       

        return (   
            
                <header>
                    <div className="clearfix fix-wrap">
                        <div className="navbar-header">
                            <Link href="/"><a className="logo"><img src="/static/images/logo.png" alt="Aurora Capital Partners Logo" /></a></Link>
                            {/* <a href="#" onClick={this.menu_toggle} className="navbar-toggle"></a> */}
                            {
                                this.props.isMobileSized &&
                                <a href="#" id='1' onClick={this.menu_toggle} className="navbar-toggle"></a>
                            }
                            {
                                !this.props.isMobileSized &&
                                <a href="#" id='2' className="navbar-toggle"></a>
                            }
                    
                        </div>

                        {
                            this.props.isMobileSized &&
                            <div className="nav-brand" style={{"display":display_status}}>
                                <ul>
                                    <li className="parent">
                                    <a href="#" onClick={this.menu_sub_toggle} className={(display_sub_status=='block')?"open-subnav":''}>About</a>
                                        <div className="submenu-wrap" style={{"display":display_sub_status}}>
                                             <ul>
                                                <li><Link href="/about" as="/About"><a>About the Firm</a></Link></li>
                                                <li><Link href="/aboutourteam" as="/About/OurTeam"><a>Our Team</a></Link></li>
                                                <li><Link href="/aboutadvisors" as="/About/Advisors"><a>Advisors</a></Link></li>
                                                <li><Link href="/aboutceo" as="/About/CEOs"><a>CEOs</a></Link></li>                                              
                                                
                                            </ul>
                                        </div>
                                    </li>

                                    <li><Link href="/strategy" as="/Strategy"><a>STRATEGY</a></Link></li>
                                    {/* <li><Link href="/portfolio" as="/Portfolio"><a>PORTFOLIO</a></Link></li> */}
                                    {
                                        loggedIn &&
                                        <li><Link href="/portfolio" as="/Portfolio"><a>PORTFOLIO</a></Link></li>
                                    }
                                    <li><Link href="/news" as="/News"><a>News</a></Link></li>
                                    <li><Link href="/contact" as="/Contact"><a>CONTACT</a></Link></li>
                                    
                                    {
                                        loggedIn &&
                                        <li className="parent">
                                        <a href="#" onClick={this.menu_sub_toggle_user} className={(display_sub_status_user=='block')?"open-subnav":''}>User Setting</a>
                                            <div className="submenu-wrap" style={{"display":display_sub_status_user}}>
                                                <ul>
                                                    <li><Link href="/editprofile" as="/Editprofile"><a>Edit Profile</a></Link></li>
                                                    <li><Link href="/changepassword" as="/Changepassword"><a>Change Password</a></Link></li>                                                    
                                                    <li><a href="#" onClick={this.logout_frontend_side}>Logout</a></li>
                                                </ul>
                                            </div>
                                        </li>
                                    }
                                    {
                                        loggedIn==false &&
                                        <li><Link href="/login" as="/Login"><a>Login</a></Link></li>
                                    }
                                </ul>
                            </div> 
                            
                        }

                        {
                            !this.props.isMobileSized &&
                            <div className="nav-brand">
                                <ul>
                                    <li className="parent">
                                    <Link href="#"><a>About</a></Link>
                                        <div className="submenu-wrap">
                                            <ul>
                                                <li><Link href="/about" as="/About"><a>About the Firm</a></Link></li>
                                                <li><Link href="/aboutourteam" as="/About/OurTeam"><a>Our Team</a></Link></li>
                                                <li><Link href="/aboutadvisors" as="/About/Advisors"><a>Advisors</a></Link></li>
                                                <li><Link href="/aboutceo" as="/About/CEOs"><a>CEOs</a></Link></li>
                                            </ul>
                                        </div>
                                    </li>
                                    <li><Link href="/strategy" as="/Strategy"><a>STRATEGY</a></Link></li>
                                    {/* <li><Link href="/portfolio" as="/Portfolio"><a>PORTFOLIO</a></Link></li> */}
                                    {
                                        loggedIn &&
                                        <li><Link href="/portfolio" as="/Portfolio"><a>PORTFOLIO</a></Link></li>
                                    }
                                    <li><Link href="/news" as="/News"><a>News</a></Link></li>
                                    <li><Link href="/contact" as="/Contact"><a>CONTACT</a></Link></li>
                                    
                                    {
                                        loggedIn &&
                                        <li className="parent">
                                        <Link href="#"><a>User Setting</a></Link>
                                            <div className="submenu-wrap">
                                                <ul>
                                                    <li><Link href="/editprofile" as="/Editprofile"><a>Edit Profile</a></Link></li>
                                                    <li><Link href="/changepassword" as="/Changepassword"><a>Change Password</a></Link></li>                                                    
                                                    <li><a href="#" onClick={this.logout_frontend_side}>Logout</a></li>
                                                </ul>
                                            </div>
                                        </li>
                                    }
                                    {
                                        loggedIn==false &&
                                        <li><Link href="/login" as="/Login"><a>Login</a></Link></li>
                                    }
                                </ul>
                            </div> 
                            
                        }

                        {/* <div className="nav-brand" style={{"display":display_status}}>
                            <ul>
                                <li className="parent">
                                <Link href="#"><a>About</a></Link>
                                    <div className="submenu-wrap">
                                        <ul>
                                            <li><Link href="/About"><a>About the Firm</a></Link></li>
                                            <li><Link href="/Aboutourteam" as="/About/OurTeam"><a>Our Team</a></Link></li>
                                            <li><Link as="/About/Advisors" href="/Aboutadvisors"><a>Advisors</a></Link></li>
                                            <li><Link as="/About/CEOs" href="/Aboutceo"><a>CEOs</a></Link></li>
                                        </ul>
                                    </div>
                                </li>
                                <li><Link href="/Strategy"><a>STRATEGY</a></Link></li>
                                <li><Link href="/Portfolio"><a>PORTFOLIO</a></Link></li>
                                <li><Link href="/News"><a>News</a></Link></li>
                                <li><Link href="/Contact"><a>CONTACT</a></Link></li>
                            </ul>
                        </div>  */}


                    </div>
                </header>
        );
      }
}

export default withWindowDimensions(Navbar);

