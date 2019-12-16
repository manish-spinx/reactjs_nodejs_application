import mongoose from "mongoose";
import connection from "../../db/connection";
import moment from "moment";


var Schema = mongoose.Schema;

// model schema
var schema = new Schema({
    name: {
        type: String,
        default: ''
    },
    bio: {
        type: String,
        default: ''
    },
    status: {
        type: Number,
        default: 0
        /* 1 = active, 0 = inactive, 2= deleted*/
    },
    p_type:{
        type: Number,
        default: 0
        /* 1 = Advisor, 2 = CEO, 3= Team Member*/
    },   
    job_title_other:{
        type: String,
        default: ''
    },    
    // job_id:{
    //     type: Schema.Types.ObjectId,
    //     ref: 'tbl_job_titles'
    // },
    // job_id:{
    //     type: String,
    //     default: ''
    // },
    job_id:{
        type: Schema.Types.ObjectId,
        ref: 'tbl_job_titles'
    },
    profile_image:{
        type: String,
        default: ''
    },    
    portfolios:{
        type: [String],
        default: []  
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
    collection: 'tbl_people'
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
