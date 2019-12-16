import React, { Component } from 'react';
import axios from 'axios'; 
import Layout from '../components/Layout';

import {FETCH_NODE_API_URL} from '../components/ServerApi';


export default class Strategy extends Component 
{
    constructor(props) {
        super(props)

        this.state = {
            api_data : [],
        };
    }


    async componentDidMount()
    {
        const res =await axios.post(FETCH_NODE_API_URL()+'all_strategies');

        await this.setState({
            api_data : res.data.data.rows,
         });
    }

    handleclick(e)
    {
        e.preventDefault();    
    }
    
    render() {
        const {api_data} = this.state;

        return (
             
            <Layout title='Strategy - Aurora Capital Partners'>
                <section className="cmn-banner page-title" >
                <div className="imgDiv web-view" style={{"backgroundImage":"url(/static/images/strategies-banner.jpg)"}}></div>
                <div className="imgDiv mob-view" style={{"backgroundImage":"url(/static/images/strategies-banner.jpg)"}}></div>
                <div className="banner-title">
                <h1>STRATEGY</h1>
                </div>
                </section>
                
                <section className="highlight-box">
                <div className="fix-wrap">
                <p>Our portfolio companies are leaders of the middle market economy and some of the most outstanding businesses in the United States.</p>
                </div>
                </section>

                
                <section className="about-content">
                <div className="clearfix fix-wrap">
                <div className="f-left">
                <p>We target premium companies with a defensible market position and a management team with a passionate vision for the future of their industry.</p>
                <p>We typically target businesses valued between $100 and $500 million, with a conservative approach to leverage that deploys between $50 and $300 million of equity per transaction. We only deploy capital in partnerships where we have high conviction.</p>
                <p>We are particularly skilled at supporting acquisitive businesses. Our portfolio companies execute an average of six transformative acquisitions in partnership with Aurora.</p>
                </div>
                <div className="f-right">
                <img src="/static/images/strategies-image.jpg" alt="Right Image" />
                </div>
                </div>
                </section>

                {
                   api_data.length > 0 &&
                   <section className="hp-strategy abt-list">
                        <div className="fix-wrap">
                        <h2 className="section-title">We invest across three sectors.</h2>
                        </div>
                        <ul className="cmn-list">

                            {
                                api_data.map((item, key) =>{

                                    return <li key={item._id}>
                                        <a href="#" onClick={this.handleclick} style={{"backgroundImage":"url("+item.strategy_image_link+")"}}>
                                            <div className="listImg" style={{"backgroundImage":"url("+item.strategy_image_link+")"}}></div>
                                            <div className="st-title">
                                            <div className="abt-icn"><img src={item.icon_image_link} width="59" alt="Our Team" /></div>
                                            <h3>{item.name}</h3>
                                            <div className="arrow-icn"><img src="/static/images/ourteam-hover-arrow.png" width="27" alt="Arrow" /></div>
                                            </div>
                                        </a>
                                    </li>
                                })
                            }
                
                        </ul>
                     </section>
                }

            </Layout>   
          
        );
      }
}
