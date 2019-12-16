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


var usercontroller = {

login : function(req, res, next)
{ 
    async.waterfall([
        function(nextCall) { // check required parameters

            req.checkBody('email', 'Email is required').notEmpty(); // Name is required
            req.checkBody('password', 'Password is required').notEmpty(); // password is required

            if(req.body.email!='')
            {
                req.checkBody('email', 'Email is not a valid').isEmail();
            }
            
            var error = req.validationErrors();
            if (error && error.length) 
            {
                return nextCall({ message: error});
            }                
            nextCall(null, req.body);
        },
        function (body, nextCall) 
        {
            var check_password = md5(body.password);
            UserSchema.find({ 'email':body.email,'password': check_password}, function (err, user) {
                    
                if (err) {
                    return nextCall({ "message": err });
                }
                if (user.length > 0) {

                    if(user[0].status=='0')
                    {
                       return nextCall({ "status": 200, "message": "Your Account has been disabled" });
                    }
                    else{
                      nextCall(null, user[0]);    
                    }
                    
                } else {
                    return nextCall({ "status": 200, "message": "This email and password doesn't match." });
                }

            });
        },
        function(user, nextCall) {

            var jwtData = {
                _id: user._id,
                email: user.email,
                timestamp:DS.now()
            };

            // create a token
            const access_token = jwt.sign(jwtData, config.secret, {
                expiresIn: 60 * 60 * 24 // expires in 24 hours
            });

            UserSchema.findOneAndUpdate({ "_id": user._id }, { $set: { "access_token": access_token } }, function (error, results) {
                    if (error) {
                        console.log('LOGIN DEVICE TOKEN UPDATE ERROR:', error);
                    }

                    var data = {
                                '_id': results._id,
                                'name': results.name,
                                'mobile': results.mobile,
                                'email': results.email,
                                'created_at': results.created_at,
                                'updated_at': results.updated_at,
                                'access_token': access_token,
                            }

                    if(results.profile_image!='')
                    {
                        data.profile_image_link = config.appHost_view_user_image+results.profile_image;
                    }
                    else{
                        data.profile_image_link = '';
                    }   
                    nextCall(null, data);
                });
        },
        function(body, nextCall) {
            nextCall(null, {
                status: 1,
                message: 'Login successfully',
                data: body
            });
        }
    ], function(err, response) {
        if (err) 
        {
            console.log('Login Error', err);
            return res.status(202).json({ success: '0', message: err,data:{}});   
        }
        return res.status(200).json(response);   
    }); 

},
add_user : function(req, res, next)
{
    async.waterfall([
        function (nextCall) 
        {
                var form = new multiparty.Form();
                form.parse(req, function(err, fields, files) 
                {  
                    fields = fields || [];

                    for (var key in fields) {
                        if (fields[key].length === 1) {
                            fields[key] = fields[key][0];
                        }
                    }

                    req.body = fields;
                    req.files = files;

                    req.checkBody('email', 'Email is required').notEmpty(); // Name is required

                    if(req.body.email!='')
                    {
                        req.checkBody('email', 'Email is not a valid').isEmail();
                    }
                    
                    var error = req.validationErrors();
                    if (error && error.length) 
                    {
                        return nextCall({ message: error});
                    }                
                    nextCall(null, req.body,req.files);
                    
                });
        },
        function(new_array,files_array,nextCall)
        {

            const obj = {"email":new_array.email}

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
                       nextCall(null,new_array,files_array);
                 }
            });

        },
        function(new_array,files_array,nextCall)
        { 
            var update_record = {};

                //if(!isEmpty(files_array))
                if(!Common.check_obj_empty(files_array))
                {
                _.map(files_array['files'],function (val, key) 
                {

                    Uploaded.uploadFile(val,USER_PIC_PATH,function(err,res)
                    {
                        if(err)
                        {
                            console.log('--------error--------');
                            console.log(err);
                        }  
                        else{
                            update_record.image = res.filename;
                            nextCall(null, new_array,update_record);
                        }
                   });
    
                });

                }
                else{
                        update_record.image = '';
                        nextCall(null, new_array,update_record);
                }            
        },
        function(new_array,update_record,nextCall)
        {    

            var postData = {
                        'email':new_array.email,
                        'name':new_array.name,
                        'password':new_array.password,
                        'mobile': new_array.mobile,                
                        'profile_image': update_record.image,
                        'status':(new_array.status=='Active') ? '1':'0',
                        'dateofjoin':new_array.dateofjoin,
                        'address':new_array.address,
                        'hobby':new_array.hobby,
                        //'skills':(new_array.skills==undefined)?[]:JSON.parse(new_array.skills),                            
                        'role':new_array.role,
                        'your_post':new_array.content,                            
                        'new_idea':new_array.content_idea,
                };

                 if(new_array.skills!=='undefined')
                 {
                    postData.skills = JSON.parse(new_array.skills);
                 }

                var user = new UserSchema(postData);
                user.save(function (error, res) {
                        if(error)
                        {
                                console.log('--------error------');
                                console.log(error);
                        }
                        else{
                            nextCall(null, {
                                status: 1,
                                message: 'User added successfully.',
                                data: res
                            });
                        }
                        
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
edit_user : function(req, res, next){

    async.waterfall([
        function (nextCall) { // check required parameters

            req.checkBody('user_id', 'User id is required.').notEmpty();

            var error = req.validationErrors();
            if (error && error.length) {
                return nextCall({ message: error[0].msg });
            }
            nextCall(null, req.body);
        },
        function (body, nextCall) {

            const user_idd = body.user_id;
            UserSchema.find({ '_id': user_idd }, function (err, results) 
            {
                if (err) 
                {
                    nextCall({ message: 'Something went wrong.' });
                }
                    //if(isEmpty(results))
                    if(Common.check_obj_empty(results))
                    {
                        return nextCall({ message: 'User id is wrong.' });
                    } 
                    else{

                        const user_details = results[0];

                        var custom_obj = {};
                        custom_obj.email = user_details.email;
                        custom_obj.name = user_details.name;
                        custom_obj.mobile = user_details.mobile;
                        custom_obj.profile_image = user_details.profile_image;

                            if(user_details.profile_image!='')
                            {
                            custom_obj.profile_image_link = config.appHost_view_user_image+user_details.profile_image;
                            }
                            else{
                            custom_obj.profile_image_link = '';
                            }
                        
                        custom_obj.dateofjoin = user_details.dateofjoin;
                        custom_obj.address = user_details.address;
                        custom_obj.hobby = user_details.hobby;
                        custom_obj.skills = user_details.skills;
                        //custom_obj.skills_array = user_details.skills_array;
                        custom_obj.role = user_details.role;
                        custom_obj.your_post = user_details.your_post;
                        custom_obj.new_idea = user_details.new_idea;
                        custom_obj.status = user_details.status;
                        custom_obj._id = user_details._id;

                        return nextCall(null,custom_obj);
                    }
            });
        },
    ], function (err, response) {
        if (err) {
            return res.status(202).json({ success: '0', message: err,data:{}});   
        }
        return res.status(200).json({success: '1',message:'User Listing',data:response});
    });

},
update_user : function(req, res, next)
{
    async.waterfall([
        function (nextCall) 
        {
                var form = new multiparty.Form();
                form.parse(req, function(err, fields, files) 
                {  
                    fields = fields || [];

                    for (var key in fields) {
                        if (fields[key].length === 1) {
                            fields[key] = fields[key][0];
                        }
                    }
                        req.body = fields;
                        req.files = files;
                    
                        req.checkBody('email', 'Email is required').notEmpty(); // Name is required

                        if(req.body.email!='')
                        {
                            req.checkBody('email', 'Email is not a valid').isEmail();
                        }
                        
                        var error = req.validationErrors();
                        if (error && error.length) 
                        {
                            return nextCall({ message: error});
                        }                
                        nextCall(null, req.body,req.files);

                });
        },
        function(new_array,files_array,nextCall)
        {
                let email = new_array.email;

                var aggregateQuery = [];
                //Stage 1
                aggregateQuery.push({
                    $match: {
                        _id: {$ne: mongoose.Types.ObjectId(new_array.user_id)},
                        email:email
                    }
                });

                //Stage 2
                aggregateQuery.push({
                    $project: { 
                        "_id":"$_id",
                        "name":"$name",
                        "email":"$email",
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
                                        nextCall(null,new_array,files_array);
                                  }
                        }                            
                    });  

        } ,
        function(new_array,files_array,nextCall)
        { 
            var update_record = {}; 
            //if(!isEmpty(req.files))
            if(!Common.check_obj_empty(files_array))
            {
                _.map(files_array['files'],function (val, key) 
                {

                    Uploaded.uploadFile(val,USER_PIC_PATH,function(err,res)
                    {
                        if(err)
                        {
                            console.log('--------error--------');
                            console.log(err);
                        }  
                        else{
                            update_record.image = res.filename;
                            nextCall(null, new_array,update_record);
                        }
                   });
    
                });

            }
            else{
                    update_record.image = new_array.existing_image;
                    nextCall(null, new_array,update_record);
                }
            
        },
        function(new_array,update_record,nextCall)
        {   
            const update_user_id = new_array.user_id;
            
            var postData = {
                        'email':new_array.email,
                        'name': new_array.name,
                        'mobile': new_array.mobile, 
                        'status':(new_array.status=='Active') ? '1':'0',
                        'address':new_array.address,
                        'role':new_array.role,
                        'profile_image':update_record.image,
                        'hobby':new_array.hobby,
                        'dateofjoin': new_array.dateofjoin,
                        'skills':JSON.parse(new_array.skills),
                        'your_post':new_array.content,
                        'new_idea':new_array.content_idea,
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

                            // Remove Old Image
                            //if(!isEmpty(req.files))
                            if(!Common.check_obj_empty(req.files))
                            {
                                const file_delete_path_user = USER_PIC_PATH+new_array.existing_image;
                                Uploaded.remove(file_delete_path_user);  
                            }

                            nextCall(null, {
                                    status: 1,
                                    message: 'User Updated successfully.',
                                    data: results
                                });
                        }
                });
        }      
    ],
        function (err, response) 
        {
                if (err) {
                    return res.status(202).json({ success: '0', message: err,data:{}});   
                }
                return res.status(200).json(response); 

        })
            
},
change_password : function(req,res,next)
{
    async.waterfall([
        function(nextCall) { 
            req.checkBody('cpassword', 'Current Password is required').notEmpty(); // Name is required
            req.checkBody('npassword', 'New Password is required').notEmpty(); // password is required
            req.checkBody('cfmpassword', 'Confirm Password is required').notEmpty(); // password is required
            req.checkBody('user_id', 'User Id is required').notEmpty(); // password is required
            
            var error = req.validationErrors();
            if (error && error.length) 
            {
                return nextCall({ message: error});
            }                
            nextCall(null, req.body);
        },
        function (body,nextCall)
        {
            const new_password = md5(body.npassword);
            const confirm_password = md5(body.cfmpassword);

            if(confirm_password==new_password)
            {
                nextCall(null,body);
            }
            else{                    
                return nextCall({ "status": 200, "message": "New Password And Confirm Password Does Not Match." });
            }
        },
        function (body, nextCall) 
        {
            const check_password = md5(body.cpassword);
            const user_id = body.user_id;

            UserSchema.find({ '_id': user_id,'password': check_password}, function (err, user) {

                if (err) {
                    return nextCall({ "message": err });
                }
                if (user.length > 0) {
                    nextCall(null, user[0],body);
                } else {
                    return nextCall({ "status": 200, "message": "Current Password is not valid"});
                }

            });
        },
        function(user,body,nextCall) {
            
            const final_password = md5(body.npassword); 
            UserSchema.findOneAndUpdate({ "_id": user._id }, { $set: { "password": final_password } }, 
            function (error, results) {
                    if (error) {
                        console.log('ERROR:', error);
                    }
                    
                    nextCall(null, {status:1,message:'Password Changed successfully',data:{}});
                });
        },
    ], function(err, response) {
        if (err) 
        {
            console.log('Login Error', err);
            return res.status(202).json({ success: '0', message: err,data:{}});   
        }
        return res.status(200).json(response);   
    }); 

},
list_users : function(req,res,next)
{

    async.waterfall([
        function (nextCall) 
        {
                var aggregateQuery = [];

                //Stage 1
                aggregateQuery.push({
                    $match: {
                        _id: {
                            $ne: mongoose.Types.ObjectId(req.body.login_user_id)  
                        }
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
                
                    // Stage 3
                aggregateQuery.push({
                        $sort: {
                        updated_at: -1, 
                        }
                });
                
                UserSchema.aggregate(aggregateQuery, function (err, result) 
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
        function (body,aggregateQuery,nextCall)
        {
            _.map(body.rows,function (val, key) 
            {
                    if(val.profile_image!='')
                    {
                        body.rows[key]['profile_image'] = config.appHost_view_user_image+val.profile_image;
                    }
            });
            nextCall(null, body,aggregateQuery);
        },
        // function(body, query2, nextCall)
        // {
        //     var new_body = body.rows;                
        //     console.log('--------1------');
        //     console.log(new_body);
        //     var arr = [];
        //     var arr_key = [];
        //     var i = 0;
            
                
        //     _.map(new_body,function (val, key) 
        //     {
        //         //  console.log('-------val-------------');
        //         //  console.log(val);
        //         //  console.log('---------key------------');
        //         //  console.log(key);

        //           var arr2 = [];
        //          _.map(val,function (new_val, new_key) 
        //          {
        //             //   console.log('----new---val-------------');
        //             //   console.log(new_val);
        //             //   console.log('----new-----key------------');
        //               console.log(new_key+'--- key value---');
                        
        //               if(i==0)
        //               {
        //                     arr_key.push(new_key);
        //               }
        //               arr2.push(new_val);
        //          });
                    
        //          i++;
        //          arr.push(arr2); 
        //     });

        //      //console.log('----check---new--');
        //      //console.log(arr);
        //     nextCall(null, arr,arr_key,query2);

        // },
        function (body,query2, nextCall) {
            UserSchema.count(query2, function (err, counts) 
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
        }
    ],
        function (err, response) {
            if (err) {
                return res.status(202).json({ success: '0', message: err,data:{}});   
            }
            return res.status(200).json(response);   
        }) 

},
list_users_pagination : function(req,res,next)
{
    async.waterfall([
        function (nextCall) 
        {
            var numPerPage = parseInt(req.body.perPage, 10) || 1;
            var page = parseInt(req.body.page, 10) || 0;
            var numPages;
            var skip = page * numPerPage;
            var aggregateQuery = [];

                // search name logic
                if(req.body.search_name!='')
                {
                    aggregateQuery.push({
                        $match: {"name": { $regex: req.body.search_name, $options: 'i' }}
                    });
                }

                // search name email
                if(req.body.search_email!='')
                {
                    aggregateQuery.push({
                        $match: {"email": { $regex: req.body.search_email, $options: 'i' }}
                    });
                }
                
                //Stage 1
                aggregateQuery.push({
                    $match: {
                        _id: {
                            $ne: mongoose.Types.ObjectId(req.body.login_user_id)  
                        }
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
                        "profile_image_name":"$profile_image",
                    }
                });
                
                    // Stage 3
                aggregateQuery.push({
                        $sort: {
                        updated_at: -1, 
                        }
                });

                 //Stage 4
                 aggregateQuery.push({
                    $skip: Number(skip)
                });
               
                 // Stage 5
                 aggregateQuery.push({
                    $limit: Number(numPerPage)
                });
                
                UserSchema.aggregate(aggregateQuery, function (err, result) 
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
        function (body,aggregateQuery,nextCall)
        {
            _.map(body.rows,function (val, key) 
            {
                    if(val.profile_image!='')
                    {
                        body.rows[key]['profile_image'] = config.appHost_view_user_image+val.profile_image;
                    }
            });
            nextCall(null, body,aggregateQuery);
        },
        function (body,query2, nextCall) {
            UserSchema.count(query2, function (err, counts) 
            {
                
                var returnData = {
                    count: (req.body.search_email!='')?body.rows.length:counts,
                    rows: body.rows,
                }
                nextCall(null, {
                    status: 1,
                    message: 'User Listing',
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
delete_user : function(req,res,next)
{
    async.waterfall([
        function (nextCall) {
            req.checkBody('user_id', 'User_id is required').notEmpty();

            var error = req.validationErrors();
                if (error) 
                {
                    return nextCall({ message: error});
                }

                nextCall(null, req.body);
        },
        function (body, nextCall) {
            UserSchema.remove({ _id: body.user_id }, function (err, userDetail) 
            {
                if (err) {
                    nextCall({ message: 'Something went wrong.' });
                }
                else{
                    nextCall(null, {
                        status: 200,
                        message: 'User Delete Successfully.',
                        data: {}
                    });
                }
            });
        }
    ],
        function (err, response) {
            if (err) 
            {
                return res.status(202).json({ success: '0', message: err,data:{}});   
            }

            return res.status(200).json(response);   
        });


},
update_status_user:function(req,res,next)
{
    async.waterfall([
        function (nextCall) { 

            req.checkBody('user_id', 'User Id is required.').notEmpty();

            var error = req.validationErrors();
            if (error && error.length) {
                return nextCall({ message: error[0].msg });
            }
            nextCall(null, req.body);
        },
        function (body, nextCall) {

            var postdata = {
                'status': body.value
            }
              var _id = body.user_id;

              UserSchema.findOneAndUpdate({ "_id": _id }, { $set: postdata }, function (error, results) {
                if (error) {
                    nextCall({ message: 'Something went wrong.' });
                } else {
                    nextCall(null, {
                        status: 200,
                        message: 'User status update successfully.',
                        // data: results
                    });
                }
            });
        }
    ], function (err, response) {
        if (err) 
        {
            return res.status(202).json({ success: '0', message: err,data:{}});   
        }

        return res.status(200).json(response);   
    });

},
forget_password:function(req,res,next)
{     
    async.waterfall([
        function(nextCall) { 
            req.checkBody('email', 'Email Id is required').notEmpty();
            var error = req.validationErrors();
            if (error && error.length) 
            {
                return nextCall({ message: error});
            }                
            nextCall(null, req.body);
        },
        // function (body,nextCall)
        // {
        //     const new_password = md5(body.npassword);
        //     const confirm_password = md5(body.cfmpassword);

        //     if(confirm_password==new_password)
        //     {
        //         nextCall(null,body);
        //     }
        //     else{                    
        //         return nextCall({ "status": 200, "message": "New Password And Confirm Password Does Not Match." });
        //     }
        // },
        function (body, nextCall) 
        {
            const check_email = body.email;
            //const client_website_link = body.client_website_link;

            UserSchema.find({ 'email': check_email}, function (err, user) 
            {
                if (err) {
                    return nextCall({ "message": err });
                }
                if (user.length > 0) {

                    if(user[0].status=='0')
                    {
                      return nextCall({ "status": 200, "message": "Your Account has been disabled"});
                    }
                    else{
                       nextCall(null, user[0],body);    
                    }
                    
                } else {
                    return nextCall({ "status": 200, "message": "This Email Id Not Exists In Our System"});
                }

            });
        },
        // function (body, nextCall) 
        // {
        //     const check_email = body.email;

        //     UserSchema.find({ 'email': check_email,status:'1'}, function (err, user) 
        //     {
        //         if (err) {
        //             return nextCall({ "message": err });
        //         }
        //         if (user.length > 0) {
        //             nextCall(null, user[0],body);
        //         } else {
        //             return nextCall({ "status": 200, "message": "Your Account has been disabled"});
        //         }

        //     });
        // },
        function(user,body,nextCall) 
        {
            const unique_code =  Common.randomAsciiString(30);//randomAsciiString(30);
            UserSchema.findOneAndUpdate({ "_id": user._id }, { $set: { "forgotpassword_code": unique_code } }, 
            {upsert:true},function (error, results) 
            {
                if (error) {
                    console.log('ERROR:', error);
                }

                nextCall(null, results,body,unique_code);
            });
        },
        function(results,body,unique_code,nextCall) 
        {
            const reset_password_link = body.client_website_link+unique_code;

            var html = 'Hi '+results.name+',<br/>';
            html+='You recently requested to reset your password for Admin Panel Spinx Digital Corporation Account.Click the button below to reset it.'+'<br/><br/>';

            html+="<a href="+reset_password_link+">Reset Password Link</a>";
            html+='<br/><br/>';
            html+='If you did not request a password reset,Please ignore this email'+'<br/><br/>';
            html+='Thanks,'+'<br/>';
            html+='Spinx Digital Team';

                var pass_obj = {
                    'to':results.email,
                    'from':'no-reply@spinxdigital.com',
                    'subject':'Reset Password Link',
                    'html':html
                }

            mailer.mail(pass_obj,function(err,res){
                if(err)
                {
                    //console.log('............check error for send email..........');
                    return nextCall({ "status": 200, "message": "Email not send successfully"});
                }
                else{
                    nextCall(null, {
                        status: 200,
                        message: 'Send Reset Password Link In Your Email Id',
                        data: {}
                    });
                }
        });

        },
    ], function(err, response) {
        if (err) 
        {
            console.log('Login Error', err);
            return res.status(202).json({ success: '0', message: err,data:{}});   
        }
        return res.status(200).json({ success: '1', message: 'send passowrd link',data:response});   
    }); 

},
reset_password_update:function(req,res,next)
{
    async.waterfall([
        function(nextCall) { 
            //req.checkBody('forget_passeord_code', 'Current Password is required').notEmpty(); // Name is required
            req.checkBody('npassword', 'New Password is required').notEmpty(); // password is required
            req.checkBody('cfmpassword', 'Confirm Password is required').notEmpty(); // password is required
            
            var error = req.validationErrors();
            if (error && error.length) 
            {
                return nextCall({ message: error});
            }                
            nextCall(null, req.body);
        },
        function (body,nextCall)
        {
            const new_password = md5(body.npassword);
            const confirm_password = md5(body.cfmpassword);

            if(confirm_password==new_password)
            {
                nextCall(null,body);
            }
            else{     
                return nextCall({ "status": 200, "message": "New Password And Confirm Password Does Not Match." });
            }
        },
        function (body, nextCall) 
        {
            const check_forget_pwd_code = body.forget_password_code;

            UserSchema.find({'forgotpassword_code': check_forget_pwd_code}, function (err, user) 
            {
                if (err) {
                    return nextCall({ "message": err });
                }
                if (user.length > 0) {
                    nextCall(null, user[0],body);
                } else {
                    return nextCall({ "status": 200, "message": "Your reset password link is not valid"});
                }
            });
        },
        function(user,body,nextCall) 
        {
            
            const final_password = md5(body.npassword); 

            UserSchema.findOneAndUpdate({ "_id": user._id },
                {
                    $set: 
                        { 
                            "password": final_password,
                            "forgotpassword_code":'' 
                        } 
                }, 
            function (error, results) {
                    if (error) {
                        console.log('ERROR:', error);
                    }
                    
                    nextCall(null, {status:200,message:'Your password has been changed successfully',data:{}});
                });
        },
    ], function(err, response) {
        if (err) 
        {
            console.log('Login Error', err);
            return res.status(202).json({ success: '0', message: err,data:{}});   
        }
        return res.status(200).json({ success: '1',data:response});   
    }); 
        

},
reset_pwd_link_check:function(req,res,next){
    async.waterfall([
        function(nextCall) 
        {
            const check_forget_pwd_code = req.body.forget_password_code;

            UserSchema.find({'forgotpassword_code': check_forget_pwd_code}, function (err, user) 
            {
                if (err) {
                    return nextCall({ "message": err });
                }
                if (user.length > 0) {
                    //nextCall(null, user[0],body);
                    nextCall(null,{status: 200,message: "Your reset password link is valid",data:{}});
                } else {
                    return nextCall({ "status": 200, "message": "Your reset password link is not valid"});
                }
            });
        },
    ], function(err, response) {
        if (err) 
        {
            return res.status(202).json({ success: '0', message: err,data:{}});   
        }
        return res.status(200).json({ success: '1',data:response});   
    }); 

},
test_send_email : function(req,res,next)
{
    var pass_obj = {
        'to':'manish.sharma@spinxwebdesign.com',
        'from':'no-reply@spinxdigital.com',
        'subject':'Reset Password Link',
        'html':'check it send Link'
    }

        mailer.mail(pass_obj,function(err,res){

            if(err)
            {
                console.log('............check error for send email..........');
            }
            else{
            console.log('............check res for send email..........');
            console.log(res);
            }
        });
        
},
test_user: function(req, res) {

    var postData = {
                'email':'manish@spinx.com',
                'name': 'manish sharma',
                'password':'manish',
                'mobile': '9898989898',                
                'profile_image': 'no image',
                'user_type':'coach',
                'dateofjoin':'19-08-2019',
                'address' : 'ahmedabad',
                'hobby':'nothing',
                'skills':'',
                'role':'role',
                'your_post':'your_post 1',
                'new_idea':'new_idea 1',
                'access_token':'access_token 1',
                'forgotpassword_code':'forgotpassword_code 1',
                'status':'1',
            };

        var user = new UserSchema(postData);

        user.save(function (error, res) {

                if(error)
                {
                        console.log('errrr');
                        console.log(error);
                }
                else{
                    console.log('---res----');
                    console.log(res);  
                }

            });
},

/*********start************Job****Title*************************************/

add_job_title : function(req,res,next)
{
    async.waterfall([
        function(nextCall) { // check required parameters
                req.checkBody('title', 'Job Title is required').notEmpty(); // Name is required

                var error = req.validationErrors();
                if (error && error.length) {
                    return nextCall({ message: error[0].msg });
                }
                nextCall(null, req.body);
            },
            function (body, nextCall) {
                
                body.name = body.title;
                body.status = body.status;

                var job = new JobtitleSchema(body);

                job.save(function (error, result) {
                    if (error) {
                        return nextCall({ "message": error });
                    }
                    nextCall(null, {
                        status: 200,
                        message: 'Job Title add succesfully.',
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
edit_job_title : function(req,res,next)
{
     async.waterfall([
        function (nextCall) { 
            req.checkBody('job_id', 'Job Title Id is required.').notEmpty();
            var error = req.validationErrors();

            if (error && error.length) {
                return nextCall({ message: error[0].msg });
            }
            nextCall(null, req.body);
        },
        function (body, nextCall) {

            const job_idd = body.job_id;

            JobtitleSchema.find({ '_id': job_idd }, function (err, results) 
            {
                 if(Common.check_obj_empty(results))
                    {
                         nextCall({ message: 'Job Title id is wrong.' });
                    } 
                    else{
                         nextCall(null,results[0]);
                    }
            });
        },
    ], function (err, response) {
        if (err) {
            return res.status(202).json({ success: '0', message: err,data:{}});   
        }
        return res.status(200).json({success: '1',message:'Job Listing',data:response});
    });
   
},
update_job_title : function(req,res,next)
{
    async.waterfall([
        function (nextCall) { // check required parameters

            req.checkBody('title_id', 'Job Title id is required.').notEmpty();
            req.checkBody('name', 'Job Title is required.').notEmpty();

            var error = req.validationErrors();
            if (error && error.length) {
                return nextCall({ message: error});
            }

            nextCall(null, req.body);
        },
        function (body, nextCall) {

            var title_id = body.title_id;

            JobtitleSchema.find({ '_id': title_id }, function (err, results) {
                if (err) {
                    return nextCall({ message: 'Something went wrong.' });
                }
                if (results.length > 0) {
                    nextCall(null, results[0], body);
                } else {
                    return nextCall({ message: 'Job Title id is wrong.' });
                }
            });
        },
        function (result, body, nextCall) {

            var postdata = {
                'name': body.name,
                'status':body.status,
            }

            JobtitleSchema.findOneAndUpdate({ "_id": result._id }, { $set: postdata }, function (error, results) {
                if (error) {
                    nextCall({ message: 'Something went wrong.' });
                } else {
                    nextCall(null, {
                        status: 200,
                        message: 'Job title update successfully.',
                        data:{}
                    });
                }
            });
        }
    ], function (err, response) {
        if (err) {
            return res.status(202).json({ success: '0', message: err,data:{}});   
        }
        return res.status(200).json({ success: '1',data:response});    
    });

},
delete_job_title : function(req,res,next)
{
    async.waterfall([
        function (nextCall) {
            req.checkBody('title_id', 'Job title id is required').notEmpty();                
            var error = req.validationErrors();
                if (error && error.length) {
                    return nextCall({ message: error[0].msg });
                }

                nextCall(null, req.body);
        },
        function (body, nextCall) {
            JobtitleSchema.remove({ _id: body.title_id }, function (err, result) 
            {
                if (err) {
                    nextCall({ message: 'Something went wrong.' });
                }
                else{
                    nextCall(null, {
                        status: 200,
                        message: 'Job title delete successfully.',
                        data: {}
                    });
                }
            });
        }
    ],
        function (err, response) {
            if (err) 
            {
                return res.status(202).json({ success: '0', message: err,data:{}});   
            }

           // return res.status(200).json({ success: '1', message: 'deleted',data:response});    
           return res.status(200).json(response);   

        });

},
list_job_title : function(req,res,next)
{
    async.waterfall([
        function (nextCall) 
        {
                var aggregateQuery = [];

                //Stage 1
                aggregateQuery.push({
                    $project: { 
                        "_id":"$_id",
                        "name":"$name",
                        "updated_at":"$updated_at",
                    }
                });
                
                    // Stage 3
                aggregateQuery.push({
                        $sort: {
                        updated_at: -1, 
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
            JobtitleSchema.count(query2, function (err, counts) 
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
        }
    ],
        function (err, response) {
            if (err) {
                return res.status(202).json({ success: '0', message: err,data:{}});   
            }
            return res.status(200).json(response);   
        }) 

},
list_job_title_pagination:function(req,res,next)
{
    async.waterfall([
        function (nextCall) 
        {
            var numPerPage = parseInt(req.body.perPage, 10) || 1;
            var page = parseInt(req.body.page, 10) || 0;
            var numPages;
            var skip = page * numPerPage;
            var aggregateQuery = [];
            // search query
            var query1 = {};
            // sorting data
            var query2='';

                if(req.body.search_name!='')
                {
                    aggregateQuery.push({
                        $match: {"name": { $regex: req.body.search_name, $options: 'i' }}
                    });
                    query1["name"] = { $regex: req.body.search_name, $options: 'i' }
                }


                // sorting thing
                if(req.body.c_field_name!='' && req.body.c_field_name!==undefined && req.body.c_field_name =='name' )
                {
                    query2 = {name:(req.body.c_order_by=='asc')?1:-1};
                }


                  // Stage 2
                aggregateQuery.push({
                    $lookup: {
                        from: 'tbl_people',
                        localField: '_id',
                        foreignField: 'job_id',
                        as: 'total_people'
                    }
                });

                //Stage 3
                aggregateQuery.push({
                    $project: { 
                        "_id":1,
                        "name":1,
                        "created_at":1,
                        "status":1,
                        "updated_at":1,
                        "total_people": {
                            "$size": "$total_people"
                        }                        
                    }
                });
                
                // Stage 4

                if(query2!='')
                {
                    aggregateQuery.push({$sort: query2});
                }
                else{
                   aggregateQuery.push({
                        $sort: {updated_at: -1}
                   });
                }
                


                 //Stage 5
                 aggregateQuery.push({
                    $skip: Number(skip)
                });
               
                 // Stage 6
                 aggregateQuery.push({
                    $limit: Number(numPerPage)
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
                                nextCall(null, body,query1)
                        }                            
                    });

        },
        function (body,query2, nextCall) {
            JobtitleSchema.count(query2, function (err, counts) 
            {
                var returnData = {
                    count: counts,
                    rows: body.rows,
                }
                nextCall(null, {
                    status: 1,
                    message: 'Job Listing',
                    data: returnData
                });
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
update_status_jobtitle:function(req,res,next)
{
    
    async.waterfall([
        function (nextCall) { 

            req.checkBody('a_id', 'Job Title Id is required.').notEmpty();

            var error = req.validationErrors();
            if (error && error.length) {
                return nextCall({ message: error[0].msg });
            }
            nextCall(null, req.body);
        },
        function (body, nextCall) {

            var postdata = {
                'status': body.value
            }
              var _id = body.a_id;

              JobtitleSchema.findOneAndUpdate({ "_id": _id }, { $set: postdata }, function (error, results) {
                if (error) {
                    nextCall({ message: 'Something went wrong.' });
                } else {
                    nextCall(null, {
                        status: 200,
                        message: 'Job Title status update successfully.',
                    });
                }
            });
        }
    ], function (err, response) {
        if (err) 
        {
            return res.status(202).json({ success: '0', message: err,data:{}});   
        }

        return res.status(200).json(response);   
    });

},
job_title_bulk_action:function(req,res,next)
{
    async.waterfall([
        function(nextCall) { 

                 var bulk_ids = [];

               _.map(req.body.selectedRows,function (val, key) 
                {
                    bulk_ids.push(val._id); 
                });
                                  
                nextCall(null, req.body,bulk_ids);
            },
            function (body,bulk_ids, nextCall) {
                    
                    if(body.bulk_type=="3")
                    {
                        JobtitleSchema.deleteMany(
                            { _id: 
                                    { 
                                        $in: bulk_ids
                                    } 
                            },
                            function (err, multi_record) {
                                
                                   if(err)
                                   {
                                      return nextCall({ "message": err });
                                   }

                                    nextCall(null, {
                                        status: 200,
                                        message: 'Bulk Job Title delete record succesfully.',
                                        data: {}
                                    });
            
                            });

                    }
                    else{
                           
                        // where in condition

                        const schema_table_dynamic = 'JobtitleSchema';
                        schema_table_dynamic.update(
                            { _id: 
                                    { 
                                        $in: bulk_ids
                                    } 
                            },
                            { 
                                $set: 
                                    { 
                                        status : body.bulk_type
                                    } 
                            },
                            {
                                multi: true
                            }
                            ,function (err, multi_record) {
                                
                                   if(err)
                                   {
                                       return nextCall({ "message": err });
                                   }
                                    
                                    nextCall(null, {
                                        status: 200,
                                        message: (body.bulk_type=='1')?'Bulk Job Title Active record succesfully.':'Bulk Job Title Inactive record succesfully.',
                                        data: {}
                                    });
            
                            });
                    }
            }
        ], function(err, response) {
            if (err) {
            return res.status(202).json({ success: '0', message: err,data:{}});   
            }

            return res.status(200).json(response);   
        });
     
},

delete_bulk_images_record(body)
{
      if(body.schema=='People')
      {
            _.map(body.selectedRows,function (val, key) 
            {
                if(val.profile_image!='')
                {
                    Uploaded.remove(PEOPLE_PIC_PATH+val.profile_image); 
                }
            });
      }
      else if(body.schema=='Portfolio')
      {
            _.map(body.selectedRows,function (val, key) 
            {
                if(val.logo_image!='')
                {
                    Uploaded.remove(PORTFOLIO_PORT_PATH+val.logo_image); 
                }
            });
      }
      else if(body.schema=='Strategies')
      {
            _.map(body.selectedRows,function (val, key) 
            {
                if(val.icon_image!='')
                {
                    Uploaded.remove(STRATEGIES_ICON_PATH+val.icon_image); 
                }

                if(val.strategy_image!='')
                {
                    Uploaded.remove(STRATEGIES_PIC_PATH+val.strategy_image); 
                }
            });
      }
      else if(body.schema=='User')
      {
            _.map(body.selectedRows,function (val, key) 
            {
                if(val.profile_image!='')
                {
                    Uploaded.remove(USER_PIC_PATH+val.profile_image); 
                }
            });
      }
},
bulk_action_update:function(req,res,next)
{

    var schema_name = req.body.schema+'Schema';
    var schema_define = '';
    var delete_messsage = '';
    var successfully_message='';

    
    if(schema_name=='UserSchema')
    {
        schema_define = UserSchema;
        delete_messsage = 'Bulk User delete record succesfully.';
        successfully_message = (req.body.bulk_type=='1')?'Bulk User Active record succesfully.':'Bulk User Inactive record succesfully.';
    }
    else if(schema_name=='JobtitleSchema'){
        schema_define = JobtitleSchema;
        delete_messsage = 'Bulk Job Title delete record succesfully.';
        successfully_message = (req.body.bulk_type=='1')?'Bulk Job Title Active record succesfully.':'Bulk Job Title Inactive record succesfully.';
    }
    else if(schema_name=='ArticlesSchema'){
        schema_define = ArticlesSchema;
        delete_messsage = 'Bulk Article delete record succesfully.';
        successfully_message = (req.body.bulk_type=='1')?'Bulk Article Active record succesfully.':'Bulk Article Inactive record succesfully.';
    }
    else if(schema_name=='StrategiesSchema'){
        schema_define = StrategiesSchema;
        delete_messsage = 'Bulk Strategies delete record succesfully.';
        successfully_message = (req.body.bulk_type=='1')?'Bulk Strategies Active record succesfully.':'Bulk Strategies Inactive record succesfully.';
    }
    else if(schema_name=='PortfolioSchema'){
        schema_define = PortfolioSchema;
        delete_messsage = 'Bulk Portfolio delete record succesfully.';
        successfully_message = (req.body.bulk_type=='1')?'Bulk Portfolio Active record succesfully.':'Bulk Portfolio Inactive record succesfully.';
    }
    else if(schema_name=='PeopleSchema'){
        schema_define = PeopleSchema;
        delete_messsage = 'Bulk People delete record succesfully.';
        successfully_message = (req.body.bulk_type=='1')?'Bulk People Active record succesfully.':'Bulk People Inactive record succesfully.';
    }
    else if(schema_name=='ContactusSchema'){
        schema_define = ContactusSchema;
        delete_messsage = 'Bulk Contactus delete record succesfully.';
        successfully_message = (req.body.bulk_type=='1')?'Bulk Contactus Active record succesfully.':'Bulk Contactus Inactive record succesfully.';
    }
    else if(schema_name=='PageSchema'){
        schema_define = PageSchema;
        delete_messsage = 'Bulk Page delete record succesfully.';
        successfully_message = (req.body.bulk_type=='1')?'Bulk Page Active record succesfully.':'Bulk Page Inactive record succesfully.';
    }

    async.waterfall([
        function(nextCall) { 

                 var bulk_ids = [];
                 var image_url = [];

               _.map(req.body.selectedRows,function (val, key) 
                {
                    bulk_ids.push(val._id); 
                });
                                  
                nextCall(null, req.body,bulk_ids);
            },
            function(body,bulk_ids,nextCall)
            {

                if(body.bulk_type=="3")
                {
                    usercontroller.delete_bulk_images_record(body);
                }
                nextCall(null,body,bulk_ids);

            },
            function (body,bulk_ids, nextCall) {
                    
                    if(body.bulk_type=="3")
                    {
                        schema_define.deleteMany(
                            { _id: 
                                    { 
                                        $in: bulk_ids
                                    } 
                            },
                            function (err, multi_record) {
                                
                                   if(err)
                                   {
                                      return nextCall({ "message": err });
                                   }

                                    nextCall(null, {
                                        status: 200,
                                        message: delete_messsage,//'Bulk Job Title delete record succesfully.',
                                        data: {}
                                    });
            
                            });

                    }
                    else{
                           
                        // where in condition
                        schema_define.update(
                            { _id: 
                                    { 
                                        $in: bulk_ids
                                    } 
                            },
                            { 
                                $set: 
                                    { 
                                        status : body.bulk_type
                                    } 
                            },
                            {
                                multi: true
                            }
                            ,function (err, multi_record) {
                                
                                   if(err)
                                   {
                                       return nextCall({ "message": err });
                                   }
                                    
                                    nextCall(null, {
                                        status: 200,
                                        message: successfully_message,
                                        data: {}
                                    });
            
                            });
                    }
            }
        ], function(err, response) {
            if (err) {
            return res.status(202).json({ success: '0', message: err,data:{}});   
            }

            return res.status(200).json(response);   
        });

},

/*********end************Job****Title***************************************/

/*********start************Articles************************************/
add_articles : function(req,res,next)
{
    async.waterfall([
        function(nextCall) { 
             req.checkBody('title', 'Title is required').notEmpty();
             var error = req.validationErrors();
             if (error && error.length) {
                 return nextCall({ message: error});
             }
             nextCall(null, req.body);
         },
         function (body, nextCall) {

                var title_change = body.title;
                var small_character = title_change.toLowerCase();
                var dynamic_slug = small_character.replace(/\s+/g, '-');  
                var str_new = dynamic_slug.replace(/,/g,'');
                var mystring = str_new.replace(/\./g,' ');
                var new_title = mystring.substring(0, 45);  
               
              var insert_obj = {
                  'title':body.title,
                  'content':body.content,
                  'dateofarticle':body.dateofarticle,
                  'status':body.status,
                  'slug':new_title
              }

          
             var articles = new ArticlesSchema(insert_obj);

             articles.save(function (error, result) {
                 if (error) {
                     return nextCall({ "message": error });
                 }
                 nextCall(null, {
                     status: 200,
                     message: 'Article added succesfully.',
                     data: {}
                 });

             });
         }
     ], function(err, response) {
         if (err) {
            return res.status(202).json({ success: '0', message: err,data:{}});   
         }

        // return res.status(200).json({ success: '1',data:response});   
         return res.status(200).json(response);   
     });

},
edit_articles : function(req,res,next)
{
    async.waterfall([
        function (nextCall) { 
            req.checkBody('t_id', 'Article Id is required.').notEmpty();
            var error = req.validationErrors();

            if (error && error.length) {
                return nextCall({ message: error[0].msg });
            }
            nextCall(null, req.body);
        },
        function (body, nextCall) {
            const a_idd = body.t_id;

            ArticlesSchema.find({ '_id': a_idd }, function (err, results) 
            {
                 if(Common.check_obj_empty(results))
                    {
                         nextCall({ message: 'Article id is wrong.' });
                    } 
                    else{
                         nextCall(null,results[0]);
                    }
            });

        },
    ], function (err, response) {
        if (err) {
            return res.status(202).json({ success: '0', message: err,data:{}});   
        }
        return res.status(200).json({success: '1',message:'Article data',data:response});
    });
    
},
update_articles : function(req,res,next)
{
    async.waterfall([
        function (nextCall) { 

            req.checkBody('a_id', 'Article id is required.').notEmpty();
            req.checkBody('title', 'Title is required.').notEmpty();

            var error = req.validationErrors();
            if (error && error.length) {
                return nextCall({ message: error});
            }
            nextCall(null, req.body);
        },
        function (body, nextCall) {

            const article_idd = body.a_id;

            ArticlesSchema.find({ '_id': article_idd }, function (err, results) 
            {
                if (err) {
                    return nextCall({ message: 'Something went wrong.' });
                }
                if (results.length > 0) {
                    nextCall(null, results[0], body);
                } else {
                    return nextCall({ message: 'Article id is wrong.' });
                }
            });
        },
        function (result, body, nextCall) {

                   
                var title_change = body.title;
                var small_character = title_change.toLowerCase();
                var dynamic_slug = small_character.replace(/\s+/g, '-');  
                var str_new = dynamic_slug.replace(/,/g,'');
                var mystring = str_new.replace(/\./g,' ');
                var new_title = mystring.substring(0, 45);   


            var postdata = {
                'title':body.title,
                'content':body.content,
                'dateofarticle':body.dateofarticle,
                'status':body.status,
                'slug':new_title
            }

            ArticlesSchema.findOneAndUpdate({ "_id": result._id }, { $set: postdata }, function (error, results) {
                if (error) {
                    nextCall({ message: 'Something went wrong.' });
                } else {
                    nextCall(null, {
                        status: 200,
                        message: 'Article update successfully.',
                        data:{}
                    });
                }
            });
        }
    ], function (err, response) {
        if (err) {
            return res.status(202).json({ success: '0', message: err,data:{}});   
        }
        //return res.status(200).json({ success: '1', message: 'updated',data:response});    
        return res.status(200).json(response);   
    });

},
delete_articles : function(req,res,next)
    {
        async.waterfall([
            function (nextCall) {
                req.checkBody('a_id', 'Article id is required.').notEmpty();                
                var error = req.validationErrors();
                    if (error && error.length) {
                        return nextCall({ message: error[0].msg });
                    }    
                    nextCall(null, req.body);
            },
            function (body, nextCall) {
                ArticlesSchema.remove({ _id: body.a_id }, function (err, result) 
                {
                    if (err) {
                        nextCall({ message: 'Something went wrong.' });
                    }
                    else{
                        nextCall(null, {
                            status: 200,
                            message: 'Articles delete successfully.',
                            data: {}
                        });
                    }
                });
            }
        ],
            function (err, response) {
                if (err) 
                {
                    return res.status(202).json({ success: '0', message: err,data:{}});   
                }    
                //return res.status(200).json({ success: '1', message: 'deleted',data:response});   
                return res.status(200).json(response);    

            });
},
list_articles : function(req,res,next)
{
    async.waterfall([
        function (nextCall) 
        {
                var aggregateQuery = [];

                //Stage 1
                aggregateQuery.push({
                    $project: { 
                        "_id":"$_id",
                        "title":"$title",
                        "dateofarticle":"$dateofarticle",
                        "status":"$status",
                        "updated_at":"$updated_at",
                    }
                });
                
                 // Stage 2
                aggregateQuery.push({
                     $sort: {
                        updated_at: -1, 
                        }
                });
                
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
        function (body,query2, nextCall) {
            ArticlesSchema.count(query2, function (err, counts) 
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
        }
    ],
        function (err, response) {
            if (err) {
                return res.status(202).json({ success: '0', message: err,data:{}});   
            }
            return res.status(200).json(response);   
        }) 
   
},    
list_articles_pagination:function(req,res,next)
{
    async.waterfall([
        function (nextCall) 
        {
            var numPerPage = parseInt(req.body.perPage, 10) || 1;
            var page = parseInt(req.body.page, 10) || 0;
            var numPages;
            var skip = page * numPerPage;
            var aggregateQuery = [];
            var query1 = {};
            var query2='';

                if(req.body.search_name!='')
                {
                    aggregateQuery.push({
                        $match: {"title": { $regex: req.body.search_name, $options: 'i' }}
                    });
                    query1["title"] = { $regex: req.body.search_name, $options: 'i' }
                }

                // sorting thing
                if(req.body.c_field_name!='' && req.body.c_field_name!==undefined && req.body.c_field_name =='title')
                {
                    query2 = {name:(req.body.c_order_by=='asc')?1:-1};
                }

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
                    }
                });
                
                // Stage 4
                aggregateQuery.push({
                        $sort: {
                        updated_at: -1, 
                        }
                });


                 //Stage 5
                 aggregateQuery.push({
                    $skip: Number(skip)
                });
               
                 // Stage 6
                 aggregateQuery.push({
                    $limit: Number(numPerPage)
                });
                
                ArticlesSchema.aggregate(aggregateQuery, function (err, result) 
                    {
                        if (err) 
                        {
                            console.error(err);
                        }
                        else{
                                var body = {};
                                body.rows = result;
                                nextCall(null, body,query1)
                        }                            
                    });

        },
        function (body,query2, nextCall) {
            ArticlesSchema.count(query2, function (err, counts) 
            {
                var returnData = {
                    count: counts,
                    rows: body.rows,
                }
                nextCall(null, {
                    status: 1,
                    message: 'Articles Listing',
                    data: returnData
                });
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
update_status_articles : function(req,res,next)
{
    async.waterfall([
        function (nextCall) { 

            req.checkBody('a_id', 'Article Id is required.').notEmpty();

            var error = req.validationErrors();
            if (error && error.length) {
                return nextCall({ message: error[0].msg });
            }
            nextCall(null, req.body);
        },
        function (body, nextCall) {

            var postdata = {
                'status': body.value
            }
              var _id = body.a_id;

              ArticlesSchema.findOneAndUpdate({ "_id": _id }, { $set: postdata }, function (error, results) {
                if (error) {
                    nextCall({ message: 'Something went wrong.' });
                } else {
                    nextCall(null, {
                        status: 200,
                        message: 'Article status update successfully.',
                    });
                }
            });
        }
    ], function (err, response) {
        if (err) 
        {
            return res.status(202).json({ success: '0', message: err,data:{}});   
        }

        return res.status(200).json(response);   
    });

},
/*********end************Articles*************************************/

/*********start************Strategies************************************/

add_strategies: function(req,res,next)
{
    async.waterfall([
        function (nextCall) 
        {
             var form = new multiparty.Form();
             form.parse(req, function(err, fields, files) 
             {  
                    fields = fields || [];

                    for (var key in fields) {
                        if (fields[key].length === 1) {
                            fields[key] = fields[key][0];
                        }
                    }

                    req.body = fields;
                    req.files = files;
      
                    req.checkBody('name', 'Name is required').notEmpty();

                    var error = req.validationErrors();
                    if (error && error.length) 
                    {
                        return nextCall({ message: error});
                    }                
                    nextCall(null, req.body,req.files);
                    
             });
        },
        function(new_array,files_array,nextCall)
        {
            var update_record = {};

            //if(!isEmpty(files_array.icon_image))
            if(!Common.check_obj_empty(files_array.icon_image))
            {   
                //var check_array_length = Object.keys(req.files).length;
                _.map(files_array.icon_image,function (val, key)
                {   
                    Uploaded.uploadFile(val,STRATEGIES_ICON_PATH,function(err,res)
                    {
                        if(err)
                        {
                            console.log('--------error--------');
                            console.log(err);
                        }  
                        else{
                            update_record.icon_image = res.filename;
                            nextCall(null, new_array,files_array,update_record);
                        }
                   });

                });
            }  
            else{
                update_record.icon_image = '';
                nextCall(null, new_array,files_array,update_record);
            }
        },
        function(new_array,files_array,update_record,nextCall)
        {
            //if(!isEmpty(files_array.strategy_image))
            if(!Common.check_obj_empty(files_array.strategy_image))
            {  
                _.map(files_array.strategy_image,function (val, key)
                {  

                    Uploaded.uploadFile(val,STRATEGIES_PIC_PATH,function(err,res)
                    {
                        if(err)
                        {
                            console.log('--------error--------');
                            console.log(err);
                        }  
                        else{
                            update_record.strategies_image = res.filename;
                            nextCall(null, new_array,files_array,update_record);
                        }
                   });
                });
            }  
            else{
                update_record.strategies_image = '';
                nextCall(null, new_array,files_array,update_record);
            }
        },
        function(new_array,files_array,update_record,nextCall)
        {
             var postData = {
                    'name':new_array.name,
                    'content':new_array.content,
                    'status':new_array.status,
                    'icon_image':update_record.icon_image,
                    'strategy_image':update_record.strategies_image
                };

                var strategy = new StrategiesSchema(postData);
                strategy.save(function (error, res) {
  
                          if(error)
                          {
                               console.log('--------error------');
                               console.log(error);
                          }
                          else{
                              nextCall(null, {
                                  status: 1,
                                  message: 'Strategy added successfully.',
                                  data: res
                              });
                          }
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
edit_strategies : function(req,res,next)
{    
    async.waterfall([
        function (nextCall) { // check required parameters

            req.checkBody('s_id', 'Strategy Id is required.').notEmpty();

            var error = req.validationErrors();
            if (error && error.length) {
                return nextCall({ message: error[0].msg });
            }
            nextCall(null, req.body);
        },
        function (body, nextCall) {

            const s_idd = body.s_id;

            StrategiesSchema.find({ '_id': s_idd }, function (err, results) 
            {
                if (err) 
                {
                    nextCall({ message: 'Something went wrong.' });
                }
                    
                if(Common.check_obj_empty(results))
                {
                    return nextCall({ message: 'Strategy id is wrong.' });
                } 
                else{

                    const portfolio_details = results[0];

                    var custom_obj = {};
                    custom_obj.name = portfolio_details.name;
                    custom_obj.content = portfolio_details.content;
                    custom_obj.status = portfolio_details.status;
                    custom_obj._id = portfolio_details._id;
                    custom_obj.icon_image = portfolio_details.icon_image;
                    custom_obj.strategy_image = portfolio_details.strategy_image;

                    
                    if(portfolio_details.icon_image!='')
                    {
                        custom_obj.icon_image_link = config.appHost_view_icon_image+portfolio_details.icon_image;
                    }
                    else{
                        custom_obj.icon_image_link = '';
                    }

                    if(portfolio_details.strategy_image!='')
                    {
                        custom_obj.strategy_image_link = config.appHost_view_strategy_image+portfolio_details.strategy_image;
                    }
                    else{
                        custom_obj.strategy_image_link = '';
                    }
                    return nextCall(null,custom_obj);

                }

            });
        },
    ], function (err, response) {
        if (err) {
            return res.status(202).json({ success: '0', message: err,data:{}});   
        }
        return res.status(200).json({success: '1',message:'Edit strategy',data:response});
    });

},
update_strategies : function(req,res,next)
{
    async.waterfall([
        function (nextCall) 
        {
                var form = new multiparty.Form();
                form.parse(req, function(err, fields, files) 
                {  
                    fields = fields || [];

                    for (var key in fields) {
                        if (fields[key].length === 1) {
                            fields[key] = fields[key][0];
                        }
                    }
                        req.body = fields;
                        req.files = files;
                    
                        req.checkBody('name', 'Name is required').notEmpty(); // Name is required

                        var error = req.validationErrors();
                        if (error && error.length) 
                        {
                            return nextCall({ message: error});
                        }                
                        nextCall(null, req.body,req.files);

                });
        },
        function(new_array,files_array,nextCall)
        { 
            var update_record = {}; 

            //if(!isEmpty(files_array.icon_image))
            if(!Common.check_obj_empty(files_array.icon_image))
            {   
                _.map(files_array.icon_image,function (val, key)
                {   

                    Uploaded.uploadFile(val,STRATEGIES_ICON_PATH,function(err,res)
                    {
                        if(err)
                        {
                            console.log('--------error--------');
                            console.log(err);
                        }  
                        else{
                            update_record.icon_image = res.filename;
                            nextCall(null, new_array,files_array,update_record);
                        }
                   });
                });
            }  
            else{
                update_record.icon_image = new_array.old_icon_image;
                nextCall(null, new_array,files_array,update_record);
            }
        },
        function(new_array,files_array,update_record,nextCall)
        {
            //if(!isEmpty(files_array.strategy_image))
            if(!Common.check_obj_empty(files_array.strategy_image))
            {  
                _.map(files_array.strategy_image,function (val, key)
                {   

                    Uploaded.uploadFile(val,STRATEGIES_PIC_PATH,function(err,res)
                    {
                        if(err)
                        {
                            console.log('--------error--------');
                            console.log(err);
                        }  
                        else{
                            update_record.strategies_image = res.filename;
                            nextCall(null, new_array,files_array,update_record);
                        }
                   });

                });
            }  
            else{
                update_record.strategies_image = new_array.old_strategy_image;
                nextCall(null, new_array,files_array,update_record);
            }
             
        },
        function(new_array,files_array,update_record,nextCall)
        {
            const update_s_id = new_array.s_id;

            var postData = {
                'name':new_array.name,
                'content':new_array.content,
                'status':new_array.status,
                'icon_image':update_record.icon_image,
                'strategy_image':update_record.strategies_image
            };

            StrategiesSchema.findOneAndUpdate(
                { 
                    "_id": update_s_id
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

                        //Remove Old Image
                        //if(!isEmpty(files_array.icon_image))
                        if(!Common.check_obj_empty(files_array.icon_image))
                        {
                            const file_delete_path_icon = STRATEGIES_ICON_PATH+new_array.old_icon_image;
                            Uploaded.remove(file_delete_path_icon);
                        }

                        //if(!isEmpty(files_array.strategy_image))
                        if(!Common.check_obj_empty(files_array.strategy_image))
                        {
                            const file_delete_path_image = STRATEGIES_PIC_PATH+new_array.old_strategy_image;
                            Uploaded.remove(file_delete_path_image);
                        }

                        nextCall(null, {
                                status: 1,
                                message: 'Strategy updated successfully.',
                                data: {}
                            });
                    }
            });

        }      
    ],
        function (err, response) 
        {
                if (err) {
                    return res.status(202).json({ success: '0', message: err,data:{}});   
                }
                return res.status(200).json(response); 

        })

},
delete_strategies : function(req,res,next)
{
    async.waterfall([
        function (nextCall) {
            req.checkBody('s_id', 'Strategy id is required.').notEmpty();                
            var error = req.validationErrors();
                if (error && error.length) {
                    return nextCall({ message: error[0].msg });
                }    
                nextCall(null, req.body);
        },
        function (body, nextCall) {
            StrategiesSchema.remove({ _id: body.s_id }, function (err, result) 
            {
                if (err) {
                    nextCall({ message: 'Something went wrong.' });
                }
                else{
                    nextCall(null, {
                        status: 200,
                        message: 'Strategy delete successfully.',
                        data: {}
                    });
                }
            });
        }
    ],
        function (err, response) {
            if (err) 
            {
                return res.status(202).json({ success: '0', message: err,data:{}});   
            }    
            //return res.status(200).json({ success: '1', message: 'deleted',data:response});    
            return res.status(200).json(response);    
        });

},
list_strategies : function(req,res,next)
{
    async.waterfall([
        function (nextCall) 
        {
            var aggregateQuery = [];

                //Stage 1
                aggregateQuery.push({
                    $project: { 
                        "_id":"$_id",
                        "name":"$name",
                        "status":"$status",
                        "updated_at":"$updated_at",
                    }
                });
                
                 // Stage 2
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
list_strategies_pagination:function(req,res,next)
{
    async.waterfall([
        function (nextCall) 
        {
            var numPerPage = parseInt(req.body.perPage, 10) || 1;
            var page = parseInt(req.body.page, 10) || 0;
            var numPages;
            var skip = page * numPerPage;
            var aggregateQuery = [];
            var query1 = {};
            var query2='';

                if(req.body.search_name!='')
                {
                    aggregateQuery.push({
                        $match: {"name": { $regex: req.body.search_name, $options: 'i' }}
                    });
                    query1["name"] = { $regex: req.body.search_name, $options: 'i' }
                }

                // sorting thing
                if(req.body.c_field_name!='' && req.body.c_field_name!==undefined && req.body.c_field_name =='name' )
                {
                    query2 = {name:(req.body.c_order_by=='asc')?1:-1};
                }

                //Stage 3
                aggregateQuery.push({
                    $project: { 
                        "_id":1,
                        "name":1,
                        "content":1,
                        "status":1,                        
                        "created_at":1,
                        "updated_at":1,
                        "icon_image":1,
                        "strategy_image":1,         
                    }
                });
                
                // Stage 4
                if(query2!='')
                {
                    aggregateQuery.push({$sort: query2});
                }
                else{
                   aggregateQuery.push({
                        $sort: {updated_at: -1}
                   });
                }

                 //Stage 5
                 aggregateQuery.push({
                    $skip: Number(skip)
                });
               
                 // Stage 6
                 aggregateQuery.push({
                    $limit: Number(numPerPage)
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
                                nextCall(null, body,query1)
                        }                            
                    });

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
                    message: 'Strategies Listing',
                    data: returnData
                });
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
update_status_strategies:function(req,res,next)
{
    async.waterfall([
        function (nextCall) { 
            req.checkBody('s_id', 'Strategy Id is required.').notEmpty();
            var error = req.validationErrors();
            if (error && error.length) {
                return nextCall({ message: error[0].msg });
            }
            nextCall(null, req.body);
        },
        function (body, nextCall) {

            var postdata = {
                'status': body.value
            }
              var _id = body.s_id;

              StrategiesSchema.findOneAndUpdate({ "_id": _id }, { $set: postdata }, function (error, results) {
                if (error) {
                    nextCall({ message: 'Something went wrong.' });
                } else {
                    nextCall(null, {
                        status: 200,
                        message: 'Strategy status update successfully.',
                    });
                }
            });
        }
    ], function (err, response) {
        if (err) 
        {
            return res.status(202).json({ success: '0', message: err,data:{}});   
        }

        return res.status(200).json(response);   
    });

},

/*********end************Strategies************************************/

/*********start************Portfolio************************************/
add_portfolio : function(req,res,next)
{
    async.waterfall([
        function (nextCall) 
        {
             var form = new multiparty.Form();
             form.parse(req, function(err, fields, files) 
             {  
                    fields = fields || [];
                    for (var key in fields) {
                        if (fields[key].length === 1) {
                            fields[key] = fields[key][0];
                        }
                    }

                    req.body = fields;
                    req.files = files;
      
                    req.checkBody('title', 'Title is required').notEmpty();

                    var error = req.validationErrors();
                    if (error && error.length) 
                    {
                        return nextCall({ message: error});
                    }                
                    nextCall(null, req.body,req.files);
                    
             });
        },
        function(new_array,files_array,nextCall)
        {
            var update_record = {};

            if(!Common.check_obj_empty(files_array))
            {   
                _.map(files_array['logo_image'],function (val, key)
                {   
                     Uploaded.uploadFile(val,PORTFOLIO_PORT_PATH,function(err,res)
                             {
                                 if(err)
                                 {
                                     console.log('--------error--------');
                                     console.log(err);
                                 }  
                                 else{
                                     update_record.logo_image = res.filename;
                                     nextCall(null, new_array,update_record);
                                 }
                         });
                    
                });
            }  
            else{
                update_record.logo_image = '';
                nextCall(null, new_array,update_record);
            }
        },
        function(new_array,update_record,nextCall)
        {
             var postData = {
                    'title':new_array.title,
                    'logo_image':update_record.logo_image,
                    'p_type_history':(new_array.p_type_history_flag=='true')?1:0,
                    'p_type_industry':(new_array.p_type_industry_flag=='true')?1:0,
                    'p_type_software':(new_array.p_type_software_flag=='true')?1:0,
                    'content':new_array.content,
                    'investment_date':new_array.investment_date,
                    'headquarters':new_array.hadquarters,
                    'website_url':new_array.website_url,
                    'status':new_array.status,
                };

                var portfolio = new PortfolioSchema(postData);
                portfolio.save(function (error, res) {
  
                          if(error)
                          {
                               console.log('--------error------');
                               console.log(error);
                          }
                          else{
                              nextCall(null, {
                                  status: 1,
                                  message: 'Portfolio added successfully.',
                                  data: res
                              });
                          }
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
edit_portfolio:function(req,res,next)
{
    async.waterfall([
        function (nextCall) { // check required parameters

            req.checkBody('p_id', 'Portfolio Id is required.').notEmpty();

            var error = req.validationErrors();
            if (error && error.length) {
                return nextCall({ message: error[0].msg });
            }
            nextCall(null, req.body);
        },
        function (body, nextCall) {

            const p_idd = body.p_id;

            PortfolioSchema.find({ '_id': p_idd }, function (err, results) 
            {
                if (err) 
                {
                    nextCall({ message: 'Something went wrong.' });
                }
                    
                if(Common.check_obj_empty(results))
                {
                    return nextCall({ message: 'Portfolio id is wrong.' });
                } 
                else{

                    const portfolio_details = results[0];

                    var custom_obj = {};
                    custom_obj.title = portfolio_details.title;
                    custom_obj.content = portfolio_details.content;
                    custom_obj.status = portfolio_details.status;                    
                    custom_obj._id = portfolio_details._id;
                    custom_obj.logo_image = portfolio_details.logo_image;

                    custom_obj.p_type_history = portfolio_details.p_type_history;
                    custom_obj.p_type_industry = portfolio_details.p_type_industry;
                    custom_obj.p_type_software = portfolio_details.p_type_software;

                    custom_obj.investment_date = portfolio_details.investment_date;
                    custom_obj.website_url = portfolio_details.website_url;
                    custom_obj.headquarters = portfolio_details.headquarters;

                    if(portfolio_details.logo_image!='')
                    {
                        custom_obj.logo_image_link = config.appHost_view_portfolio_logo+portfolio_details.logo_image;
                    }
                    else{
                        custom_obj.logo_image_link = '';
                    }

                    return nextCall(null,custom_obj);
                }

            });
        },
    ], function (err, response) {
        if (err) {
            return res.status(202).json({ success: '0', message: err,data:{}});   
        }
        return res.status(200).json({success: '1',message:'Edit Portfolio',data:response});
    });    

},
update_portfolio : function(req,res,next)
{
    async.waterfall([
        function (nextCall) 
        {
                var form = new multiparty.Form();
                form.parse(req, function(err, fields, files) 
                {  
                    fields = fields || [];

                    for (var key in fields) {
                        if (fields[key].length === 1) {
                            fields[key] = fields[key][0];
                        }
                    }
                        req.body = fields;
                        req.files = files;
                    
                        req.checkBody('title', 'Title is required').notEmpty(); // Name is required

                        var error = req.validationErrors();
                        if (error && error.length) 
                        {
                            return nextCall({ message: error});
                        }                
                        nextCall(null, req.body,req.files);

                });
        },
        function(new_array,files_array,nextCall)
        { 
            var update_record = {}; 

            if(!Common.check_obj_empty(files_array))
            {   
                _.map(files_array['logo_image'],function (val, key)
                {   
                     Uploaded.uploadFile(val,PORTFOLIO_PORT_PATH,function(err,res)
                             {
                                 if(err)
                                 {
                                     console.log('--------error--------');
                                     console.log(err);
                                 }  
                                 else{
                                     update_record.logo_image = res.filename;
                                     nextCall(null, new_array,files_array,update_record);
                                 }
                         });
                    
                });
            }  
            else{
                update_record.logo_image = new_array.old_logo_image;
                nextCall(null, new_array,files_array,update_record);
            }
        },
        function(new_array,files_array,update_record,nextCall)
        {
            const update_p_id = new_array.p_id;

            var postData = {
                'title':new_array.title,
                'content':new_array.content,
                'status':new_array.status,                  
                'logo_image':update_record.logo_image,
                'headquarters':new_array.hadquarters,
                'investment_date':new_array.investment_date,
                'website_url':new_array.website_url,
                'p_type_history':(new_array.p_type_history_flag=='true')?1:0,
                'p_type_industry':(new_array.p_type_industry_flag=='true')?1:0,
                'p_type_software':(new_array.p_type_software_flag=='true')?1:0,
            };

            PortfolioSchema.findOneAndUpdate(
                { 
                    "_id": update_p_id
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
                        //if(!isEmpty(files_array))
                        if(!Common.check_obj_empty(files_array))
                        {
                            const file_delete_path_icon = PORTFOLIO_PORT_PATH+new_array.old_logo_image;
                            Uploaded.remove(file_delete_path_icon);
                        }

                        nextCall(null, {
                                status: 1,
                                message: 'Portfolio updated successfully.',
                                data: {}
                            });
                    }
            });

        }      
    ],
        function (err, response) 
        {
                if (err) {
                    return res.status(202).json({ success: '0', message: err,data:{}});   
                }
                return res.status(200).json(response); 

        })

},
delete_portfolio: function(req,res,next)
{
    async.waterfall([
        function (nextCall) {
            req.checkBody('p_id', 'Portfolio id is required.').notEmpty();                
            var error = req.validationErrors();
                if (error && error.length) {
                    return nextCall({ message: error[0].msg });
                }    
                nextCall(null, req.body);
        },
        function (body, nextCall) {
            PortfolioSchema.remove({ _id: body.p_id }, function (err, result) 
            {
                if (err) {
                    nextCall({ message: 'Something went wrong.' });
                }
                else{
                    nextCall(null, {
                        status: 200,
                        message: 'Portfolio delete successfully.',
                        data: {}
                    });
                }
            });
        }
    ],
        function (err, response) {
            if (err) 
            {
                return res.status(202).json({ success: '0', message: err,data:{}});   
            }    
            return res.status(200).json(response);      
        });

},
list_portfolio:function(req,res,next)
{
    async.waterfall([
        function (nextCall) 
        {
            var aggregateQuery = [];

                //Stage 1
                aggregateQuery.push({
                    $project: { 
                        "_id":"$_id",
                        "title":"$title",
                        "logo_image":"$logo_image",
                        "p_type_history":"$p_type_history",
                        "p_type_industry":"$p_type_industry",
                        "p_type_software":"$p_type_software",
                        "content":"$content",
                        "investment_date":"$investment_date",
                        "headquarters":"$headquarters",
                        "website_url":"$website_url",
                        "status":"$status",
                        "updated_at":"$updated_at",
                    }
                });
                
                 // Stage 2
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
                             nextCall(null, body,aggregateQuery)
                        }                            
                    });

        },
        function (body,query2, nextCall) {
            PortfolioSchema.count(query2, function (err, counts) 
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
list_portfolio_pagination:function(req,res,next)
{
    async.waterfall([
        function (nextCall) 
        {
            var numPerPage = parseInt(req.body.perPage, 10) || 1;
            var page = parseInt(req.body.page, 10) || 0;
            var numPages;
            var skip = page * numPerPage;
            var aggregateQuery = [];
            var query1 = {};

                if(req.body.search_name!='')
                {
                    aggregateQuery.push({
                        $match: {"title": { $regex: req.body.search_name, $options: 'i' }}
                    });
                    query1["title"] = { $regex: req.body.search_name, $options: 'i' }
                }

                if(req.body.search_headquarters!='')
                {
                    aggregateQuery.push({
                        $match: {"headquarters": { $regex: req.body.search_headquarters, $options: 'i' }}
                    });
                    query1["headquarters"] = { $regex: req.body.search_headquarters, $options: 'i' }
                }
                
                //Stage 3
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
                
                // Stage 4
                aggregateQuery.push({
                        $sort: {
                        updated_at: -1, 
                        }
                });


                 //Stage 5
                 aggregateQuery.push({
                    $skip: Number(skip)
                });
               
                 // Stage 6
                 aggregateQuery.push({
                    $limit: Number(numPerPage)
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
                                nextCall(null, body,query1)
                        }                            
                    });

        },
        function (body,query2, nextCall) {
            PortfolioSchema.count(query2, function (err, counts) 
            {
                var returnData = {
                    count: counts,
                    rows: body.rows,
                }
                nextCall(null, {
                    status: 1,
                    message: 'Portfolio Listing',
                    data: returnData
                });
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
update_status_portfolio:function(req,res,next)
{
    async.waterfall([
        function (nextCall) { 

            req.checkBody('p_id', 'Portfolio Id is required.').notEmpty();

            var error = req.validationErrors();
            if (error && error.length) {
                return nextCall({ message: error[0].msg });
            }
            nextCall(null, req.body);
        },
        function (body, nextCall) {

            var postdata = {
                'status': body.value
            }
            var _id = body.p_id;

            PortfolioSchema.findOneAndUpdate({ "_id": _id }, { $set: postdata }, function (error, results) {
                if (error) {
                    nextCall({ message: 'Something went wrong.' });
                } else {
                    nextCall(null, {
                        status: 200,
                        message: 'Portfolio status update successfully.',
                    });
                }
            });
        }
    ], function (err, response) {
        if (err) 
        {
            return res.status(202).json({ success: '0', message: err,data:{}});   
        }

        return res.status(200).json(response);   
    });


},

/*********end************Portfolio************************************/

/*********start************Peoples************************************/
add_people : function(req,res,next)
{

    async.waterfall([
        function (nextCall) 
        {
             var form = new multiparty.Form();
             form.parse(req, function(err, fields, files) 
             {  
                    fields = fields || [];
                    for (var key in fields) {
                        if (fields[key].length === 1) {
                            fields[key] = fields[key][0];
                        }
                    }

                    req.body = fields;
                    req.files = files;

                    req.checkBody('name', 'Name is required').notEmpty();
                    req.checkBody('p_type', 'People Type is required').notEmpty();

                    console.log('req body');
                    console.log(req.body);

                    var error = req.validationErrors();
                    if (error && error.length) 
                    {
                        return nextCall({ message: error});
                    }                
                    nextCall(null, req.body,req.files);
                    
             });
        },
        function(new_array,files_array,nextCall)
        {
            var update_record = {};

             if(new_array.p_type==2 || new_array.p_type==3)
             {
                 update_record.profile_image = '';
                 nextCall(null, new_array,update_record);
             }
             else{
                   if(!Common.check_obj_empty(files_array))
                    {   
                        _.map(files_array['profile_image'],function (val, key)
                        {   
                            Uploaded.uploadFile(val,PEOPLE_PIC_PATH,function(err,res)
                                    {
                                        if(err)
                                        {
                                            console.log('--------error--------');
                                            console.log(err);
                                        }  
                                        else{
                                            update_record.profile_image = res.filename;
                                            nextCall(null, new_array,update_record);
                                        }
                                });
                            
                        });
                    }  
                    else{
                        update_record.profile_image = '';
                        nextCall(null, new_array,update_record);
                    }
             }
        },
        function(new_array,update_record,nextCall)
        {
             var postData = {
                    'name':new_array.name,
                    'bio':new_array.bio,
                    'status':new_array.status,
                    'p_type':new_array.p_type,
                    'profile_image':update_record.profile_image,
                    'job_title_other':(new_array.p_type==2 || new_array.p_type==3)?new_array.job_title_other:'',
                    'portfolios':JSON.parse(new_array.select_portfolio),      
                };

                if(new_array.p_type==1)
                {
                    postData.job_id = new_array.job_id;    
                }

                var people_data = new PeopleSchema(postData);
                people_data.save(function (error, res) {
  
                          if(error)
                          {
                               console.log('--------error------');
                               console.log(error);
                          }
                          else{
                              nextCall(null, {
                                  status: 1,
                                  message: 'People added successfully.',
                                  data: res
                              });
                          }
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
edit_people : function(req,res,next)
{
    async.waterfall([
        function (nextCall) { 
            req.checkBody('people_id', 'People Id is required.').notEmpty();            
            var error = req.validationErrors();
            if (error && error.length) {
                return nextCall({ message: error[0].msg });
            }
            nextCall(null, req.body);
        },
        function (body, nextCall) {

            const people_id = body.people_id;

            PeopleSchema.find({ '_id': people_id }, function (err, results) 
            {
                 if(Common.check_obj_empty(results))
                    {
                         nextCall({ message: 'People id is wrong.' });
                    } 
                    else{

                        const people_details = results[0];

                        var custom_obj = {};
                        custom_obj.name = people_details.name;
                        custom_obj.bio = people_details.bio;
                        custom_obj.status = people_details.status;
                        custom_obj.p_type = people_details.p_type;
                        custom_obj._id = people_details._id;
                        custom_obj.job_title_other = people_details.job_title_other;
                        custom_obj.updated_at = people_details.updated_at;
                        custom_obj.created_at = people_details.created_at;
                        custom_obj.profile_image = people_details.profile_image;
                        custom_obj.job_id = people_details.job_id;

                        custom_obj.portfolios = people_details.portfolios;


                        if(custom_obj.profile_image!='')
                        {
                        custom_obj.profile_image_link = config.appHost_view_people_image+people_details.profile_image;
                        }
                        else{
                        custom_obj.profile_image_link = '';
                        }

                        //nextCall(null,results[0]);
                        nextCall(null,custom_obj);
                    }
            });
        },
    ], function (err, response) {
        if (err) {
            return res.status(202).json({ success: '0', message: err,data:{}});   
        }
        return res.status(200).json({success: '1',message:'People Edit',data:response});
    });

},
update_people:function(req,res,next)
{
    async.waterfall([
        function (nextCall) 
        {
                var form = new multiparty.Form();
                form.parse(req, function(err, fields, files) 
                {  
                    fields = fields || [];

                    for (var key in fields) {
                        if (fields[key].length === 1) {
                            fields[key] = fields[key][0];
                        }
                    }
                        req.body = fields;
                        req.files = files;
                    
                        req.checkBody('name', 'Name is required').notEmpty();
                        req.checkBody('p_type', 'People Type is required').notEmpty();

                        var error = req.validationErrors();
                        if (error && error.length) 
                        {
                            return nextCall({ message: error});
                        }                

                    nextCall(null, req.body,req.files);

                });
        },
        function(new_array,files_array,nextCall)
        { 
            var update_record = {}; 

            if(new_array.p_type==2 || new_array.p_type==3)
            {
                //update_record.profile_image = '';
                nextCall(null, new_array,files_array,update_record);
            }
            else{

                  if(!Common.check_obj_empty(files_array))
                   {   
                       _.map(files_array['profile_image'],function (val, key)
                       {   
                           Uploaded.uploadFile(val,PEOPLE_PIC_PATH,function(err,res)
                                   {
                                       if(err)
                                       {
                                           console.log('--------error--------');
                                           console.log(err);
                                       }  
                                       else{
                                           update_record.profile_image = res.filename;
                                           nextCall(null, new_array,files_array,update_record);
                                       }
                               });
                           
                       });
                   }  
                   else{
                       update_record.profile_image = new_array.old_profile_image;
                       nextCall(null, new_array,files_array,update_record);
                   }
            }

        },
        function(new_array,files_array,update_record,nextCall)
        {
            const update_p_id = new_array.p_id;

            var postData = {
                'name':new_array.name,
                'bio':new_array.bio,
                'status':new_array.status,
                'p_type':new_array.p_type,
                'job_title_other':(new_array.p_type!=1)?new_array.job_title_other:'',                
                'profile_image':(new_array.p_type==1)?update_record.profile_image:'',
                'portfolios':JSON.parse(new_array.select_portfolio),
            };

            if(new_array.p_type==1)
            {
                postData.job_id = new_array.job_id;   
            }

            //'job_id':(new_array.p_type==3)?new_array.job_id:'',

            PeopleSchema.findOneAndUpdate(
                { 
                    "_id": update_p_id
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

                        //Remove Old Image
                        if(!Common.check_obj_empty(files_array))
                        {
                            const file_delete_path_people = PEOPLE_PIC_PATH+new_array.old_profile_image;
                            Uploaded.remove(file_delete_path_people);
                        }

                        nextCall(null, {
                                status: 1,
                                message: 'People updated successfully.',
                                data: {}
                            });
                    }
            });

        }      
    ],
        function (err, response) 
        {
                if (err) {
                    return res.status(202).json({ success: '0', message: err,data:{}});   
                }
                return res.status(200).json(response); 

        })

},
delete_people:function(req,res,next)
{
    async.waterfall([
        function (nextCall) {
            req.checkBody('p_id', 'People id is required.').notEmpty();                
            var error = req.validationErrors();
                if (error && error.length) {
                    return nextCall({ message: error[0].msg });
                }    
                nextCall(null, req.body);
        },
        function (body, nextCall) {
            PeopleSchema.remove({ _id: body.p_id }, function (err, result) 
            {
                if (err) {
                    nextCall({ message: 'Something went wrong.' });
                }
                else{
                    nextCall(null, {
                        status: 200,
                        message: 'People delete successfully.',
                        data: {}
                    });
                }
            });
        }
    ],
        function (err, response) {
            if (err) 
            {
                return res.status(202).json({ success: '0', message: err,data:{}});   
            }    
            return res.status(200).json(response);   
        });

},
list_people : function(req,res,next)
{
    async.waterfall([
        function (nextCall) 
        {
            var aggregateQuery = [];

                //Stage 1
                aggregateQuery.push({
                    $project: { 
                        "_id":"$_id",
                        "name":"$name",
                        "bio":"$bio",
                        "status":"$status",
                        "p_type":"$p_type",
                        "job_title_other":"$job_title_other",
                        "job_id":"$job_id",                        
                        "profile_image":"$profile_image",
                        "updated_at":"$updated_at",
                    }
                });
                
                 // Stage 2
                aggregateQuery.push({
                     $sort: {
                        updated_at: -1, 
                        }
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
                             nextCall(null, body,aggregateQuery)
                        }                            
                    });

        },
        function (body,query2, nextCall) {
            PeopleSchema.count(query2, function (err, counts) 
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
list_people_pagination:function(req,res,next)
{
    async.waterfall([
        function (nextCall) 
        {
            var numPerPage = parseInt(req.body.perPage, 10) || 1;
            var page = parseInt(req.body.page, 10) || 0;
            var numPages;
            var skip = page * numPerPage;
            var aggregateQuery = [];
            var query1 = {};

                // search filter
                if(req.body.search_name!='')
                {
                    aggregateQuery.push({
                        $match: {"name": { $regex: req.body.search_name, $options: 'i' }}
                    });
                    query1["name"] = { $regex: req.body.search_name, $options: 'i' }
                }

                if(req.body.search_people_type!='')
                {
                    aggregateQuery.push({
                        $match: {"p_type":  parseInt(req.body.search_people_type)}
                    });
                    query1["p_type"] = parseInt(req.body.search_people_type);
                }
                
                if(req.body.search_job_other!='')
                {
                    aggregateQuery.push({
                        $match: {"job_title_other": { $regex: req.body.search_job_other, $options: 'i' }}
                    });
                    query1["job_title_other"] = { $regex: req.body.search_job_other, $options: 'i' }
                }

                 // Stage 2
                 aggregateQuery.push({
                    $lookup: {
                        from: 'tbl_job_titles',
                        localField: 'job_id',
                        foreignField: '_id',
                        as: 'title_job'
                    }
                });

                //Stage 3
                aggregateQuery.push({
                    $project: { 
                        "_id":1,
                        "name":1,
                        "p_type":1,
                        "status":1,        
                        "job_title_other":1,                
                        "created_at":1,
                        "updated_at":1,
                        "job_id":1,
                        "job_title_name":"$title_job.name",    
                        "profile_image":1,                    
                    }
                });
                
                // Stage 4
                aggregateQuery.push({
                        $sort: {
                        updated_at: -1, 
                        }
                });

                 //Stage 5
                 aggregateQuery.push({
                    $skip: Number(skip)
                });
               
                 // Stage 6
                 aggregateQuery.push({
                    $limit: Number(numPerPage)
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
                                nextCall(null, body,query1)
                        }                            
                    });

        },
        function (body,query2, nextCall) {
            PeopleSchema.count(query2, function (err, counts) 
            {
                var returnData = {
                    count: counts,
                    rows: body.rows,
                }
                nextCall(null, {
                    status: 1,
                    message: 'People Listing',
                    data: returnData
                });
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
update_status_people : function(req,res,next)
{
    async.waterfall([
        function (nextCall) { 

            req.checkBody('people_id', 'People Id is required.').notEmpty();

            var error = req.validationErrors();
            if (error && error.length) {
                return nextCall({ message: error[0].msg });
            }
            nextCall(null, req.body);
        },
        function (body, nextCall) {

            var postdata = {
                'status': body.value
            }
              var _id = body.people_id;

              PeopleSchema.findOneAndUpdate({ "_id": _id }, { $set: postdata }, function (error, results) {
                if (error) {
                    nextCall({ message: 'Something went wrong.' });
                } else {
                    nextCall(null, {
                        status: 200,
                        message: 'People status update successfully.',
                    });
                }
            });
        }
    ], function (err, response) {
        if (err) 
        {
            return res.status(202).json({ success: '0', message: err,data:{}});   
        }

        return res.status(200).json(response);   
    });

},
/*********end************Peoples************************************/

/*********start************Conatct Us******************************/
list_cnt_us_pagination : function(req,res,next)
{

    async.waterfall([
        function (nextCall) 
        {
            var numPerPage = parseInt(req.body.perPage, 10) || 1;
            var page = parseInt(req.body.page, 10) || 0;
            var numPages;
            var skip = page * numPerPage;
            var aggregateQuery = [];
            var query1 = {};

                // search filter
                if(req.body.search_name!='')
                {
                    aggregateQuery.push({
                        $match: {"name": { $regex: req.body.search_name, $options: 'i' }}
                    });
                    query1["name"] = { $regex: req.body.search_name, $options: 'i' }
                }

                if(req.body.search_email!='')
                {
                    aggregateQuery.push({
                        $match: {"email": { $regex: req.body.search_email, $options: 'i' }}
                    });
                    query1["email"] = { $regex: req.body.search_email, $options: 'i' }
                }

                if(req.body.search_phone!='')
                {
                    aggregateQuery.push({
                        $match: {"phone": { $regex: req.body.search_phone, $options: 'i' }}
                    });
                    query1["phone"] = { $regex: req.body.search_phone, $options: 'i' }
                }

                //Stage 1
                aggregateQuery.push({
                    $project: { 
                        "_id":1,
                        "name":1,
                        "email":1,
                        "phone":1,        
                        "message":1,                
                        "created_at":1,
                        "updated_at":1,
                    }
                });

                
                // Stage 2
                aggregateQuery.push({
                        $sort: {
                        updated_at: -1, 
                        }
                });

                 //Stage 3
                 aggregateQuery.push({
                    $skip: Number(skip)
                });
               
                 // Stage 4
                 aggregateQuery.push({
                    $limit: Number(numPerPage)
                });
                
                ContactusSchema.aggregate(aggregateQuery, function (err, result) 
                    {
                        if (err) 
                        {
                            console.error(err);
                        }
                        else{
                                var body = {};
                                body.rows = result;
                                nextCall(null, body,query1)
                        }                            
                    });

        },
        function (body,query2, nextCall) {
            ContactusSchema.count(query2, function (err, counts) 
            {
                var returnData = {
                    count: counts,
                    rows: body.rows,
                }
                nextCall(null, {
                    status: 1,
                    message: 'Contact Us Listing',
                    data: returnData
                });
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
delete_cnt_us : function(req,res,next)
{
    async.waterfall([
        function (nextCall) {
            req.checkBody('c_id', 'Contact Id is required.').notEmpty();                
            var error = req.validationErrors();
                if (error && error.length) {
                    return nextCall({ message: error[0].msg });
                }    
                nextCall(null, req.body);
        },
        function (body, nextCall) {
            ContactusSchema.remove({ _id: body.c_id }, function (err, result) 
            {
                if (err) {
                    nextCall({ message: 'Something went wrong.' });
                }
                else{
                    nextCall(null, {
                        status: 200,
                        message: 'Contact us delete successfully.',
                        data: {}
                    });
                }
            });
        }
    ],
        function (err, response) {
            if (err) 
            {
                return res.status(202).json({ success: '0', message: err,data:{}});   
            }
            return res.status(200).json(response);    
        });
}, 
/*********end************Peoples************************************/

/*********start************Page************************************/
list_page_pagination:function(req,res,next)
{

    async.waterfall([
        function (nextCall) 
        {
            var numPerPage = parseInt(req.body.perPage, 10) || 1;
            var page = parseInt(req.body.page, 10) || 0;
            var numPages;
            var skip = page * numPerPage;
            var aggregateQuery = [];
            var query1 = {};

                // search filter
                if(req.body.search_name!='')
                {
                    aggregateQuery.push({
                        $match: {"title": { $regex: req.body.search_name, $options: 'i' }}
                    });
                    query1["title"] = { $regex: req.body.search_name, $options: 'i' }
                }
 
                //Stage 1
                aggregateQuery.push({
                    $project: { 
                        "_id":1,
                        "title":1,
                        "status":1,
                        "created_at":1,
                        "updated_at":1,
                    }
                });
                
                // Stage 2
                aggregateQuery.push({
                        $sort: {
                        updated_at: -1, 
                        }
                });

                 //Stage 3
                 aggregateQuery.push({
                    $skip: Number(skip)
                });
               
                 // Stage 4
                 aggregateQuery.push({
                    $limit: Number(numPerPage)
                });
                
                PageSchema.aggregate(aggregateQuery, function (err, result) 
                    {
                        if (err) 
                        {
                            console.error(err);
                        }
                        else{
                                var body = {};
                                body.rows = result;
                                nextCall(null, body,query1)
                        }                            
                    });

        },
        function (body,query2, nextCall) {
            PageSchema.count(query2, function (err, counts) 
            {
                var returnData = {
                    count: counts,
                    rows: body.rows,
                }
                nextCall(null, {
                    status: 1,
                    message: 'Page Listing',
                    data: returnData
                });
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
edit_page:function(req,res,next)
{
    async.waterfall([
        function (nextCall) { 
            req.checkBody('p_id', 'Page Id is required.').notEmpty();
            var error = req.validationErrors();

            if (error && error.length) {
                return nextCall({ message: error[0].msg });
            }
            nextCall(null, req.body);
        },
        function (body, nextCall) {
            const p_idd = body.p_id;

            PageSchema.find({ '_id': p_idd }, function (err, results) 
            {
                 if(Common.check_obj_empty(results))
                    {
                         nextCall({ message: 'Page id is wrong.' });
                    } 
                    else{
                         nextCall(null,results[0]);
                    }
            });

        },
    ], function (err, response) {
        if (err) {
            return res.status(202).json({ success: '0', message: err,data:{}});   
        }
        return res.status(200).json({success: '1',message:'Page data',data:response});
    });
    
},
update_page:function(req,res,next)
{

    async.waterfall([
        function (nextCall) { 

            req.checkBody('p_id', 'Page id is required.').notEmpty();
            req.checkBody('title', 'Title is required.').notEmpty();

            var error = req.validationErrors();
            if (error && error.length) {
                return nextCall({ message: error});
            }
            nextCall(null, req.body);
        },
        function (body, nextCall) {

            const page_idd = body.p_id;

            PageSchema.find({ '_id': page_idd }, function (err, results) 
            {
                if (err) {
                    return nextCall({ message: 'Something went wrong.' });
                }
                if (results.length > 0) 
                {
                    nextCall(null, results[0], body);
                } else {
                    return nextCall({ message: 'Page id is wrong.' });
                }
            });
        },
        function (result, body, nextCall) {

            var postdata = {
                'title':body.title,
                'content':body.content,
                'status':body.status
            }

            PageSchema.findOneAndUpdate({ "_id": result._id }, { $set: postdata }, function (error, results) {
                if (error) {
                    nextCall({ message: 'Something went wrong.' });
                } else {
                    nextCall(null, {
                        status: 200,
                        message: 'Page update successfully.',
                        data:{}
                    });
                }
            });
        }
    ], function (err, response) {
        if (err) {
            return res.status(202).json({ success: '0', message: err,data:{}});   
        }
        
        return res.status(200).json(response);   
    });

},
update_status_page:function(req,res,next)
{
    async.waterfall([
        function (nextCall) { 

            req.checkBody('p_id', 'Page Id is required.').notEmpty();

            var error = req.validationErrors();
            if (error && error.length) {
                return nextCall({ message: error[0].msg });
            }
            nextCall(null, req.body);
        },
        function (body, nextCall) {

            var postdata = {
                'status': body.value
            }
              var _id = body.p_id;

              PageSchema.findOneAndUpdate({ "_id": _id }, { $set: postdata }, function (error, results) {
                if (error) {
                    nextCall({ message: 'Something went wrong.' });
                } else {
                    nextCall(null, {
                        status: 200,
                        message: 'Page status update successfully.',
                    });
                }
            });
        }
    ], function (err, response) {
        if (err) 
        {
            return res.status(202).json({ success: '0', message: err,data:{}});   
        }

        return res.status(200).json(response);   
    });

}

/*********end************Page************************************/

};

module.exports = usercontroller;