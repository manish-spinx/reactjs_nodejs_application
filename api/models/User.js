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
        //required: true
        default: ''
    },
    name: {
        type: String,
        default: ''
    },
    mobile: {
      type: String,
      default: ''  
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
    hobby:{
        type: String,
        default: ''  
    },
    skills:{
        type: [String],
        default: []  
    },
    role:{
        type: String,
        default: ''  
    },
    your_post:{
        type: String,
        default: ''  
    },
    new_idea:{
        type: String,
        default: ''  
    },
    access_token: {
      type: String,
       default: ''  
    },
    forgotpassword_code:{
        type:String,
        default:''
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
    collection: 'tbl_users'
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

// schema.methods.comparePassword = function(candidatePassword, cb) {
//     var match = false;

//     candidatePassword = ED.encrypt(candidatePassword);

//     if (candidatePassword === this.password) {
//         match = true;
//     }
//     cb(match);
// };

module.exports = connection.model(schema.options.collection, schema);
