import React, { Component } from 'react';
import axios from 'axios'; 
import ReactHtmlParser from 'react-html-parser';
import localStorage from "localStorage";
import Layout from '../components/Layout';
import { Router } from '../routes';
import {FETCH_NODE_API_URL} from '../components/ServerApi';
import Hocnextpre from '../components/Hocnextpre';

class Aboutceodetail extends Component 
{
    constructor(props) {
        super(props)

        var separate_url = this.props.url.asPath.split("/");

        this.state = {
            api_data:[],
            
            separate_url : separate_url,
            title_slug:'',
        };
        
        this.custom_componentDidMount = this.custom_componentDidMount.bind(this); 
    }

    backurl(e)
    {
        e.preventDefault();  
        Router.pushRoute('/About/CEOs');
    }

    async componentDidMount()
    {
        var check_record = this.state.separate_url;
        var slug_parameter_test = await check_record[3];
        var original_slug_test = await slug_parameter_test.split("-").join(" ");

        const res =await axios.post(FETCH_NODE_API_URL()+'all_people',{
                                  'slug':slug_parameter_test,
                                  'original':original_slug_test,
                                  'p_type':'3'
                               });

            if(res.data.data.rows.length>0)
            {
                const res_obj = res.data.data.rows[0];

                await this.setState({
                    name:res_obj.name,
                    job_title_other:res_obj.job_title_other,
                    bio:res_obj.bio,
                    title_slug:res_obj.name
                });

                //await this.next_and_previous_label();
                let data_slug = "ourteam_ceo_page_slug"; 
                let cur_index_number = "ourteam_ceo_c_i";
                await this.props.n_and_p_label(data_slug,cur_index_number);

            }   
            else{
                Router.pushRoute('/Error/PageNotFound').then(() => window.scrollTo(0, 0));
            }  
    }

    async n_and_p_pagination(e,status)
    {
        e.preventDefault();
        let cur_index = "ourteam_ceo_c_i";
        let cur_slug = "ourteam_ceo_page_slug";
        let next_slug = "set_next_ceo_slug";
        let routes = '/About/CEOs/';

        await this.props.n_and_p_pagination_hoc(status,cur_index,cur_slug,next_slug,routes);
        await this.custom_componentDidMount();
    }


    async custom_componentDidMount()
    {
        let slug_parameter_test = localStorage.getItem("set_next_ceo_slug");
        var original_slug_test = await slug_parameter_test.split("-").join(" ");

        const res = await axios.post(FETCH_NODE_API_URL()+'all_people',{
            'slug':slug_parameter_test,
            'original':original_slug_test,
            'p_type':'3'
         });

            if(res.data.data.rows.length>0)
            {
                const res_obj = res.data.data.rows[0];

                      await this.setState({
                            name:res_obj.name,
                            job_title_other:res_obj.job_title_other,
                            bio:res_obj.bio,
                            title_slug:res_obj.name
                        });

                    //await this.next_and_previous_label();
                    let data_slug = "ourteam_ceo_page_slug"; 
                    let cur_index_number = "ourteam_ceo_c_i";
                    await this.props.n_and_p_label(data_slug,cur_index_number);
            }      
            else{
                    Router.pushRoute('/Error/PageNotFound').then(() => window.scrollTo(0, 0));
            } 

    }

    
    render() {
          
        const {name,job_title_other,bio,title_slug} = this.state;
        const {previous_label,next_label} = this.props;

        return (             
            <Layout title={title_slug+' - Aurora Capital Partners'}>

                <section className="cmn-banner">
                <div className="imgDiv web-view" style={{"backgroundImage":"url(/static/images/about-banner.jpg)"}}></div>
                <div className="imgDiv mob-view" style={{"backgroundImage":"url(/static/images/about-banner.jpg)"}}></div>
                </section>

                <section className="cmn-pull-top custom-wrap advisory-detail">
                <div className="fix-wrap">
                <a href="#" onClick={this.backurl} className="view-news"><img src="/static/images/back-arrow-2.png" width="7" alt="" /> <span>View all CEOs</span></a>
                
                    <div className="white-box">                  
                    <h2>{name}</h2>
                    <h6>{job_title_other}</h6>
                    {ReactHtmlParser(bio)} 
                    <div className="cnextprevious maxwidthmd">
                        {
                            previous_label &&
                            <span className="left-content"><a href="#" onClick={(e) => this.n_and_p_pagination(e, 'p')}>Previous</a></span>   
                        }

                        {
                            next_label &&
                            <span className="right-side-link"><a href="#" onClick={(e) => this.n_and_p_pagination(e, 'n')}>Next</a></span>
                        }
                        </div>
                    </div>
                </div>
                </section>
            </Layout>             
        );
      }
}

export default Hocnextpre(Aboutceodetail)
