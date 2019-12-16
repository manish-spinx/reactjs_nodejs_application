import crypto from "crypto";
import fs from "fs";
import path from "path";  
import fileExtension from 'file-extension';  
import Common from './common_function';  

var _self = {
    uploadFile: function uploadFile(val,Upload_File_PATH, callback) 
    {
        var original_file_namee = val.originalFilename;
        var get_ext_name = fileExtension(original_file_namee);
        var download_file_namee = new Date().getTime()+'_'+Common.randomAsciiString(25)+'.'+get_ext_name;
        var temp_path = val.path;
        var physical_path = '';

        if(Upload_File_PATH=='')
        {
            physical_path = './public/uploads/'+download_file_namee;
        }
        else{
            //physical_path = './public/uploads/'+Upload_File_PATH+'/'+download_file_namee;
            physical_path = Upload_File_PATH+download_file_namee;
        }

        fs.readFile(temp_path, function(err, data1) {            
                fs.writeFile(physical_path, data1, function(error) {
                    if (error) 
                    { 
                        return callback({message: err,status:0})
                    }
                    else{                          
                        callback(null,{status:1,filename:download_file_namee});
                    }
                });

        });
    },
    remove: function remove(options, callback) 
    {
         fs.unlink(options, function(error) 
         {
                if (error) {
                    console.log(error);
                }                                  
        });
    }
};

module.exports = _self;