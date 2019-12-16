import React, { Component } from 'react';
import axios from 'axios'; 
import ReactHtmlParser from 'react-html-parser';
import localStorage from "localStorage";
import { Router } from '../routes';
import Layout from '../components/Layout';
import {FETCH_NODE_API_URL} from '../components/ServerApi';
import Hocnextpre from '../components/Hocnextpre';

class Aboutadvisorsdetail extends Component 
{
    constructor(props) {
        super(props)

        //const slug_parameter = this.props.url.query.slug;
        //const original_slug = slug_parameter.split("-").join(" ");

        var separate_url = this.props.url.asPath.split("/");

        this.state = {
            api_data:[],
            //slug_parameter:slug_parameter,
            //original_slug:original_slug,
            separate_url : separate_url,
            title_slug:'',
        };

        //this.next_and_previous_pagination = this.next_and_previous_pagination.bind(this);
        this.custom_componentDidMount = this.custom_componentDidMount.bind(this); 
        //this.next_and_previous_label = this.next_and_previous_label.bind(this);  

    }

    backurl(e)
    {
        e.preventDefault();  
        Router.pushRoute('/About/Advisors');
    }

    async componentDidMount()
    {
        var check_record = this.state.separate_url;
        var slug_parameter_test = await check_record[3];
        var original_slug_test = await slug_parameter_test.split("-").join(" ");

        const res =await axios.post(FETCH_NODE_API_URL()+'all_people',{
                                  'slug':slug_parameter_test,
                                  'original':original_slug_test,
                                  'p_type':'2'
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
            let data_slug = "ourteam_advsr_page_slug"; 
            let cur_index_number = "ourteam_advsr_c_i";
            await this.props.n_and_p_label(data_slug,cur_index_number);
        }
        else{
            Router.pushRoute('/Error/PageNotFound').then(() => window.scrollTo(0, 0));
        }
    }

    async n_and_p_pagination(e,status)
    {
        e.preventDefault();
        let cur_index = "ourteam_advsr_c_i";
        let cur_slug = "ourteam_advsr_page_slug";
        let next_slug = "set_next_advsr_slug";
        let routes = '/About/Advisors/';

        await this.props.n_and_p_pagination_hoc(status,cur_index,cur_slug,next_slug,routes);
        await this.custom_componentDidMount();
    }

    // async next_and_previous_pagination(e,status)
    // {
    //     e.preventDefault(); 

    //     let current_index = localStorage.getItem("ourteam_advsr_c_i");
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
        
    //     let slug_url_array = JSON.parse(localStorage.getItem("ourteam_advsr_page_slug"));
    //     let set_next_index_slug = slug_url_array[next_index];

    //     Router.pushRoute('/About/Advisors/'+set_next_index_slug).then(() => window.scrollTo(0, 0));

    //     localStorage.setItem("ourteam_advsr_c_i",next_index);
    //     localStorage.setItem("set_next_advsr_slug",set_next_index_slug);

    //     await this.custom_componentDidMount();

    // }

    async custom_componentDidMount()
    {
        let slug_parameter_test = localStorage.getItem("set_next_advsr_slug");
        var original_slug_test = await slug_parameter_test.split("-").join(" ");

        const res =await axios.post(FETCH_NODE_API_URL()+'all_people',{
            'slug':slug_parameter_test,
            'original':original_slug_test,
            'p_type':'2'
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

                    let data_slug = "ourteam_advsr_page_slug"; 
                    let cur_index_number = "ourteam_advsr_c_i";
                    await this.props.n_and_p_label(data_slug,cur_index_number);

                    //await this.next_and_previous_label();
            }      
            else{
                    Router.pushRoute('/Error/PageNotFound').then(() => window.scrollTo(0, 0));
            } 

    }

    // async next_and_previous_label()
    // {
    //     // below logic to hide next and previous page

    //     let slug_url_array = JSON.parse(localStorage.getItem("ourteam_advsr_page_slug"));
    //     let total_array_length = slug_url_array.length;
    //     let index_number = parseInt(localStorage.getItem("ourteam_advsr_c_i"))+parseInt(1);

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

    //       if(localStorage.getItem("ourteam_advsr_c_i")<=0)
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
                    <a href="#" onClick={this.backurl} className="view-news"><img src="/static/images/back-arrow-2.png" width="7" alt="" /> <span>View all Advisors</span></a>
                    <div className="white-box">
                    {
                        previous_label &&
                        <span className="left-content"><a href="#" onClick={(e) => this.n_and_p_pagination(e, 'p')}>Previous</a></span>   
                    }

                    {
                        next_label &&
                        <span className="right-side-link"><a href="#" onClick={(e) => this.n_and_p_pagination(e, 'n')}>Next</a></span>
                    }
                        <h2>{name}</h2>
                        <h6>{job_title_other}</h6>
                          {ReactHtmlParser(bio)}
                        </div>
                    </div>
                </section>

            </Layout>             
        );
      }
}

export default Hocnextpre(Aboutadvisorsdetail)
