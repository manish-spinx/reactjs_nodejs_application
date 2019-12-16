
import config from '../config/global';
import crypto from "crypto";

var _self = {
    check_obj_empty : function(obj)
    {    
           if (obj == null)
           { 
              return true;
           } 
            // Assume if it has a length property with a non-zero value
            // that that property is correct.
            if (obj.length && obj.length > 0) {
                return false;
            } 
            if (obj.length === 0){
                return true;
            } 
            // Otherwise, does it have any properties of its own?
            // Note that this doesn't handle
            // toString and toValue enumeration bugs in IE < 9
            for (var key in obj) 
            {
                if(hasOwnProperty.call(obj, key)){
                    return false;
                } 
            }
            return true;
    },
    randomAsciiString: function(length)
    {
        return _self.randomString(length,'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789');
    },
    randomString : function(length, chars)
    {
        if (!chars) {
            throw new Error('Argument \'chars\' is undefined');
          }
        
          var charsLength = chars.length;
          if (charsLength > 256) {
            throw new Error('Argument \'chars\' should not have more than 256 characters'
              + ', otherwise unpredictability will be broken');
          }
        
          var randomBytes = crypto.randomBytes(length);
          var result = new Array(length);
        
          var cursor = 0;
          for (var i = 0; i < length; i++) {
            cursor += randomBytes[i];
            result[i] = chars[cursor % charsLength];
          }
        
          return result.join('');
    }
};

module.exports = _self;
