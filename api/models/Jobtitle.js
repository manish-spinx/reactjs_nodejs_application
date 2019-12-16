import mongoose from "mongoose";
import crypto from "crypto";
import connection from "../../db/connection";
import moment from "moment";
var Schema = mongoose.Schema;


// model schema
var schema = new Schema({
    name: {
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
       //default: DS.now()
       default: moment().toISOString()
    },
    created_at: {
       type: Date,
       //default: DS.now()
       default: moment().toISOString()
    }
}, {
    collection: 'tbl_job_titles'
});

schema.pre('save', function(next) {
    this.updated_at = moment().toISOString();
    this.created_at = moment().toISOString();
    next();
});

schema.pre('update', function(next) {
    this.update({}, { $set: { updated_at: moment().toISOString() } });
    next();
});

module.exports = connection.model(schema.options.collection, schema);
