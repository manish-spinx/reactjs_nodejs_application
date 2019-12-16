import crypto from "crypto";
import util from "util";
import async from "async";
import multiparty from "multiparty";
import fs from "fs";
import http from "http";
import url from "url";
import mysql from "mysql";
import jwt from "jsonwebtoken";
import md5 from "md5";
import dateTime from "date-time";
import path from "path";
import _ from'underscore';
import fileExtension from 'file-extension';
import moment from "moment";
import mongoose from 'mongoose';

import config from '../../config/global.js'
import ED from "../../services/encry_decry";
import DS from "../../services/date";
import mailer from '../../services/mailer';
import Uploaded from '../../services/uploader';

import Common from '../../services/common_function';

// Load Model Schema Dependencies
import UserSchema from "../models/User";
import JobtitleSchema from "../models/Jobtitle";
import ArticlesSchema from "../models/Articles";
import StrategiesSchema from "../models/Strategies";
import PortfolioSchema from "../models/Portfolio";
import PeopleSchema from "../models/Peoples";
import ContactusSchema from "../models/Contactus";
import PageSchema from "../models/Page";


// may be below variable is not required
const USER_PIC_PATH = './public/uploads/user/';
const STRATEGIES_ICON_PATH = './public/uploads/strategies_icon/';
const STRATEGIES_PIC_PATH = './public/uploads/strategies_image/';
const PORTFOLIO_PORT_PATH = './public/uploads/portfolio_logo/';
const PEOPLE_PIC_PATH = './public/uploads/people/';


