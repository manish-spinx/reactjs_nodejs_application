import jwt from "jsonwebtoken";
import config from '../config/global.js'
import UserSchema from "../api/models/User";


const verifyUser = function (req, res,next) 
{
	if (!config.jwtTokenVerificationEnable) { // skip jwt verification
        return next();
    }
    
    // if id not found
    if (!req.currUser || (req.currUser && !req.currUser._id)) {
        return res.status(401).json({ status: 0, message: "invalid user.1" }); // send unauthorized response
    }

    var reqToken = req.body.token || req.query.token || req.headers['token'];

    UserSchema
        .findOne({ _id: req.currUser._id, access_token: reqToken })
        .select({ password: 0 })
        .lean()
        .exec(function(err, user) {
            if (err) 
            {
                debug("Error while getting login user details : ", err);
                return res.status(500).json({ status: 0, message: "Server error." }); // send server error
            }

            if (!user) { // if not found user for this id
                return res.status(401).json({message: "invalid user.2",status:401 }); // send unauthorized response
                //return res.status(401).json({ status: 0, message: "invalid user."}); // send unauthorized response
            }

            req.currUser = user; // store user in request parameter
            next();
        });

};

export default verifyUser;