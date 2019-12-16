import mongoose from "mongoose";
import connection from "../../db/connection";
import moment from "moment";

var Schema = mongoose.Schema;

// model schema
var schema = new Schema({
    title: {
        type: String,
        default: ''
    },
    logo_image:{
      type: String,
      default: ''  
    },
    p_type_history:{
        type: Number,
        default: 0  
    },
    p_type_industry:{
        type: Number,
        default: 0  
    },
    p_type_software : {
        type: Number,
        default: 0  
    },
    content:{
        type: String,
        default: ''  
    },
    investment_date:{
        type: String,
        default: ''  
    },
    headquarters:{
        type: String,
        default: ''  
    },
    website_url:{
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
    collection: 'tbl_portfolio'
});

schema.pre('save', function(next) {
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
