import express from "express";
import compression from "compression";
import path from "path";
import servefavicon from "serve-favicon";
import logger from "morgan";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import verifyToken from "./middleware/verifyToken.js";
import mysql from "mysql";
import expressValidator from "express-validator";
import http from "http";
import fs from "fs";
import util from "util";
import cors from "cors";
import api_routes_info from "./api/routes/route";
import api_routes_front from "./api/routes/frontroute";

require('dotenv').config();
const app = express();

app.use(compression());
app.use(cors()); 
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.use(bodyParser.json({limit: '1024mb'}));
app.use(bodyParser.urlencoded({ extended: true }));


app.use(expressValidator({
 customValidators: {
   	gte: function(param, num) {
        return param >= num;
    }  
 }
}));

app.use(cookieParser());


app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Credentials", true);
    res.header('Access-Control-Allow-Origin', req.headers.origin);
	res.header("Access-Control-Allow-Headers", "Content-Type, X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5,  Date, X-Api-Version, X-File-Name, user-access-token,token");
	res.header('Access-Control-Allow-Methods', "POST, GET, PUT, DELETE, OPTIONS");
    next();
});


app.use(express.static(path.join(__dirname, 'public')));
app.use('/admin_api', api_routes_info);
app.use('/front_api', api_routes_front);


// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'production' || process.env.NODE_ENV==='production') 
{
	app.use(express.static('client/build'));
	
	app.get('*',(req,res)=>{
         res.sendFile(path.resolve(__dirname,'client','build','index.html'));
	});
}


// catch 404 and forward to error handler
app.use(function(req, res, next) 
{
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
});

console.log('check thing '+app.get('env'));


if (app.get('env') === 'development') 
{
	app.use(function(err, req, res, next) {
		res.status(err.status || 500);
		res.render('error', {
			message: err.message,
			error: err
		});
	});
}

// app.use(function(err, req, res, next) {
//     res.status(err.status || 500);
//     res.render('error', {
//         message: err.message,
//         error: {}
//     });
// });


//module.exports = app;

export default app;
