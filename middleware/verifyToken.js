import jwt from "jsonwebtoken";
import config from '../config/global.js'

const verifyToken=function (req, res,next) 
{
	if (!config.jwtTokenVerificationEnable) { // skip user verification
        return next();
	}
	
	var token = req.body.token || req.query.token || req.headers['token'];

	 if (token) 
	 {
		// verify secret and checks exp
		jwt.verify(token,config.secret, function (err, currUser) 
		{
			 //console.log('-----check---curruser-----');
			 //console.log(currUser);
			if (err) 
			{
				return res.status(401).json({ success: '2', message: 'Invalid Access.. Token Expaired'}); 

			} else {			
				req.currUser = currUser;
				next();
			}
		});
	}
	 else {
		return res.status(401).json({ success: '2', message: 'Invalid Access.. Token Expaired'});     
	
	}
};

export default verifyToken;