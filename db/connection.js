import mongoose from 'mongoose'
import mysql from 'mysql'
import config from '../config/global.js'


var connection = '';

// DB configuration
if (config.database.use === 'mongodb') 
{
    connection = mongoose.createConnection(config.database.mongoURL); // database name
    connection.on('error', console.error.bind(console, 'connection error:'));
    console.log('mongo db connect successfully..');
}
else {
	debug('Failed to connect with db');
}

module.exports = connection;


