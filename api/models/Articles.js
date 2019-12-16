import mongoose from "mongoose";
import crypto from "crypto";
import connection from "../../db/connection";
import moment from "moment";

var Schema = mongoose.Schema;
//var ObjectId = mongoose.Schema.Types.ObjectId;

// model schema
var schema = new Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        default: ''
    },
    dateofarticle:{
        type: String,
        default: ''  
    },
    slug:{
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
    collection: 'tbl_articles'
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
