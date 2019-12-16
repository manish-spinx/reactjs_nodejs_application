import React, { Component } from 'react';
import axios from 'axios'; 
import Link from 'next/link';
import Layout from '../components/Layout';
import { Router } from '../routes';
import {FETCH_NODE_API_URL} from '../components/ServerApi';
import FadeIn from 'react-fade-in';
import localStorage from "localStorage";
import requiresAuth from '../components/requiresAuth';


class Portfolio extends Component 
{
    constructor(props) {
        super(props)

        this.state = {
            api_data : [],
            current_data: [],
            history_data:[],
            current_data_slug:[],
            class_active:'1',
            visible:true,
        };

        this.detail_page = this.detail_page.bind(this);
        
        this.handle_all = this.handle_all.bind(this);
        this.handle_industrial = this.handle_industrial.bind(this);
        this.handle_tech = this.handle_tech.bind(this);
    }

    detail_page(e,status)
    {
        e.preventDefault(); 
        
        const record = this.state.api_data;
        const clickable_link = e.target.src;
        var title_name = '';

        record.map((item, key) =>{
                if(item.logo_image_link===clickable_link)
                {
                    title_name = item.title;
                }
             });

        var small_character = title_name.toLowerCase();
        var dynamic_slug = small_character.replace(/\s+/g, '-')  
        
        if(status=='c')
        {
            let check_slug =  this.state.current_data_slug.includes(dynamic_slug);
            let check_slug_index = this.state.current_data_slug.indexOf(dynamic_slug);
            localStorage.setItem("portfolio_c_i",check_slug_index);
            localStorage.setItem("portfolio_t_i",(this.state.current_data_slug.length>0)?this.state.current_data_slug.length-1:this.state.current_data_slug.length);
            localStorage.setItem("portfolio_page_slug",JSON.stringify(this.state.current_data_slug));
        }
        else{
            let check_slug =  this.state.history_data_slug.includes(dynamic_slug);
            let check_slug_index = this.state.history_data_slug.indexOf(dynamic_slug);
            localStorage.setItem("portfolio_c_i",check_slug_index);
            localStorage.setItem("portfolio_t_i",(this.state.history_data_slug.length>0)?this.state.history_data_slug.length-1:this.state.history_data_slug.length);
            localStorage.setItem("portfolio_page_slug",JSON.stringify(this.state.history_data_slug));
        } 

        Router.pushRoute('/Portfolio/'+dynamic_slug).then(() => window.scrollTo(0, 0));
    }

    async componentDidMount()
    {

        const res = await axios.post(FETCH_NODE_API_URL()+'all_portfolio');
        const record = res.data.data.rows;

        const record_current = [];
        const record_current_slug = [];
        const record_history = [];
        const record_history_slug = [];

        record.map((item, key) =>{

            let small_character = item.title.toLowerCase();
            let dynamic_slug = small_character.replace(/\s+/g, '-')        

               if(item.p_type_history==0)               
               {
                 record_current.push(item.logo_image_link);
                 record_current_slug.push(dynamic_slug);
                 //record_current_slug.push([dynamic_slug,item.logo_image_link]);
               }
               else{
                record_history.push(item.logo_image_link);  
                record_history_slug.push(dynamic_slug);
               }
        });   

        await this.setState({
            api_data : res.data.data.rows,
            current_data:record_current,
            current_data_slug:record_current_slug,
            history_data:record_history,
            history_data_slug:record_history_slug,
         });       

    }

    async handle_industrial(e)
    {
        e.preventDefault();    

        this.setState({class_active:'2'});

        const record = this.state.api_data;
        const record_current = [];
        const record_current_slug = [];
        const record_history = [];
        const record_history_slug = [];

        record.map((item, key) =>{

            let small_character = item.title.toLowerCase();
            let dynamic_slug = small_character.replace(/\s+/g, '-')   

            if(item.p_type_history==0 && item.p_type_industry==1)               
            {
              record_current.push(item.logo_image_link);
              record_current_slug.push(dynamic_slug);
            }
            else if(item.p_type_history==1 && item.p_type_industry==1)
            {
             record_history.push(item.logo_image_link);  
             record_history_slug.push(dynamic_slug); 
            }
         });

         await this.setState({
            current_data:record_current,
            history_data:record_history,
            current_data_slug:record_current_slug,
            history_data_slug:record_history_slug,
         });
    }

