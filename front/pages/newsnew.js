import React, { Component } from 'react';
import axios from 'axios'; 
import Layout from '../components/Layout';
import { Router } from '../routes';
import moment from "moment";
import localStorage from "localStorage";
import Pagination from "react-js-pagination";
import {FETCH_NODE_API_URL} from '../components/ServerApi';
import { Ring,Circle,Grid,Ripple,DualRing } from 'react-awesome-spinners'


export default class News extends Component 
{
    constructor(props) {
        super(props)

        this.state = {
            api_data:[], 
            activePage: 1,
            loading_flag:false,         
        };

        this.newdetail = this.newdetail.bind(this);
        this.handlePageChange = this.handlePageChange.bind(this);
        
    }

    newdetail(e)
    {
        e.preventDefault(); 
        const title_name = e.target.id;
        //Router.pushRoute('/News/'+title_name);
        Router.pushRoute('/News/'+title_name).then(() => window.scrollTo(0, 0));
    }

    async componentDidMount()
    {
        await this.setState({
            loading_flag:true
         });

        const res = await axios.post(FETCH_NODE_API_URL()+'all_news_pagination',{page:1});  
        if(res.data.data.rows.length>0)
        {
            //const first_data =  res.data.data.rows[0];
            //await delete res.data.data.rows[0];

            await this.setState({
                api_data : res.data.data.rows,
                f_title:'',//first_data.title,
                f_slug:'',//first_data.slug,
                f_dateofarticle:'',//moment(first_data.dateofarticle).format("MMM DD,YYYY")
                loading_flag:false
             });
        }
        else{

            const first_data =  [];
            await this.setState({
                api_data : res.data.data.rows,
                f_title:'',
                f_dateofarticle:'',
                loading_flag:false
             });
        }
       

    }

    async handlePageChange(pageNumber)
    {

        await this.setState({
            loading_flag:true
         });

          const res =await axios.post(FETCH_NODE_API_URL()+'all_news_pagination',{page:pageNumber});  
          if(res.data.data.rows.length>0)
          {
              //const first_data =  res.data.data.rows[0];
              //await delete res.data.data.rows[0];
  
              await this.setState({
                  api_data : res.data.data.rows,
                  f_title:'',//first_data.title,
                  f_slug:'',//first_data.slug,
                  f_dateofarticle:'',//moment(first_data.dateofarticle).format("MMM DD,YYYY")
                  activePage:pageNumber,
                  loading_flag:false
               });
          }
          else{
  
              const first_data =  [];
              await this.setState({
                  api_data : res.data.data.rows,
                  f_title:'',
                  f_dateofarticle:'',
                  loading_flag:false
               });
  
          }
    }
    
    render() {
        const {api_data,f_title,f_dateofarticle,f_slug,loading_flag} = this.state;
        return (   
            <React.Fragment>  
                <div>
                <Layout title='News - Aurora Capital Partners'>
                    <section className="cmn-banner page-title" >
                    <div className="imgDiv web-view" style={{"backgroundImage":"url(/static/images/news-banner.jpg)"}}></div>
                    <div className="imgDiv mob-view" style={{"backgroundImage":"url(/static/images/news-banner.jpg)"}}></div>
                    <div className="banner-title">
                    <h1>News</h1>
                    </div>
                    </section>

                    
                    <section className="clearfix news-grid">
                    <div className="fix-wrap">
                    <div className="grid" id="NewsGrid">
                        {
                            loading_flag &&
                            <DualRing />
                        }
                    
                    {
                        api_data.map((item, key) =>{

                            return <div className="grid-item" key={item._id}>
                                <div className="post-date">{moment(item.dateofarticle).format("MMM DD, YYYY")}</div>
                                    <h3>
                                    <a href="#" onClick={this.newdetail} id={item.slug} >{item.title}</a>
                                    </h3>
                            </div>

                        })
                    }

                    </div>
                    </div>
                    </section>               
                </Layout>     
       
              
                    <Pagination
                            activePage={this.state.activePage}
                            itemsCountPerPage={4}
                            totalItemsCount={32}
                            pageRangeDisplayed={5}
                            onChange={this.handlePageChange}
                    />
            </div>

        </React.Fragment>  
            
        );
      }
}
