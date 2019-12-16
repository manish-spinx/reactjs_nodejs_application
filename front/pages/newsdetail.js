import React, { Component } from 'react';
import axios from 'axios'; 
import ReactHtmlParser from 'react-html-parser';
import localStorage from "localStorage";
import ErrorPage from './_error';
import Layout from '../components/Layout';
import { Router } from '../routes';
import {FETCH_NODE_API_URL} from '../components/ServerApi';
import Hocnextpre from '../components/Hocnextpre';

class Newsdetail extends Component 
{
    constructor(props) {
        super(props)

        var separate_url = this.props.url.asPath.split("/");

        this.state = {
            api_data:[],
            title:'',
            title_slug:'Aurora Capital Partners',
            separate_url : separate_url,
            res_check:[],
        };

        //this.next_and_previous_pagination = this.next_and_previous_pagination.bind(this);
        this.custom_componentDidMount = this.custom_componentDidMount.bind(this); 
        //this.next_and_previous_label = this.next_and_previous_label.bind(this);   
        
    }

    backurl(e)
    {
        e.preventDefault();  
        Router.pushRoute('/News');
    }

    async componentDidMount()
    {
        //const slug_parameter = 'industrial-container-services-llc-acquires-pa';//this.props.url.query.slug;
        //const original_slug = 'industrial container services llc acquires pa';//slug_parameter.split("-").join(" ");

       var check_record = this.state.separate_url;
       var slug_parameter_test = await check_record[2];
       var original_slug_test = await slug_parameter_test.split("-").join(" ");

        const res = await axios.post(FETCH_NODE_API_URL()+'all_news',{
                                  'slug':slug_parameter_test,
                                  'original':original_slug_test,                                  
                               });


            if(res.data.data.rows.length>0)
            {
                const res_obj = res.data.data.rows[0];

                await this.setState({
                    title:res_obj.title,
                    content:res_obj.content,   
                    title_slug:res_obj.title,
                    res_check : res.data.data.rows
                });
                //await this.next_and_previous_label();
                let data_slug = "news_details_page_slug"; 
                let cur_index_number = "news_details_c_i";
                await this.props.n_and_p_label(data_slug,cur_index_number);
            }  
            else{
                Router.pushRoute('/Error/PageNotFound').then(() => window.scrollTo(0, 0));
            }    
    }


    async n_and_p_pagination(e,status)
    {
        e.preventDefault();
        let cur_index = "news_details_c_i";
        let cur_slug = "news_details_page_slug";
        let next_slug = "set_next_news_details_slug";
        let routes = '/News/';

        await this.props.n_and_p_pagination_hoc(status,cur_index,cur_slug,next_slug,routes);
        await this.custom_componentDidMount();
    }

    // async next_and_previous_pagination(e,status)
    // {
    //     e.preventDefault(); 

    //     let current_index = localStorage.getItem("news_details_c_i");
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
        
    //     let slug_url_array = JSON.parse(localStorage.getItem("news_details_page_slug"));
    //     let set_next_index_slug = slug_url_array[next_index];

    //     Router.pushRoute('/News/'+set_next_index_slug).then(() => window.scrollTo(0, 0));

    //     localStorage.setItem("news_details_c_i",next_index);
 
    //      //console.log('check next slug : '+set_next_index_slug);

    //     localStorage.setItem("set_next_news_details_slug",set_next_index_slug);
    //     await this.custom_componentDidMount();

    // }

    async custom_componentDidMount()
    {
        let slug_parameter_test = localStorage.getItem("set_next_news_details_slug");
        var original_slug_test = await slug_parameter_test.split("-").join(" ");

        const res = await axios.post(FETCH_NODE_API_URL()+'all_news',{
            'slug':slug_parameter_test,
            'original':original_slug_test,                                  
         });

         if(res.data.data.rows.length>0)
         {
             const res_obj = res.data.data.rows[0];

             await this.setState({
                 title:res_obj.title,
                 content:res_obj.content,   
                 title_slug:res_obj.title,
                 res_check : res.data.data.rows
             });

            //await this.next_and_previous_label();
            let data_slug = "news_details_page_slug"; 
            let cur_index_number = "news_details_c_i";
            await this.props.n_and_p_label(data_slug,cur_index_number);
         }  
         else{
             Router.pushRoute('/Error/PageNotFound').then(() => window.scrollTo(0, 0));
         } 
    }

    // async next_and_previous_label()
    // {
    //     // below logic to hide next and previous page

    //     let slug_url_array = JSON.parse(localStorage.getItem("news_details_page_slug"));
    //     let total_array_length = slug_url_array.length;
    //     let index_number = parseInt(localStorage.getItem("news_details_c_i"))+parseInt(1);

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

    //       if(localStorage.getItem("news_details_c_i")<=0)
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
            const {title,content,title_slug,res_check} = this.state;
            const {previous_label,next_label} = this.props;

        return (             
            <Layout title={title_slug+' - Aurora Capital Partners'}>
                <section className="cmn-banner">
                <div className="imgDiv web-view" style={{"backgroundImage":"url(/static/images/news-banner.jpg)"}}></div>
                <div className="imgDiv mob-view" style={{"backgroundImage":"url(/static/images/news-banner.jpg)"}}></div>
                </section>

                <section className="cmn-pull-top custom-wrap">
                <div className="fix-wrap">
                <a href="#" onClick={this.backurl} className="view-news"><img src="/static/images/back-arrow-2.png" width="7" alt="" /> <span>View all News</span></a>
                <div className="white-box">
                    {
                        previous_label &&
                        <span className="left-content"><a href="#" onClick={(e) => this.n_and_p_pagination(e, 'p')}>Previous</a></span>   
                    }

                    {
                        next_label &&
                        <span className="right-side-link"><a href="#" onClick={(e) => this.n_and_p_pagination(e, 'n')}>Next</a></span>
                    }
                <h2>{title}</h2>
                  {ReactHtmlParser(content)}

                </div>
                </div>
                </section>

            </Layout>             
        );
      }
}

export default Hocnextpre(Newsdetail)
