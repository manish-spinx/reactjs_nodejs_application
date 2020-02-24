import React, { Component } from 'react';
import axios from 'axios'; 
import { Router } from '../routes';
import ReactHtmlParser from 'react-html-parser';
import Layout from '../components/Layout';
import localStorage from "localStorage";
import {FETCH_NODE_API_URL,PORTFOLIO_LOGO_URL} from '../components/ServerApi';
import Hocnextpre from '../components/Hocnextpre';
import FadeIn from 'react-fade-in';
const server_link = PORTFOLIO_LOGO_URL();//process.env.PORTFOLIO_LOGOO; 

class Teamdetail extends Component 
{
    constructor(props) {
        super(props)

        //const slug_parameter = this.props.url.query.slug;
        //const original_slug = slug_parameter.split("-").join(" ");

        var separate_url = this.props.url.asPath.split("/");

        this.state = {
            name:'',
            //slug_parameter:slug_parameter,
            //original_slug:original_slug,
            separate_url : separate_url,
            title_slug:'',
            portfolio_slider:[],
        };
        
        this.detail_page = this.detail_page.bind(this);

        //this.next_and_previous_pagination = this.next_and_previous_pagination.bind(this);
        this.custom_componentDidMount = this.custom_componentDidMount.bind(this); 
        //this.next_and_previous_label = this.next_and_previous_label.bind(this);   

    }

    detail_page(e)
    {
        e.preventDefault();  
        const title_name = e.target.alt;
        var small_character = title_name.toLowerCase();
        var dynamic_slug = small_character.replace(/\s+/g, '-');        
        Router.pushRoute('/portfolio/'+dynamic_slug).then(() => window.scrollTo(0, 0));
       
    }

    backurl(e)
    {
        e.preventDefault();  
        Router.pushRoute('/About/OurTeam');
    }

    async componentDidMount()
    {
        //const slug_parameter = this.state.slug_parameter;//this.props.url.query.slug;
        //const original_slug = this.state.original_slug;//slug_parameter.split("-").join(" ");

        var check_record = this.state.separate_url;
        var slug_parameter_test = await check_record[3];
        var original_slug_test = await slug_parameter_test.split("-").join(" ");

        const res = await axios.post(FETCH_NODE_API_URL()+'all_people',{
                                  'slug':slug_parameter_test,
                                  'original':original_slug_test,
                                  'p_type':'1',
                                  'get_portfolio':'1',
                               });

            if(res.data.data.rows.length>0)                   
            {
                const res_obj = res.data.data.rows[0];
                await this.setState({
                    name:res_obj.name,
                    job_title_other:res_obj.job_title_name,
                    bio:res_obj.bio,
                    profile_image_link:res_obj.profile_image_link,
                    title_slug:res_obj.name,
                    portfolio_slider:res_obj.portfolio_image_obj
                });

                //await this.next_and_previous_label();
                let data_slug = "ourteam_main_page_slug"; 
                let cur_index_number = "ourteam_main_c_i";
                await this.props.n_and_p_label(data_slug,cur_index_number);
            }      
            else{
                Router.pushRoute('/Error/PageNotFound').then(() => window.scrollTo(0, 0));
            }
    }

    async n_and_p_pagination(e,status)
    {
        e.preventDefault();
        let cur_index = "ourteam_main_c_i";
        let cur_slug = "ourteam_main_page_slug";
        let next_slug = "set_next_main_slug";
        let routes = '/About/OurTeam/';

        await this.props.n_and_p_pagination_hoc(status,cur_index,cur_slug,next_slug,routes);
        await this.custom_componentDidMount();
    }

    // async next_and_previous_pagination(e,status)
    // {
    //     e.preventDefault(); 

    //     let current_index = localStorage.getItem("ourteam_main_c_i");
    //     let next_index = '';
    //     if(status=='n')
    //     {
    //        // next
    //        next_index = parseInt(current_index)+parseInt(1);
    //     }
    //     else{
    //        // previous
    //        next_index = parseInt(current_index)-parseInt(1);
    //     }
        
    //     let slug_url_array = JSON.parse(localStorage.getItem("ourteam_main_page_slug"));
    //     let set_next_index_slug = slug_url_array[next_index];

