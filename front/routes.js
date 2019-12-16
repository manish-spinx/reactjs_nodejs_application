const routes = require('next-routes')

module.exports = routes()

.add('index', '/')
.add('about', '/About')
.add('contact', '/Contact')
.add('strategy', '/Strategy')

.add('aboutceo', '/About/CEOs')
.add('aboutceodetail','/About/CEOs/:slug')

.add('aboutadvisors','/About/Advisors')
.add('aboutadvisorsdetail','/About/Advisors/:slug')

.add('portfolio', '/Portfolio')
.add('portfoliodetail','/Portfolio/:slug')

.add('aboutourteam','/About/OurTeam')
.add('teamdetail','/About/OurTeam/:slug')

.add('news','/News')
.add('newsnew','/Newsnew')
.add('newsdetail','/News/:slug')

.add('login','/Login')
.add('register','/Register')
.add('changepassword','/Changepassword')
.add('editprofile','/Editprofile')
.add('forgetpassword','/Forgetpassword')
.add('resetpassword','/Resetpassword/:slug')

.add('errorPage','Error/PageNotFound')

//.add('portfolioNew', '/portfolios/new')
// .add('portfolio', '/portfolio/:id')
// .add('portfolioEdit', '/portfolios/:id/edit')
// .add('userBlogs', '/blogs/dashboard')
// .add('blogEditor', '/blogs/new')
// .add('blogDetail', '/blogs/:slug')
// .add('blogEditorUpdate', '/blogs/:id/edit')