var frontcontroller = {

all_strategies : function(req, res, next)
{ 
    async.waterfall([
            function (nextCall) 
            {
                var aggregateQuery = [];


                    //Stage 1    
                    aggregateQuery.push({
                            $match: {"status": 1}
                        });

                    //Stage 2
                    aggregateQuery.push({
                        $project: { 
                            "_id":1,
                            "name":1,
                            "status":1,
                            "updated_at":1,
                            "icon_image":1,
                            "strategy_image":1,
                            "content":1,
                        }
                    });
                    
                     // Stage 3
                    aggregateQuery.push({
                         $sort: {
                            updated_at: -1, 
                            }
                    });

                    
                    StrategiesSchema.aggregate(aggregateQuery, function (err, result) 
                        {
                            if (err) 
                            {
                                console.error(err);
                            }
                            else{
                                 var body = {};
                                 body.rows = result;
                                 nextCall(null, body,aggregateQuery)
                            }                            
                        });

            },
            function(body,query2, nextCall)
            {
                 _.map(body.rows,function (val, key) 
                {
                        if(val.strategy_image!='')
                        {
                            body.rows[key]['strategy_image_link'] = config.appHost_view_strategy_image+val.strategy_image;
                        }
                });


                  _.map(body.rows,function (val, key) 
                {
                        if(val.icon_image!='')
                        {
                            body.rows[key]['icon_image_link'] = config.appHost_view_icon_image+val.icon_image;
                        }
                });

                nextCall(null, body,query2);

            },
            function (body,query2, nextCall) {
                StrategiesSchema.count(query2, function (err, counts) 
                {
                    
                    var returnData = {
                        count: counts,
                        rows: body.rows,
                    }
                    nextCall(null, {
                        status: 1,
                        message: 'Listing',
                        data: returnData
                    });
                });
            }
        ],
            function (err, response) {
                if (err) {
                    return res.status(202).json({ success: '0', message: err,data:{}});   
                }
                return res.status(200).json(response);   
            }) 
 
},
get_portfolio_detail:function(req,res,next)
{

    const slug = req.body.slug;
    const title = req.body.original;

 
   const obj = {
                    $or: [
                           { 'title': { $regex: slug, $options: 'i' } },
                           { 'title': { $regex: title, $options: 'i' } },                   
                  ],
                  $and:[
                             {'status':1 }
                        ]
            };


    PortfolioSchema.find(obj).exec(function (err, result) 
    {
            if (err) {
                return nextCall({ "message": err });
            }

              const res_obj = {};    

              if(result.length>0)
              {
                    const res_value = result[0];
                    res_obj.title = res_value.title;
                    res_obj.logo_image = res_value.logo_image;
                    res_obj.p_type_history = res_value.p_type_history;
                    res_obj.p_type_industry = res_value.p_type_industry;
                    res_obj.p_type_software = res_value.p_type_software;
                    res_obj.content = res_value.content;
                    res_obj.investment_date = res_value.investment_date;
                    res_obj.headquarters = res_value.headquarters;
                    res_obj.website_url = res_value.website_url;
                    res_obj.status = res_value.status;
                    res_obj.updated_at = res_value.updated_at;
                    res_obj.created_at = res_value.created_at;
                    res_obj._id = res_value._id;

                     if(res_value.logo_image!='')
                     {
                        res_obj.logo_image_link = config.appHost_view_portfolio_logo+res_value.logo_image;
                     }
              }

             return res.status(200).json({data:res_obj,status:200,message:'listing'});
                    
    });


},
all_portfolio:function(req,res,next)
{
    async.waterfall([
        function (nextCall) 
        {

            var aggregateQuery = [];

                //Stage 1
                aggregateQuery.push({
                            $match: {"status": 1}
                        });
                
                //Stage 2
                aggregateQuery.push({
                    $project: { 
                        "_id":1,
                        "title":1,
                        "logo_image":1,
                        "p_type_history":1,
                        "p_type_industry":1,
                        "p_type_software":1,
                        "content":1,
                        "investment_date":1,
                        "headquarters":1,
                        "website_url":1,
                        "status":1,
                        "created_at":1,
                        "updated_at":1,         
                    }
                });
                
                // Stage 3
                aggregateQuery.push({
                        $sort: {
                        updated_at: -1, 
                        }
                });


                PortfolioSchema.aggregate(aggregateQuery, function (err, result) 
                    {
                        if (err) 
                        {
                            console.error(err);
                        }
                        else{
                                var body = {};
                                body.rows = result;
                                nextCall(null, body)
                        }                            
                    });

        },
        function(body,nextCall)
        {
             _.map(body.rows,function (val, key) 
                {
                        if(val.logo_image!='')
                        {
                            body.rows[key]['logo_image_link'] = config.appHost_view_portfolio_logo+val.logo_image;
                        }
                });

              nextCall(null, body);

        },
        function (body,nextCall) 
        {
            var returnData = {
                    rows: body.rows,
                }
                nextCall(null, {
                    status: 1,
                    message: 'Portfolio Listing',
                    data: returnData
                });
        },

    ],
        function (err, response) {
            if (err) {
                return res.status(202).json({ success: '0', message: err,data:{}});   
            }
            return res.status(200).json(response);   
        })
   
},
all_people:function(req,res,next)
{

    async.waterfall([
        function (nextCall) 
        {
            var aggregateQuery = [];
         
            if(req.body.p_type!='')
            {
                //Stage 1
                aggregateQuery.push({
                    $match: {"p_type":  parseInt(req.body.p_type)}
                });                
            }

            if(req.body.original!=undefined)
            {
                //Stage 2
                aggregateQuery.push({
                    $match: {"name":  { $regex: req.body.original, $options: 'i' }}
                });                
            }

            if(req.body.search_job_title!=undefined && req.body.search_job_title!="0")
            {
                //Stage 3
                aggregateQuery.push({
                    //$match: {"name":  { $regex: req.body.search_job_title, $options: 'i' }}
                     $match: {"job_id": mongoose.Types.ObjectId(req.body.search_job_title)}

                });                
            }

            //Stage 4
            aggregateQuery.push({
                            $match: {"status": 1}
                        });
                            
                
            if(parseInt(req.body.p_type)==1)
            {
                // Stage 5
                 aggregateQuery.push({
                    $lookup: {
                        from: 'tbl_job_titles',
                        localField: 'job_id',
                        foreignField: '_id',
                        as: 'title_job'
                    }
                });
            }    

              const field_obj = { 
                        "_id":1,
                        "name":1,
                        "bio":1,
                        "p_type":1,
                        "status":1,        
                        "job_title_other":1,                
                        "created_at":1,
                        "updated_at":1,
                        "job_id":1,
                        "profile_image":1,
                        "portfolios":1,

                    }
              
                 if(parseInt(req.body.p_type)==1)
                 {
                    field_obj.job_title_name="$title_job.name";
                 } 

                //Stage 6
                aggregateQuery.push({
                    $project: field_obj
                });
                
                
                PeopleSchema.aggregate(aggregateQuery, function (err, result) 
                    {
                        if (err) 
                        {
                            console.error(err);
                        }
                        else{
                                var body = {};
                                body.rows = result;
                                nextCall(null, body)
                        }                            
                    });

        },
        function(body,nextCall)
        {
              _.map(body.rows,function (val, key) 
                {
                        if(val.profile_image!='')
                        {
                            body.rows[key]['profile_image_link'] = config.appHost_view_people_image+val.profile_image;
                        }
                });

            nextCall(null, body)
        },
        function(body, nextCall)
        {

            if(req.body.get_portfolio!=undefined && body.rows.length>0)
            {
                _.map(body.rows,function (val, key) 
                {

                        PortfolioSchema.find({_id: {$in: val.portfolios}}).select({'logo_image':1,'title':1,'_id':1}).exec(function(err, res){

                              if(err)
                              {
                                console.log('--------fail---------');
                              }
                              else{

                                    body.rows[key]['portfolio_image_obj'] = res;
                                    nextCall(null, body)
                              }   
                        });
                        
                });
            }    
            else{
                  nextCall(null, body)
            }

        },
        function (body,nextCall) {
            var returnData = {
                    rows: body.rows,
                }

                nextCall(null, {
                    status: 1,
                    message: 'People Listing',
                    data: returnData
                });
        },

    ],
        function (err, response) {
            if (err) {
                return res.status(202).json({ success: '0', message: err,data:{}});   
            }
            return res.status(200).json(response);   
        })


},
all_job_title:function(req,res,next)
{
    async.waterfall([
        function (nextCall) 
        {
                var aggregateQuery = [];

                //Stage 1
                aggregateQuery.push({
                            $match: {"status": 1}
                        });

                //Stage 2
                aggregateQuery.push({
                    $project: { 
                        "_id":1,
                        "name":1,
                        "staus":1,
                        "updated_at":1,
                    }
                });                
                
                
                JobtitleSchema.aggregate(aggregateQuery, function (err, result) 
                    {
                        if (err) 
                        {
                            console.error(err);
                        }
                        else{

                                var body = {};
                                body.rows = result;
                                nextCall(null, body,aggregateQuery)
                        }                            
                    });

        },
        function (body,query2, nextCall) {

             var returnData = {                   
                    rows: body.rows,
                }
                nextCall(null, {
                    status: 1,
                    message: 'Listing',
                    data: returnData
                });
            
        }
    ],
        function (err, response) {
            if (err) {
                return res.status(202).json({ success: '0', message: err,data:{}});   
            }
            return res.status(200).json(response);   
        }) 

},
all_news:function(req,res,next)
{
        async.waterfall([
            function (nextCall) 
            {
               
                var aggregateQuery = [];               

                    //Stage 1
                    if(req.body.original!=undefined)
                    {
                        aggregateQuery.push({
                            $match: {"slug": { $regex: req.body.slug, $options: 'i' }}
                        });
                    }

                    //Stage 2
                    aggregateQuery.push({
                            $match: {"status": 1}
                        });

                    //Stage 3
                    aggregateQuery.push({
                        $project: { 
                            "_id":1,
                            "title":1,
                            "content":1,
                            "status":1,
                            "dateofarticle":1,
                            "created_at":1,
                            "updated_at":1, 
                            "slug":1,        
                        }
                    });
                    
                    // Stage 4
                    aggregateQuery.push({
                            $sort: {
                            dateofarticle: -1, 
                            }
                    });


                    // Stage 5
                    if(req.body.limit!=undefined)
                    {
                        aggregateQuery.push({
                            $skip: 0
                          });

                        aggregateQuery.push({
                            $limit: Number(req.body.limit)
                        });
                    }


                    ArticlesSchema.aggregate(aggregateQuery, function (err, result) 
                        {
                            if (err) 
                            {
                                console.error(err);
                            }
                            else{
                                    var body = {};
                                    body.rows = result;
                                    nextCall(null, body)
                            }                            
                        });

            },
            function (body,nextCall) {

                var returnData = {
                        rows: body.rows,
                    }
                    nextCall(null, {
                        status: 1,
                        message: 'Articles Listing',
                        data: returnData
                    });               
            },
        ],
            function (err, response) {
                if (err) {
                    return res.status(202).json({ success: '0', message: err,data:{}});   
                }
                return res.status(200).json(response);   
            })


},
all_news_pagination:function(req,res,next)
{
    async.waterfall([
            function (nextCall) 
            {
                if(req.body.page!=undefined)
                {
                    var numPerPage = 4;
                    var page = parseInt(req.body.page)-parseInt(1);//parseInt(req.body.page, 10) || 0;
                    var numPages;
                    var skip = page * numPerPage;
                }
               
                var aggregateQuery = [];               

                    //Stage 1
                    if(req.body.original!=undefined)
                    {
                        aggregateQuery.push({
                            $match: {"slug": { $regex: req.body.slug, $options: 'i' }}
                        });
                    }

                    //Stage 2
                    aggregateQuery.push({
                            $match: {"status": 1}
                        });

                    //Stage 3
                    aggregateQuery.push({
                        $project: { 
                            "_id":1,
                            "title":1,
                            "content":1,
                            "status":1,
                            "dateofarticle":1,
                            "created_at":1,
                            "updated_at":1, 
                            "slug":1,        
                        }
                    });
                    
                    // Stage 4
                    aggregateQuery.push({
                            $sort: {
                                dateofarticle: -1, 
                            }
                    });

                   if(req.body.page!=undefined)
                   {
                        //Stage 4
                         aggregateQuery.push({
                            $skip: Number(skip)
                        });
                       
                         // Stage 5
                         aggregateQuery.push({
                            $limit: Number(numPerPage)
                        });
                   }


                    ArticlesSchema.aggregate(aggregateQuery, function (err, result) 
                        {
                            if (err) 
                            {
                                console.error(err);
                            }
                            else{
                                    var body = {};
                                    body.rows = result;
                                    nextCall(null, body,aggregateQuery)
                            }                            
                        });

            },
            function (body,aggregateQuery,nextCall) {

                 ArticlesSchema.count(aggregateQuery, function (err, counts) 
                    {
                        
                        var returnData = {
                            count: counts,
                            rows: body.rows,
                        }
                        nextCall(null, {
                            status: 1,
                            message: 'User Listing',
                            data: returnData
                        });
                    });


                // var returnData = {
                //         rows: body.rows,
                //     }
                //     nextCall(null, {
                //         status: 1,
                //         message: 'Articles Listing',
                //         data: returnData
                //     }); 

            },
        ],
            function (err, response) {
                if (err) {
                    return res.status(202).json({ success: '0', message: err,data:{}});   
                }
                return res.status(200).json(response);   
            })

},
news_detail:function(req,res,next)
{

    // const obj_search = {
    //                         "$or": [{
    //                             "title": { $regex: new RegExp("^" + req.body.slug, "i") }
    //                         }, {
    //                             "title": { $regex: new RegExp("^" + req.body.original, "i") }
    //                         }]
    //                     }


    // const obj = { "title": { "$regex": req.body.original, "$options": "i" } };
    //const obj = {"title": { $regex: "market track llc expands e commerce offerings", $options: 'i' }};

//    db.cities.find(
//   { city: 'new york' }
// ).collation(
//   { locale: 'en', strength: 2 }
// );
                    

    //const obj = {"title":"market track llc expands e commerce offerings"};
     // ArticlesSchema.find(obj).collation({ locale: 'en', strength: 2 }).exec(function (err, res) {
     //                if (err) {
     //                    return nextCall({ "message": err });
     //                }
                  
     //                console.log('-------------');
     //                console.log(res);

     //            });


},
inquiry_add:function(req,res,next)
{
      async.waterfall([
        function(nextCall) { 
             req.checkBody('name', 'Name is required').notEmpty();
             var error = req.validationErrors();
             if (error && error.length) {
                 return nextCall({ message: error});
             }
             nextCall(null, req.body);
         },
         function(body, nextCall)
         {
            var html = 'Hi '+body.name+',<br/>';
            html+='Thank you for Contact us. Our Team contact you as soon as possible'+'<br/><br/>';
            html+='Thanks,'+'<br/>';
            html+='Spinx Digital Team';

            var pass_obj = {
                    'to':body.email,
                    'from':'no-reply@spinxdigital.com',
                    'subject':'Thank you For Contact Us',
                    'html':html
                }

                 mailer.mail(pass_obj,function(err,res){
                if(err)
                {
                    //console.log('............check error for send email..........');
                    return nextCall({ "status": 200, "message": "Email not send successfully"});
                }
                else{
                     nextCall(null, req.body);
                }   });

         },
         function (body, nextCall) {
               
              var insert_obj = {
                  'name':body.name,
                  'email':body.email,
                  'phone':body.phone,
                  'message':body.message
              }
          
             var contact_us_obj = new ContactusSchema(insert_obj);

             contact_us_obj.save(function (error, result) {
                 if (error) {
                     return nextCall({ "message": error });
                 }
                 nextCall(null, {
                     status: 200,
                     message: 'Contact added succesfully.',
                     data: {}
                 });

             });
         }
     ], function(err, response) {
         if (err) {
            return res.status(202).json({ success: '0', message: err,data:{}});   
         }
      
         return res.status(200).json(response);   
     });

},
register:function(req,res,next)
{
    async.waterfall([
        function(nextCall) { // check required parameters
                req.checkBody('email', 'Email is required').notEmpty(); // Name is required

                var error = req.validationErrors();
                if (error && error.length) {
                    return nextCall({ message: error[0].msg });
                }
                nextCall(null, req.body);
            },
            function(body, nextCall)
            {

                    const obj = {"email":body.email}

                    UserSchema.find(obj).exec(function (err, result) 
                    {
                        if (err) {
                            return nextCall({ "message": err });
                        }

                         if(!Common.check_obj_empty(result))
                         {
                                nextCall({ message: 'This Email Id Already Exists.' });
                         }
                         else{
                               nextCall(null,body);
                         }
                    });

            },
            function (body, nextCall) {
                
                body.name = body.name;
                body.email = body.email;
                body.password = body.password;
                body.status = '1';
                body.dateofjoin = new Date();

                var user = new UserSchema(body);

                user.save(function (error, result) {
                    if (error) {
                        return nextCall({ "message": error });
                    }
                    
                    nextCall(null, {
                        status: 200,
                        message: 'User add succesfully.',
                        data: {}
                    });

                });
            }
        ], function(err, response) {
            if (err) {
            return res.status(202).json({ success: '0', message: err,data:{}});   
            }

            return res.status(200).json({ success: '1',data:response});   
        });

},
front_update_profile:function(req,res,next)
{
    async.waterfall([
        function(nextCall) { // check required parameters
                req.checkBody('email', 'Email is required').notEmpty(); // Name is required

                var error = req.validationErrors();
                if (error && error.length) {
                    return nextCall({ message: error[0].msg });
                }
                nextCall(null, req.body);
            },
            function (body, nextCall) {
 
                let email = body.email;
                var aggregateQuery = [];
                //Stage 1
                aggregateQuery.push({
                    $match: {
                        _id: {$ne: mongoose.Types.ObjectId(req.body.user_id)},
                        email:email

                    }
                });

                //Stage 2
                aggregateQuery.push({
                    $project: { 
                        "_id":"$_id",
                        "name":"$name",
                        "mobile":"$mobile",
                        "email":"$email",
                        "status":"$status",                                
                        "created_at":"$created_at",
                        "updated_at":"$updated_at",
                        "profile_image":"$profile_image",
                    }
                });

                 UserSchema.aggregate(aggregateQuery, function (err, result) 
                    {
                        if (err) 
                        {
                            console.error(err);
                        }
                        else{

                                  if(!Common.check_obj_empty(result))
                                  {
                                     nextCall({ message: 'This Email Id Already Exists.' });
                                  }
                                  else{
                                        nextCall(null,body);
                                  }
                        }                            
                    });
            },
            function(body,nextCall)
            {
                const update_user_id = body.user_id;
            
                var postData = {
                            'email':body.email,
                            'name': body.name,
                    }
                
                    UserSchema.findOneAndUpdate(
                    { 
                        "_id": update_user_id
                    }, 
                    { 
                        $set: postData 
                    }, 
                    function (error, results) 
                    {
                        if (error) {
                            console.log(error);
                        }
                        else{
                            nextCall(null, {
                                    status: 1,
                                    message: 'User Updated successfully.',
                                    data: results
                                });
                        }
                });

            }

        ], function(err, response) {
            if (err) {
            return res.status(202).json({ success: '0', message: err,data:{}});   
            }

            return res.status(200).json({ success: '1',data:response});   
        });

}

};

module.exports = frontcontroller;