import React, { Component } from 'react';
import axios from 'axios'; 
import { Router } from '../routes';
import moment from "moment";

import Layout from '../components/Layout';
import {FETCH_NODE_API_URL} from '../components/ServerApi';

import localStorage from "localStorage";

//var localStorage = require('localStorage')


export default class Index extends Component 
{
    constructor(props) {
        super(props)

        this.state = {
            api_data : [],
            api_news_data:[],
            f_title:'',
            f_dateofarticle:'',
        };

        this.newdetail = this.newdetail.bind(this);        
    }

    async componentDidMount()
    {  
        try{

            let res = await axios.post(FETCH_NODE_API_URL()+'all_strategies');
            let res_news = await axios.post(FETCH_NODE_API_URL()+'all_news',{limit:3});

             if(res_news.data.data.rows.length>0)
             {

                const record = res_news.data.data.rows;
                const record_current_slug = [];

                record.map((item, key) =>{
                    let dynamic_slug = item.slug
                    record_current_slug.push(dynamic_slug);
                });

                let first_data =  res_news.data.data.rows[0];
                await delete res_news.data.data.rows[0];

                await this.setState({
                    api_data : res.data.data.rows,
                    api_news_data : res_news.data.data.rows,
                    f_title:first_data.title,
                    f_dateofarticle:moment(first_data.dateofarticle).format("MMM DD,YYYY"),
                    f_slug:first_data.slug,
                    current_data_slug:record_current_slug
                 });
             }
             else{

                await this.setState({
                    api_data : res.data.data.rows,
                    api_news_data : res_news.data.data.rows,
                    f_title:'',
                    f_dateofarticle:'',
                    f_slug:'',
                 });
             }

        }catch(err)
        {
              console.log(err);
        }
        
    }

    handleclick(e)
    {
        e.preventDefault();    
    }

    view_all_news(e)
    {
        e.preventDefault();    
        Router.pushRoute('/News');
    }


    newdetail(e)
    {
        e.preventDefault(); 
        const title_name = e.target.id;
        // var small_character = title_name.toLowerCase();
        // var dynamic_slug = small_character.replace(/\s+/g, '-');  

        let check_slug =  this.state.current_data_slug.includes(title_name);
        let check_slug_index = this.state.current_data_slug.indexOf(title_name);

        localStorage.setItem("news_details_c_i",check_slug_index);
        localStorage.setItem("news_details_t_i",(this.state.current_data_slug.length>0)?this.state.current_data_slug.length-1:this.state.current_data_slug.length);
        localStorage.setItem("news_details_page_slug",JSON.stringify(this.state.current_data_slug)); 

        Router.pushRoute('/News/'+title_name);
    }

    
    render() {

        const {api_data,api_news_data,f_title,f_dateofarticle,f_slug} = this.state;

        return (             
            <Layout title='Aurora Capital Partners'>
                <section className="cmn-banner hp-banner" >
                <div className="imgDiv web-view" style={{"backgroundImage":"url(/static/images/homepage-banner.jpg)"}}></div>
                <div className="imgDiv mob-view" style={{"backgroundImage":"url(/static/images/homepage-banner-mob.jpg)"}}></div>
                <div className="banner-title">
                <h1>Inspiring <br/>Partnerships</h1>
                </div>
                </section>

                
                <section className="hp-TxtBlk">
                <div className="fix-wrap">
                <p>We strive to inspire partnership among the most talented management teams, boards and investors in private equity because we believe a foundation of sincere partnership creates the optimal environment for decision making, creative solutions, and long-term investment results.</p>
                <a href="#" className="btn-primary">LEARN MORE</a>
                </div>
                </section>

                {
                    api_data.length > 0 &&
                    <section className="hp-strategy">
                        <ul className="cmn-list">
                            {
                                api_data.map((item, key) =>{

                                    return <li key={item._id}>
                                                <a href="#" onClick={this.handleclick} style={{"backgroundImage":"url("+item.strategy_image_link+")"}}>
                                                    <div className="st-title">
                                                    <h3>{item.name}</h3>
                                                    </div>                               
                                                </a>
                                            </li>
                                })
                            }
                        </ul>
                    </section>
                }    

                {
                    api_news_data.length>0 && 

                        <section className="hp-recent-news">
                        <div className="fix-wrap">
                        <h2><span className="f-left">Recent News</span> <a href="#" onClick={this.view_all_news} className="f-right">View all news</a></h2>
                
                        <div className="featured-news" style={{"backgroundImage":"url(/static/images/news-featured.jpg)"}}>
                        <div className="post-date">{f_dateofarticle}</div>
                        <h3><a href="#" onClick={this.newdetail} id={f_slug}>{f_title}</a></h3>
                        <a href="#"><img src="/static/images/featured-arrow-news.png" width="27" alt="link" /></a>
                        </div>
                
                    
                        <div className="news-list">
                            <ul className="cmn-list">
                                {
                                    api_news_data.map((item, key) =>{
                                        return <li key={item._id}>
                                                    <div className="post-date">{moment(item.dateofarticle).format("MMM DD,YYYY")}</div>
                                                    <h3><a href="#" onClick={this.newdetail} id={item.slug}>{item.title}</a></h3>
                                                </li>
                                    })
                                }
                            </ul>
                        </div>
                    </div>
                    </section>

                }

            </Layout>             
        );
      }
}
