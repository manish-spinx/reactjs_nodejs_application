import mongoose from "mongoose";
import crypto from "crypto";
import connection from "../../db/connection";
import moment from "moment";
import ED from "../../services/encry_decry.js";
import md5 from "md5";

var Schema = mongoose.Schema;
var ObjectId = mongoose.Schema.Types.ObjectId;

// model schema
var schema = new Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        default: ''
    },
    name: {
        type: String,
        default: ''
    },
    company_name:{
        type: String,
        default: '' 
    },
    gender:{
        type: String,
        default: '' 
    },
    country:{
        type: String,
        default: '' 
    },
    mobile: {
      type: String,
      default: ''  
    },
    edu_list:{
        type: [String],
        default: []  
    },
    team:{
        type: [String],
        default: []  
    },
    profile_image:{
      type: String,
      default: ''  
    },
    dateofjoin:{
        type: String,
        default: ''  
    },
    address:{
        type: String,
        default: ''  
    },
    access_token: {
      type: String,
       default: ''  
    },
    ckeditor_info:{
        type: String,
        default: ''         
    },
    status: {
        type: Number,
        default: 0
        /* 1 = active, 0 = inactive, 2= deleted*/
    },
    updated_at: {
        type: Date,
        default: moment().toISOString()
    },
    created_at: {
        type: Date,
        default: moment().toISOString()
    }
}, {
    collection: 'tbl_users_angular'
});

schema.pre('save', function(next) {

    var user = this;
    user.password = md5(user.password);
    this.updatedAt = moment().toISOString();
    this.createdAt = moment().toISOString();   
    next();
});

schema.pre('update', function(next) {
    this.update({}, { $set: 
                          { 
                               updated_at: moment().toISOString() 
                           } });
    next();
});

module.exports = connection.model(schema.options.collection, schema);
