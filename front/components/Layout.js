import Head from 'next/head';
import Navbar from './Navbar';
import Footer from './Footer';

const Layout = ({title,children})=>(
        <div>
            <Head>
                <meta httpEquiv="Content-Type" content="text/html; charset=UTF-8" />
                <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
                <meta name="format-detection" content="telephone=no" />
                <title>{title}</title>
                <meta name="description" content="" />
                <meta name="keywords" content="" />
                <meta name="author" content="" />
                <meta name="language" content="en-us" />
                <link rel="icon" href="/static/images/fevicon.ico" type="image/x-icon" />
                
                <link rel="stylesheet" type="text/css" href="/static/css/reset.css" />
                <link rel="stylesheet" type="text/css" href="/static/css/style.css" />
                <link rel="stylesheet" type="text/css" href="/static/css/media.css" />
                
                <link rel="stylesheet" type="text/css" href="/static/css/fonts.css" />
                <link href="https://fonts.googleapis.com/css?family=Montserrat:400,500,600,700" rel="stylesheet" />
            </Head>  
             <Navbar />
            {/* <div className="container">
                {props.children}
            </div> */}

            <div className="page-wrapper">
                <div id="mid-wrapper" className="clearfix">
                  {children} 
                </div> 
            </div>

             <Footer />
             {/* <script src="/static/js/jquery.min.js" async></script>
             <script src="/static/js/custom.js" async></script>
             <script src="/static/js/web.js" async></script> */}
        </div>
)

export default Layout;    