    //     Router.pushRoute('/About/OurTeam/'+set_next_index_slug).then(() => window.scrollTo(0, 0));

    //     localStorage.setItem("ourteam_main_c_i",next_index);
    //     localStorage.setItem("set_next_main_slug",set_next_index_slug);

    //     await this.custom_componentDidMount();

    // }

    async custom_componentDidMount()
    {
        let slug_parameter_test = localStorage.getItem("set_next_main_slug");
        var original_slug_test = await slug_parameter_test.split("-").join(" ");

        const res = await axios.post(FETCH_NODE_API_URL()+'all_people',{
            'slug':slug_parameter_test,
            'original':original_slug_test,
            'p_type':'1',
            'get_portfolio':'1',
         });

            if(res.data.data.rows.length>0)
            {
                const res_obj = res.data.data.rows[0];

                await this.setState({
                    name:res_obj.name,
                    job_title_other:res_obj.job_title_name,
                    bio:res_obj.bio,
                    profile_image_link:res_obj.profile_image_link,
                    title_slug:res_obj.name,
                    portfolio_slider:res_obj.portfolio_image_obj
                });

                //await this.next_and_previous_label();
                let data_slug = "ourteam_main_page_slug"; 
                let cur_index_number = "ourteam_main_c_i";
                await this.props.n_and_p_label(data_slug,cur_index_number);
            }      
            else{
                    Router.pushRoute('/Error/PageNotFound').then(() => window.scrollTo(0, 0));
            } 

    }

    // async next_and_previous_label()
    // {
    //     // below logic to hide next and previous page

    //     let slug_url_array = JSON.parse(localStorage.getItem("ourteam_main_page_slug"));
    //     let total_array_length = slug_url_array.length;
    //     let index_number = parseInt(localStorage.getItem("ourteam_main_c_i"))+parseInt(1);

    //       if(index_number==total_array_length)
    //       {
    //         await this.setState({
    //                 next_label:false,
    //         });
    //       }
    //       else{

    //         await this.setState({
    //                 next_label:true,
    //             });
    //       }

    //       if(localStorage.getItem("ourteam_main_c_i")<=0)
    //       {
    //         await this.setState({
    //                 previous_label:false,
    //             });
    //       }
    //       else{

    //         await this.setState({
    //             previous_label:true,
    //         });
    //       }
    // }
    
    render() {
           const {
                  name,
                  bio,
                  job_title_other,
                  profile_image_link,
                  title_slug,
                  portfolio_slider,
                } = this.state;

            const {previous_label,next_label} = this.props;

        return (             
            <Layout title={title_slug+' - Aurora Capital Partners'}>
                <section className="cmn-banner">
                <div className="imgDiv web-view" style={{"backgroundImage":"url(/static/images/about-banner.jpg)"}}></div>
                <div className="imgDiv mob-view" style={{"backgroundImage":"url(/static/images/about-banner.jpg)"}}></div>
                </section>

                <section className="cmn-pull-top team-detail-wrap">
                <div className="fix-wrap">
                <a href="#" onClick={this.backurl} className="view-news"><img src="/static/images/back-arrow-2.png" width="7" alt="" /> <span>View all Team</span></a>                
                <div className="white-box">                   
                <div className="left-img">
                <img src={profile_image_link} alt="" />
                </div>
                
                <div className="right-content">
                <h2 className="team-title">{name}</h2>
                <h6>Partner</h6>
                {ReactHtmlParser(bio)}
                </div>

                    {
                        portfolio_slider.length>0 &&
                        <div className="aie-list">
                            <h3>Aurora Investment Execution</h3>
                                <ul className="cmn-list logo-list">

                                    {
                                        portfolio_slider.map((item, key) =>{    
                                            return  <FadeIn delay={300} transitionDuration={500} key={item._id}><li key={item._id}><a href="#" onClick={this.detail_page}><img src={server_link+item.logo_image} alt={item.title} /></a></li></FadeIn>

                                        })
                                    }

                                </ul>
                        </div>

                    }                 

                </div>
                    <div className="cnextprevious">
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
                </section>

            </Layout>             
        );
      }
}

export default Hocnextpre(Teamdetail)