    async handle_tech(e)
    {
        e.preventDefault();  

        this.setState({class_active:'3'});

        const record = this.state.api_data;
        const record_current = [];
        const record_current_slug = [];
        const record_history = [];
        const record_history_slug = [];

        record.map((item, key) =>{

            let small_character = item.title.toLowerCase();
            let dynamic_slug = small_character.replace(/\s+/g, '-') 

            if(item.p_type_history==0 && item.p_type_software==1)               
            {
              record_current.push(item.logo_image_link);
              record_current_slug.push(dynamic_slug);
            }
            else if(item.p_type_history==1 && item.p_type_software==1)
            {
                record_history.push(item.logo_image_link);   
                record_history_slug.push(dynamic_slug); 
            }
         });

         await this.setState({
            current_data:record_current,
            history_data:record_history,
            current_data_slug:record_current_slug,
            history_data_slug:record_history_slug,
         });

    }

    handle_all(e)
    {
        e.preventDefault();    
        this.setState({class_active:'1'});
        this.componentDidMount();

    }
    
    render() {

        const {current_data,history_data,class_active,visiable_flag} = this.state;   

        return (             
            
              <React.Fragment>
                {
                    <Layout title='Portfolio - Aurora Capital Partners'>
                    <section className="cmn-banner page-title" >
                    <div className="imgDiv web-view" style={{"backgroundImage":"url(/static/images/portfolio-banner.jpg)"}}></div>
                    <div className="imgDiv mob-view" style={{"backgroundImage":"url(/static/images/portfolio-banner.jpg)"}}></div>
                    <div className="banner-title">
                    <h1>Portfolio</h1>
                    </div>
                    </section>

                    
                    <section className="highlight-box">
                    <div className="fix-wrap">
                    <p>We have invested approximately $4 billion in equity capital and have completed over 175 transactions.</p>
                    </div>
                    </section>

                    
                    <section className="portfolio-content">
                    <div className="cmn-tabs">
                    <div className="fix-wrap">
                    <a href="#" className="filter-toggle">Filter</a>
                    <ul className="cmn-list">
                    <li><a href="#" onClick={this.handle_all} className={(class_active=='1')?"active":''}>All</a></li>
                    <li><a href="#" onClick={this.handle_industrial} className={(class_active=='2')?"active":''}>Industrial</a></li>
                    <li><a href="#" onClick={this.handle_tech} className={(class_active=='3')?"active":''}>Technology Enabled</a></li>
                    </ul>
                    </div>
                    </div>

                    <div className="cmn-tabs-content">
                    <div className="clearfix fix-wrap">
 
                     {
                        current_data.length>0 &&
                        <div className="portfolio-row">
                        <h3>CURRENT</h3>
                            <ul className="cmn-list logo-list">
                                {
                                        current_data.map((record) =>{
                                            return  <FadeIn delay={300} transitionDuration={500} key={record}><li key={record}><a href="#" onClick={(e) => this.detail_page(e, 'c')}><img ids="current" src={record} alt="logo" /></a></li></FadeIn>
                                        })
                                }
                            </ul>
                        </div>
                     }  
                       
                    {
                        history_data.length>0 &&
                        <div className="portfolio-row">
                            <h3>HISTORICAL</h3>
                            <ul className="cmn-list logo-list">
                                {
                                    history_data.map((record) =>{
                                        return <FadeIn delay={300} transitionDuration={500} key={record}><li key={record}><a href="#" onClick={(e) => this.detail_page(e, 'h')}><img ids="history" src={record} alt="logo" /></a></li></FadeIn>
                                    })
                                }
                            </ul>
                        </div>
                    }

                    </div>
                    </div>
                    </section>
                    </Layout> 
                }
                </React.Fragment>

                        
        );
      }
}

export default requiresAuth(Portfolio);
