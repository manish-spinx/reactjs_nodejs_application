import React, { Component } from 'react';
import Layout from '../components/Layout';

export default class About extends Component 
{
    constructor(props) {
        super(props)

    }   
     
    render() {
        return (             
            <Layout title='About - Aurora Capital Partners'>
                <section className="cmn-banner page-title" >
                    <div className="imgDiv web-view" style={{"backgroundImage":"url(/static/images/about-banner.jpg)"}}></div>
                    <div className="imgDiv mob-view" style={{"backgroundImage":"url(/static/images/about-banner.jpg)"}}></div>
                    <div className="banner-title">
                        <h1>ABOUT</h1>
                    </div>
                </section>
                
                
                <section className="highlight-box">
                    <div className="fix-wrap">
                        <p>Founded in 1991, Aurora Capital Partners is one of the West Coast’s original private equity firms.</p>
                    </div>
                </section>
                
                
                <section className="about-content">
                    <div className="clearfix fix-wrap">
                        <div className="f-left">
                            <h3>Aurora Capital Partners works together with successful management teams to build market-leading companies through investments in growth initiatives, strategic positioning and add-on acquisitions.</h3>
                            <p>We understand the value of trusted relationships in optimizing the environment for success. Strong partnerships and the empowerment of people permeate every aspect of our organization.</p> 
                            <p>The most important element of our investment process is to identify and align ourselves with outstanding and principled management teams. To that end, Aurora only invests behind incumbent management and our management partners typically invest meaningful equity alongside Aurora.</p>
                        </div>
                        <div className="f-right">
                            <img src="/static/images/about-image.jpg" alt="Right Image" />
                        </div>
                    </div>
                </section>
                    
                
                <section className="hp-strategy abt-list">
                    <ul className="cmn-list">
                        <li><a href="#" style={{"backgroundImage":"url(/static/images/strategy-1.jpg)"}}>
                                <div className="listImg"></div>
                                <div className="st-title">
                                    <div className="abt-icn"><img src="/static/images/ourteam-hover.png" width="50" alt="Our Team" /></div>
                                    <h3>Our Team</h3>
                                    <div className="arrow-icn"><img src="/static/images/ourteam-hover-arrow.png" width="27" alt="Arrow" /></div>
                                </div>
                        </a></li>
                        <li><a href="#" style={{"backgroundImage":"url(/static/images/advisors.jpg)"}}>
                                <div className="listImg"></div>
                                <div className="st-title">
                                    <div className="abt-icn"><img src="/static/images/ourteam-hover.png" width="50" alt="Our Team" /></div>
                                    <h3>Advisors</h3>
                                    <div className="arrow-icn"><img src="/static/images/ourteam-hover-arrow.png" width="27" alt="Arrow" /></div>
                                </div>
                        </a></li>
                        <li><a href="#" style={{"backgroundImage":"url(/static/images/ceo.jpg)"}}>
                                <div className="listImg"></div>
                                <div className="st-title">
                                    <div className="abt-icn"><img src="/static/images/ourteam-hover.png" width="50" alt="Our Team" /></div>
                                    <h3>CEOs</h3>
                                    <div className="arrow-icn"><img src="/static/images/ourteam-hover-arrow.png" width="27" alt="Arrow" /></div>
                                </div>
                        </a></li>
                    </ul>
                </section>

            </Layout>             
        );
      }
}
