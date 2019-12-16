import React, { Component } from 'react';
import axios from 'axios'; 
import ReactHtmlParser from 'react-html-parser';
import Layout from '../components/Layout';
import { Router } from '../routes';
import moment from "moment";
import localStorage from "localStorage";
import {FETCH_NODE_API_URL} from '../components/ServerApi';
import requiresAuth from '../components/requiresAuth';
import Hocnextpre from '../components/Hocnextpre';


class Portfoliodetail extends Component 
{
    constructor(props) {
        super(props)

        //const slug_parameter = 'vls-recovery-services';//this.props.url.query.slug;
        //const original_slug = 'vls recovery services';//slug_parameter.split("-").join(" ");
        var separate_url = this.props.url.asPath.split("/");

        this.state = {
            title:'',
            separate_url:separate_url,
            layout_title:'',
        };

        this.custom_componentDidMount = this.custom_componentDidMount.bind(this);
    }

    backurl(e)
    {
        e.preventDefault(); 
        Router.pushRoute('/Portfolio');
    }
    async componentDidMount()
    {
        var slug_parameter_test = '';
        var check_record = this.state.separate_url;
        slug_parameter_test = await check_record[2];
       
       var original_slug_test = await slug_parameter_test.split("-").join(" ");
       const res =await axios.post(FETCH_NODE_API_URL()+'get_portfolio_detail',{
                                  'slug':slug_parameter_test,
                                  'original':original_slug_test
                               });


        if(Object.keys(res.data.data).length>0)
        {

            const res_obj = res.data.data;
                await this.setState({
                content:res_obj.content,
                headquarters:res_obj.headquarters,
                investment_date:res_obj.investment_date,
                logo_image_link:res_obj.logo_image_link,
                title:res_obj.title,
                website_url:res_obj.website_url,
                layout_title:res_obj.title
            });
            //await this.next_and_previous_label();
            let data_slug = "portfolio_page_slug"; 
            let cur_index_number = "portfolio_c_i";
            await this.props.n_and_p_label(data_slug,cur_index_number);
        }      
        else{
            Router.pushRoute('/Error/PageNotFound').then(() => window.scrollTo(0, 0));
        }    

    }

    async custom_componentDidMount()
    {
        let slug_parameter_test = localStorage.getItem("set_next_index_slug");
        var original_slug_test = await slug_parameter_test.split("-").join(" ");

        const res =await axios.post(FETCH_NODE_API_URL()+'get_portfolio_detail',{
            'slug':slug_parameter_test,
            'original':original_slug_test
         });


            if(Object.keys(res.data.data).length>0)
            {

            const res_obj = res.data.data;
                    await this.setState({
                    content:res_obj.content,
                    headquarters:res_obj.headquarters,
                    investment_date:res_obj.investment_date,
                    logo_image_link:res_obj.logo_image_link,
                    title:res_obj.title,
                    website_url:res_obj.website_url,
                    layout_title:res_obj.title
                 });

                //await this.next_and_previous_label();

                let data_slug = "portfolio_page_slug"; 
                let cur_index_number = "portfolio_c_i";
                await this.props.n_and_p_label(data_slug,cur_index_number);
            }      
            else{
                    Router.pushRoute('/Error/PageNotFound').then(() => window.scrollTo(0, 0));
            } 
    }

    async n_and_p_pagination(e,status)
    {
        e.preventDefault();
        let cur_index = "portfolio_c_i";
        let cur_slug = "portfolio_page_slug";
        let next_slug = "set_next_index_slug";
        let routes = '/Portfolio/';

        await this.props.n_and_p_pagination_hoc(status,cur_index,cur_slug,next_slug,routes);
        await this.custom_componentDidMount();
    }

    
    render() {

      const {  
              title,
              content,
              headquarters,
              investment_date,
              website_url,
              logo_image_link,
              //original_slug,
              layout_title,
            } = this.state;


        const year = moment(investment_date).format("YYYY");
        const month_number = moment(investment_date).format("MM");
        const month_name = moment().month(month_number-1).format("MMMM");

        const {previous_label,next_label} = this.props;
        
        return (  
            <React.Fragment>
                {
                     <Layout title={layout_title+' - Aurora Capital Partners'}>                
                        <section className="cmn-banner">
                        <div className="imgDiv web-view" style={{"backgroundImage":"url(/static/images/portfolio-banner.jpg)"}}></div>
                        <div className="imgDiv mob-view" style={{"backgroundImage":"url(/static/images/portfolio-banner.jpg)"}}></div>
                        </section>
                        <section className="cmn-pull-top">
                        <div className="fix-wrap">
                        <a href="#" onClick={this.backurl} className="view-news"><img src="/static/images/back-arrow-2.png" width="7" alt="" /> <span>View all Portfolio</span></a>
                        <div className="white-box portfolio-detail">
                        <div>
                            {
                                previous_label && 
                                <span className="left-content"><a href="#" onClick={(e) => this.n_and_p_pagination(e, 'p')}>Previous</a></span>
                            }

                            {
                                next_label &&
                                <span className="right-side-link"><a href="#" onClick={(e) => this.n_and_p_pagination(e, 'n')}>Next</a></span>
                            }
                        </div> 
                            
                        <div className="left-img">
                        <img src={logo_image_link} alt="" />
                        </div>                
                        <div className="right-content">
                        <h2>{title}</h2>
                        {ReactHtmlParser(content)}  

                        <div className="folio-connect">
                            <ul className="cmn-list">
                                <li><strong>Date of Investment:</strong> {month_name} {year}</li>
                                <li><strong>Headquarters:</strong> {headquarters}</li>
                                <li><strong>Website:</strong> <a href={website_url}>{website_url}</a></li>
                                <li><strong>Share:</strong> &nbsp; <a href="#"><img src="/static/images/linkedin-logo.png" width="19" alt="" /></a></li>
                            </ul>
                        </div>

                        </div>
                        </div>
                        </div>
                        </section>
                    </Layout>
                }
            </React.Fragment>
        );
      }
}

export default requiresAuth(Hocnextpre(Portfoliodetail))
