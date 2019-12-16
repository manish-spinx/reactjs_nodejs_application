import React, { Component } from 'react';
import axios from 'axios'; 
import ReactHtmlParser from 'react-html-parser';
import localStorage from "localStorage";
import { Router } from '../routes';

const Hocnextpre = (OriginalComponent)=>{  


class Hocnextpre extends React.Component
{
    
    constructor(props)
    {
        super(props)
            
        this.state = {
            count:0,
            next_label:false,
            previous_label:false,
        }

        this.n_and_p_label = this.n_and_p_label.bind(this);
    }

    async n_and_p_pagination_hoc(status,cur_index,cur_slug,next_slug,routes)
    {
        let current_index = localStorage.getItem(cur_index);
        let next_index = '';
        if(status=='n')
        {
           // next
           next_index = parseInt(current_index)+parseInt(1);
        }
        else{
           // previous
           next_index = parseInt(current_index)-parseInt(1);
        }
        
        let slug_url_array = JSON.parse(localStorage.getItem(cur_slug));
        let set_next_index_slug = slug_url_array[next_index];
        Router.pushRoute(routes+set_next_index_slug).then(() => window.scrollTo(0, 0));
        localStorage.setItem(cur_index,next_index);
        localStorage.setItem(next_slug,set_next_index_slug);
    }


    async n_and_p_label(data_slug,cur_index_number)
    {
        let slug_url_array = JSON.parse(localStorage.getItem(data_slug));
        let total_array_length = slug_url_array.length;
        let index_number = parseInt(localStorage.getItem(cur_index_number))+parseInt(1);

          if(index_number==total_array_length)
          {
            await this.setState({
                    next_label:false,
            });
          }
          else{

            await this.setState({
                    next_label:true,
                });
          }

          if(localStorage.getItem(cur_index_number)<=0)
          {
            await this.setState({
                    previous_label:false,
                });
          }
          else{

            await this.setState({
                previous_label:true,
            });
          }
    }

    async hoc_details_page(title_name,cur_index,cur_total,cur_array,routes,c_d_slug)
    {         
        var small_character = title_name.toLowerCase();
        var dynamic_slug = small_character.replace(/\s+/g, '-'); 
        let check_slug =  c_d_slug.includes(dynamic_slug);
        let check_slug_index = c_d_slug.indexOf(dynamic_slug);
        localStorage.setItem(cur_index,check_slug_index);
        localStorage.setItem(cur_total,(c_d_slug.length>0)?c_d_slug.length-1:c_d_slug.length);
        localStorage.setItem(cur_array,JSON.stringify(c_d_slug));        
        Router.pushRoute(routes+dynamic_slug).then(() => window.scrollTo(0, 0));
    }
         
    render()
    {
        return <OriginalComponent 
            count={this.state.count} 
            previous_label = {this.state.previous_label}
            next_label = {this.state.next_label}
            n_and_p_pagination_hoc = {this.n_and_p_pagination_hoc}
            n_and_p_label = {this.n_and_p_label}
            hoc_details_page = {this.hoc_details_page}
            {...this.props}
        />
    }
}

     return Hocnextpre; 
}

export default Hocnextpre;