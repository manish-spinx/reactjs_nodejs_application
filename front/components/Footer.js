import React, { Component } from 'react';
import Link from 'next/link';
import axios from 'axios'; 
import localStorage from "localStorage";
import {FETCH_NODE_API_URL} from './ServerApi';
import { Router } from '../routes';

export default class Footer extends Component 
{
    constructor(props) {
        super(props)

        this.state = {
            api_data : [],
            visiable_flag:false,
        };

    }

    async componentDidMount()
    {
        if(localStorage.getItem("token")==null)
        {
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

        const res = await axios.post(FETCH_NODE_API_URL()+'all_strategies');

        await this.setState({
            api_data : res.data.data.rows,
         });
    }

    handleclick(e)
    {
        e.preventDefault();    
    }

    main_page(e)
    {
        e.preventDefault();    
        Router.pushRoute('/').then(() => window.scrollTo(0, 0));
    }
    
    render() {

        const {api_data,visiable_flag} = this.state

        return (
        <footer style={{"backgroundImage":"url(/static/images/footerbg.jpg)"}}>
            <div className="f-logo">
                <a href="#" onClick={this.main_page}><img src="/static/images/f-logo.png" alt=""/></a>
            </div>
            <div className="clearfix fix-wrap">
                <div className="get-in-touch">
                    <h2><span>Get in touch with us</span>
                        <div className="f-right"><a href="#" onClick={this.main_page}><img src="/static/images/arrowfooter.png" width="27" alt=""/></a></div>
                    </h2>
                </div>
                <div className="f-links">
                    <div className="f-col">
                        <h4>About</h4>
                        <ul className="cmn-list">
                                <li><Link href="/about" as="/About"><a>About the Firm</a></Link></li>
                                <li><Link href="/aboutourteam" as="/About/OurTeam"><a>Our Team</a></Link></li>
                                <li><Link href="/aboutadvisors" as="/About/Advisors"><a>Advisors</a></Link></li>
                                <li><Link href="/aboutceo" as="/About/CEOs"><a>CEOs</a></Link></li>
                        </ul>
                    </div>
                    <div className="f-col strategy-col">
                        <h4>Strategy</h4>
                        <ul className="cmn-list">
                            <li><a href="#" onClick={this.handleclick}>All Strategies</a></li>
                            {
                                api_data.map((item, key) =>{

                                    return <li key={item._id}>
                                             <a href="#" onClick={this.handleclick}>{item.name}</a>
                                            </li>
                                })
                            }
                        </ul>
                    </div>
                    <div className="f-col fix-col">
                            {
                                visiable_flag && 
                                <h4><Link href="/portfolio" as="/Portfolio"><a>PORTFOLIO</a></Link></h4>
                            }
                            <h4><Link href="/news" as="/News"><a>News</a></Link></h4>
                            <h4><Link href="/contact" as="/Contact"><a>CONTACT</a></Link></h4>

                        <div className="social-link">
                            <ul className="cmn-list">
                                {/* <li><a href="#" target="_blank"><i className="icn-tweet"></i></a></li>
                                <li><a href="#" target="_blank"><i className="icn-fb"></i></a></li> */}
                                <li><a href="https://www.linkedin.com/company/aurora-capital-group/" target="_blank"><i className="icn-lin"></i></a></li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div className="copyright">
                    <div className="f-left"><span>&copy; {(new Date().getFullYear())} Aurora Capital Partners All rights reserved.</span> | <a href="#">Privacy Policy</a> | <a href="#">Sitemap</a></div>
                    <div className="f-right">
                        Design by &nbsp;<a href="http://spinxdigital.com" target="_blank">SPINX Digital</a>
                    </div>
                </div>
            </div>
        </footer>
        );
      }
}

