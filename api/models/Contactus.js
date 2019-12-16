import mongoose from "mongoose";
import connection from "../../db/connection";
import moment from "moment";

var Schema = mongoose.Schema;
//var ObjectId = mongoose.Schema.Types.ObjectId;

// model schema
var schema = new Schema({
    name: {
        type: String,
        default: ''
    },
    email: {
        type: String,
        default: ''
    },
    message: {
        type: String,
        default: ''
    },
    phone:{
        type: String,
        default: ''  
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
    collection: 'tbl_contact_us'
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
