import React, { Component } from 'react';
import axios from 'axios'; 
import ReactHtmlParser from 'react-html-parser';
import Layout from '../components/Layout';
import { Router } from '../routes';

export default class ErrorPage extends Component 
{
    constructor(props) {
        super(props)
    }

    render() {

        return (             
            <Layout title={'Page Not Found - Aurora Capital Partners'}>

                <section className="cmn-banner">
                    <div className="imgDiv web-view" style={{"backgroundImage":"url(/static/images/contact-banner.jpg)"}}></div>
                    <div className="imgDiv mob-view" style={{"backgroundImage":"url(/static/images/contact-banner.jpg)"}}></div>
                </section>
                
                <section className="cmn-pull-top nodata-page">
                    <div className="fix-wrap">
                        <div className="white-box">
                            
                            <h1>4<img src="/static/images/f-logo.png" width="85" alt="logo" />4</h1>
                            <h3>Sorry, Page Not Found</h3>
                            <p>The page you requested either does not exist. <br/>Return to the <a href="/">homepage</a>, or <a href="/Contact">contact</a> our support team.</p>
                        </div>
                    </div>
                </section>

            </Layout>             
        );
      }
}
