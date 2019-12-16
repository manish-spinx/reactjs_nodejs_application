require('dotenv').config();
module.exports = {
  'PROJECT_NAME': 'auroracapmvc',
  'PORT': 3005,
  'apiVersion': 'v1',
  
  'appHost': process.env.APPHost,
  'apiHost': process.env.APIHost,
  'appHost_view_user_image': process.env.VIEW_USER_IMAGE,
  'appHost_view_people_image': process.env.PEOPLE_USER_IMAGE,
  'appHost_view_strategy_image': process.env.STRATEGIES_IMAGE,
  'appHost_view_icon_image': process.env.STRATEGIES_ICON,
  'appHost_view_portfolio_logo': process.env.PORTFOLIO_LOGO,

  'setNewPasswordLink': 'http://localhost:3005/admin/#/setPassword/',
  'temp_logo_link':'https://spinx-live-6jsc7gkvbdujvrbfu3miqzaj1t1.netdna-ssl.com/images/spinx-logo.png',

  'database': {
    'mongoURL': process.env.MONGOURL,//'mongodb://localhost:27017/auroracapmvc',
    'mySQLConfig': {
      'connectionLimit': 10, // Max. connection limit
      'host': 'localhost', // DB Hostname
      'user': 'root', // DB username
      'password': '', // DB Password
      'database': '' // DB name
    },
    'use': 'mongodb' // specify db =>  mongodb , mysql
  },

  'jwtTokenVerificationEnable': true, // true/false
  //'secret': '#sp!nxdigit@l*', // jwt secret key
  'secret': process.env.JWT_TOKEN_SECRET, // jwt secret key
  'cryptoEnable': false, // To enable this method
  'cryptoKey': 'sp!nxdigit@l$ess', // Secret encryption key
  'cryptoIV': 'a2xhcgAAAAAAAAAA', // Secret encryption IV

  'socket': {
    'enable': false
  },

  'mailOptions': 
  {
    host: process.env.SMTP_HOST,//"smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    }
  },

  'notification': { // Push Notificatoin
    'enable': false, // enable/disable notification
    'androidApiKey': '' // android api key
  },

  'adminEmail': '',

  'adminAuthentication': {
    'enable': true
  },
}