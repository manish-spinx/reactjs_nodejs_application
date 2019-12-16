import React, { Component } from 'react';
import axios from 'axios'; 
import localStorage from "localStorage";
import Layout from '../components/Layout';
import { Router } from '../routes';
import {FETCH_NODE_API_URL} from '../components/ServerApi';
import Hocnextpre from '../components/Hocnextpre';

class Aboutourteam extends Component 
{
    constructor(props) {
        super(props)

        this.state = {
            api_data:[],
            api_title_data:[],
            search_key:'',
        };

        this.teamdetail = this.teamdetail.bind(this);
        this.onChange_watch = this.onChange_watch.bind(this);    
        this.search_filter_api = this.search_filter_api.bind(this);          
        
    }
    

    teamdetail(e)
    {
        e.preventDefault(); 

        let t_name = e.target.id;
        let cur_index = "ourteam_main_c_i";
        let cur_total = "ourteam_main_t_i";        
        let cur_array = "ourteam_main_page_slug";
        let routes = "/About/OurTeam/";    
        var c_d_slug = this.state.current_data_slug;          
        this.props.hoc_details_page(t_name,cur_index,cur_total,cur_array,routes,c_d_slug);
        

        // const title_name = e.target.id;
        // var small_character = title_name.toLowerCase();
        // var dynamic_slug = small_character.replace(/\s+/g, '-');        
        // let check_slug =  this.state.current_data_slug.includes(dynamic_slug);
        // let check_slug_index = this.state.current_data_slug.indexOf(dynamic_slug);
        // localStorage.setItem("ourteam_main_c_i",check_slug_index);
        // localStorage.setItem("ourteam_main_t_i",(this.state.current_data_slug.length>0)?this.state.current_data_slug.length-1:this.state.current_data_slug.length);
        // localStorage.setItem("ourteam_main_page_slug",JSON.stringify(this.state.current_data_slug))
        // Router.pushRoute('/About/OurTeam/'+dynamic_slug).then(() => window.scrollTo(0, 0));

    }

    async componentDidMount()
    {
        const res =await axios.post(FETCH_NODE_API_URL()+'all_people',{p_type:'1'});
        const res_title =await axios.post(FETCH_NODE_API_URL()+'all_job_title');

        const record = res.data.data.rows;
        const record_current_slug = [];

        record.map((item, key) =>{
            let small_character = item.name.toLowerCase();
            let dynamic_slug = small_character.replace(/\s+/g, '-');
            record_current_slug.push(dynamic_slug);
        }); 

        await this.setState({
            api_data : res.data.data.rows,
            api_title_data : res_title.data.data.rows,
            current_data_slug:record_current_slug
         });

    }

    async search_filter_api()
    {
        const res = await axios.post(FETCH_NODE_API_URL()+'all_people',
                                {
                                  p_type:'1',
                                  original:this.state.search_key,
                                  search_job_title:this.state.job_title
                                });

            const record_current_slug = [];
            const record = res.data.data.rows;

            await record.map((item, key) =>{
                let small_character = item.name.toLowerCase();
                let dynamic_slug = small_character.replace(/\s+/g, '-');
                record_current_slug.push(dynamic_slug);
            }); 

                      
            await this.setState({
                api_data : res.data.data.rows,  
                current_data_slug:record_current_slug             
             });
    }

    calladvisiors(e)
    {
        e.preventDefault();
        Router.pushRoute('/About/Advisors');
    }

    callceo(e)
    {
        e.preventDefault();
        Router.pushRoute('/About/CEOs');
    }

    async onChange_watch(e)
    {
        await this.setState({
            [e.target.name] : e.target.value
         });
        this.search_filter_api();
    }

    
    render() {
        const {api_data,api_title_data} = this.state;
        return (             
            <Layout title='Out Team - Aurora Capital Partners'>

                <section className="cmn-banner page-title" >
                <div className="imgDiv web-view" style={{"backgroundImage":"url(/static/images/about-banner.jpg)"}}></div>
                <div className="imgDiv mob-view" style={{"backgroundImage":"url(/static/images/about-banner.jpg)"}}></div>
                <div className="banner-title">
                <h1>OUR PEOPLE</h1>
                </div>
                </section>

                
                <section className="portfolio-content our-team-content">
                    <div className="cmn-tabs">
                        <div className="fix-wrap">
                        <a href="#" className="filter-toggle">Filter</a>
                        <ul className="cmn-list">
                        <li><a href="#" className="active">Our Team</a></li>
                        <li><a href="#" onClick={this.calladvisiors}>Advisors</a></li>
                        <li><a href="#" onClick={this.callceo}>CEOs</a></li>
                        </ul>
                        </div>
                    </div>
                <div className="cmn-tabs-content">
                
                <div className="highlight-box grey-box">
                    <div className="fix-wrap">
                    <p>California has always been fertile ground for open, bold and creative thinking. We bring that spirit to private equity investing and are proud of the highly effective culture our team has built over many years together.</p>
                    </div>
                </div>

                {
                    api_data.length>0 &&
                    <div className="team-filter">
                    <div className="fix-wrap">
                    <div className="filter-form">
                    <form action="#" method="post">
                    <div className="form-group search-field">
                    <label htmlFor="search_key">SEARCH</label>
                    <div className="inputDiv"><input type="text" id="search_key" name="search_key" value={this.state.search_key} placeholder="Keyword or name..." onChange={this.onChange_watch}/></div>
                    </div>
                    <div className="form-group title-field">
                    <label htmlFor="TeamPost">TITLE</label>
                    <div className="custom-select-box">
                    <select id="TeamPost" name="job_title" id="job_title" value={this.state.job_title} onChange={this.onChange_watch}>
                    <option value="0">All</option>
                    {
                        api_title_data.map((item, key) =>
                        {
                            return <option key={item._id} value={item._id}>{item.name}</option>;
                        })

                    }
                    </select>
                    </div>
                    </div>
                    <div className="form-group btn-action">
                    <label>&nbsp;</label>
                    <input type="submit" id="FindTeam" className="btn-primary" value="" />
                    </div>
                    </form>
                    </div>
                    <div className="team-list">
                    <ul className="cmn-list">
                    {
                        api_data.map((item, key) =>
                        {
                            return <li key={item._id}>
                                <a href="#" onClick={this.teamdetail} id={item.name}>
                                    <div className="team-img" style={{"backgroundImage":"url("+item.profile_image_link+")"}}></div>
                                    <div className="team-desc">
                                    <h3>{item.name}</h3>
                                    <p>{item.job_title_name}</p>
                                    <div className="arrow-icn"><img src="/static/images/ourteam-hover-arrow.png" width="27" alt="Arrow" /></div>
                                    </div>	
                                </a>
                            </li>

                        })
                    }
                    </ul>
                    </div>
                    </div>
                    </div>

                }
                </div>
                </section>
            </Layout>             
        );
      }
}

export default Hocnextpre(Aboutourteam);
