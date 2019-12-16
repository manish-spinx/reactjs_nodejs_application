import React, { Component } from 'react';
import axios from 'axios'; 
import localStorage from "localStorage";
import Layout from '../components/Layout';
import { Router } from '../routes';
import {FETCH_NODE_API_URL} from '../components/ServerApi';
import Hocnextpre from '../components/Hocnextpre';

class Aboutadvisors extends Component 
{
    constructor(props) {
        super(props)

        this.state = {
            api_data:[],
        };

        this.advisorsdetail = this.advisorsdetail.bind(this);
    }

async componentDidMount()
{
    const res =await axios.post(FETCH_NODE_API_URL()+'all_people',{p_type:'2'});

    const record = res.data.data.rows;
    const record_current_slug = [];

    record.map((item, key) =>{

        let small_character = item.name.toLowerCase();
        let dynamic_slug = small_character.replace(/\s+/g, '-');
        record_current_slug.push(dynamic_slug);
    });

    await this.setState({
        api_data : res.data.data.rows,
        current_data_slug:record_current_slug

        });

}

advisorsdetail(e)
{
    e.preventDefault(); 
    let t_name = e.target.id;
    let cur_index = "ourteam_advsr_c_i";
    let cur_total = "ourteam_advsr_t_i";        
    let cur_array = "ourteam_advsr_page_slug";
    let routes = "/About/Advisors/";    
    var c_d_slug = this.state.current_data_slug;          
    this.props.hoc_details_page(t_name,cur_index,cur_total,cur_array,routes,c_d_slug);

    // const title_name = e.target.id;
    // var small_character = title_name.toLowerCase();
    // var dynamic_slug = small_character.replace(/\s+/g, '-');        

    // let check_slug =  this.state.current_data_slug.includes(dynamic_slug);
    // let check_slug_index = this.state.current_data_slug.indexOf(dynamic_slug);

    // localStorage.setItem("ourteam_advsr_c_i",check_slug_index);
    // localStorage.setItem("ourteam_advsr_t_i",(this.state.current_data_slug.length>0)?this.state.current_data_slug.length-1:this.state.current_data_slug.length);
    // localStorage.setItem("ourteam_advsr_page_slug",JSON.stringify(this.state.current_data_slug));       
    // Router.pushRoute('/About/Advisors/'+dynamic_slug).then(() => window.scrollTo(0, 0));        
    
}

callteam(e)
{
    e.preventDefault();
    Router.pushRoute('/About/OurTeam');
}

callceo(e)
{
    e.preventDefault();
    Router.pushRoute('/About/CEOs');

}
    
    render() {
        const {api_data} = this.state

        return (             
            <Layout title='Advisors - Aurora Capital Partners'>
                
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
                <li><a href="#" onClick={this.callteam}>Our Team</a></li>
                <li><a href="#" className="active">Advisors</a></li>
                <li><a href="#" onClick={this.callceo}>CEOs</a></li>
                </ul>
                </div>
                </div>
                <div className="cmn-tabs-content">
                
                <div className="highlight-box grey-box">
                <div className="fix-wrap">
                <p>We integrate seasoned executives into our practice to deepen our perspective and help make us the partner of choice for management teams.</p>
                </div>
                </div>
                {
                    api_data.length>0 &&
                    <div className="people-list">
                        <div className="fix-wrap">
                            <ul className="cmn-list">

                                {
                                    api_data.map((item, key) =>{
                                        return <li key={item.name}><h3><a href="#" id={item.name} onClick={this.advisorsdetail}>{item.name}</a></h3><p>{item.job_title_other}</p></li>
                                    })

                                }

                            </ul>
                        </div>
                    </div>
                }

                </div>
                </section>

            </Layout>             
        );
      }
}

export default Hocnextpre(Aboutadvisors)
