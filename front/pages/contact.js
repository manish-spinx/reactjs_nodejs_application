import React, { Component } from 'react';
import axios from 'axios'; 
import GoogleMapReact from 'google-map-react';
import ReCAPTCHA from "react-google-recaptcha";

//import { Map, GoogleApiWrapper } from 'google-maps-react';
import Layout from '../components/Layout';
import {FETCH_NODE_API_URL} from '../components/ServerApi';


const AnyReactComponent = ({ text }) => <React.Fragment><div className="pin">{text}</div> <div className="pulse"></div></React.Fragment>;

//const AnyReactComponent = ({ text }) => <React.Fragment><div className="pin" style={{"backgroundImage":"url(http://projects.spinxweb.net/auroracapmvc/Content/images/aurora-map-marker2.png)"}}>{text}</div></React.Fragment>;

const recaptchaRef = React.createRef();

export default class Contact extends Component 
{
    constructor(props) {
        super(props)

        this.state = {
            name:'',
            email:'',
            phone:'',
            message:'',
            recaptcha_value:'',
            nameError:'',
            emailError:'',
            messageError:'',  
            recaptchaError:'',    
            msgflash:false      
        };

        this.submitForm = this.submitForm.bind(this);
        this.check_validation = this.check_validation.bind(this);
        this.onChange_watch = this.onChange_watch.bind(this);

        this.close_alert = this.close_alert.bind(this);
        this.onChange_captcha = this.onChange_captcha.bind(this);

    }

    check_validation()
    {
        let nameError = "";   
        let emailError = ""; 
        let messageError = "";
        let recaptchaError = "";

        if(!this.state.name)
        {
          nameError = 'Name is Required.';
        }

        if(!this.state.email)
        {
            
            emailError = 'Email is Required.';
        }

        if(!this.state.email.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i) && this.state.email!='')
        {
          emailError = 'Please Enter Valid Email id.';
        }

        if(!this.state.message)
        {
            messageError = 'Message is Required.';
        }

        if(!this.state.recaptcha_value)
        {
            recaptchaError = 'Google recaptcha is Required.';
        }

        if(nameError || emailError || messageError || recaptchaError)
         {
              this.setState({nameError,emailError,messageError,recaptchaError});
              return false;
         }
         else{
          return true; 
         }

    }

    onChange_watch(e)
    {
        this.setState({
            [e.target.name] : e.target.value
         });
    }

    async submitForm(e){
        e.preventDefault(); 
        
        const isVaild = this.check_validation();

        if(isVaild)
        {
            this.setState({nameError:'',emailError:'',messageError:''});


            const res = await axios.post(FETCH_NODE_API_URL()+'inquiry_add',
                                        {
                                            name:this.state.name,
                                            email:this.state.email,
                                            phone:this.state.phone,
                                            message:this.state.message
                                        });

            if(res.data.status==200)
            {
                this.setState({
                                msgflash:true,
                                name:'',
                                email:'',
                                phone:'',
                                message:'',
                              });

                    recaptchaRef.current.reset();
            }


        }
        else{
            console.log('validaiton fire !!');            
        }
    }    

    async close_alert(e)
    {
        e.preventDefault(); 

        await this.setState({
              msgflash:false
          });
    }

    renderMarkers(map, maps)
    {
        const marker = new maps.Marker({
            position: myLatLng,
            map,
            title: 'Hello World!'
          });

          return marker;
    }

    getMapOptions = (maps) => {

        return {
            streetViewControl: false,
            scaleControl: true,
            fullscreenControl: false,
            styles: [{
                featureType: "poi.business",
                elementType: "labels",
                stylers: [{
                    visibility: "off"
                }]
            }],
            gestureHandling: "greedy",
            disableDoubleClickZoom: true,
            minZoom: 11,
            maxZoom: 15,
    
            mapTypeControl: true,
            mapTypeId: maps.MapTypeId.SATELLITE,
            mapTypeControlOptions: {
                style: maps.MapTypeControlStyle.HORIZONTAL_BAR,
                position: maps.ControlPosition.BOTTOM_CENTER,
                mapTypeIds: [
                    maps.MapTypeId.ROADMAP,
                    maps.MapTypeId.SATELLITE,
                    maps.MapTypeId.HYBRID
                ]
            },
    
            zoomControl: true,
            clickableIcons: false
        };
    }

    async onChange_captcha(e)
    {
          await this.setState({
            recaptcha_value:e,
            recaptchaError:''
        });
    }


    
    render() {
        const {msgflash} = this.state;
        const  center = {lat: 34.059680, lng: -118.442570};
        const pinImage = 'http://projects.spinxweb.net/auroracapmvc/Content/images/aurora-map-marker2.png';

        return (             
            <Layout title='Contact - Aurora Capital Partners'>
                
                <section className="cmn-banner page-title" >
                <div className="imgDiv web-view" style={{"backgroundImage":"url(/static/images/contact-banner.jpg)"}}></div>
                <div className="imgDiv mob-view" style={{"backgroundImage":"url(/static/images/contact-banner.jpg)"}}></div>
                <div className="banner-title">
                <h1>Contact</h1>
                </div>
                </section>

                <section className="contact-wrap">
                <div className="fix-wrap">
                <div className="contact-left">

                {
                    msgflash && 
                    <div data-msg="">
                        <div className="alert alert-success fade in">
                            <a data-dismiss="alert" className="close" onClick={this.close_alert}>×</a>
                            <i className="fa-fw fa fa-check"></i>
                            Thank you for contacting us. We will get back to you soon.
                        </div>
                    </div>
                }

                
                <form method="post" onSubmit={this.submitForm} method="post">

                    <div className="form-group">
                    <label htmlFor="name">Full Name</label>
                    <input type="text" id="name" name="name" value={this.state.name} onChange={this.onChange_watch}/>
                    <div className="validation-error">{this.state.nameError}</div>
                    </div>

                    <div className="form-group">
                    <label htmlFor="email">Email Address</label>
                    <input type="email" id="email" name="email" value={this.state.email} onChange={this.onChange_watch}/>
                    <div className="validation-error">{this.state.emailError}</div>
                    </div>

                    <div className="form-group">
                    <label htmlFor="phone">Phone (Optional)</label>
                    <input type="tel" id="phone" name="phone" value={this.state.phone} onChange={this.onChange_watch}/>
                    </div>

                    <div className="form-group">
                    <label htmlFor="Message">Message</label>
                    <textarea id="message" name="message" value={this.state.message} onChange={this.onChange_watch}></textarea>
                    <div className="validation-error">{this.state.messageError}</div>
                    </div>

                    <div className="form-group">
                    <ReCAPTCHA sitekey="6LeElMUUAAAAAE8WZChxhk0qa_F5A4L54jYnhCLg" ref={recaptchaRef} onChange={this.onChange_captcha} />
                    <div className="validation-error">{this.state.recaptchaError}</div>
                    </div>

                    <div className="form-group btn-action">
                    <input type="submit" className="btn-primary" name="" value="SUBMIT" />
                    </div>

                </form>

                </div>
                <div className="contact-right">
                <h2>Let's Connect</h2>
                <p>10877 Wilshire Boulevard, 21st Floor <br/>Los Angeles, CA 90024</p>
                <p><strong>T.</strong> <a h="tel:(310) 551-0101" className="phone">(310) 551-0101</a> <br/><strong>E.</strong> <a href="mailto:info@auroracap.com">info@auroracap.com</a></p>
                <p><a href="https://www.linkedin.com/company/aurora-capital-group/" target="_blank"><img src="/static/images/linkedin-logo-dark.png" width="19" alt="LinkedIn" /></a></p>

                <div className="gmap" style={{ height: '100vh', width: '100%' }}>
                {/* <img src="/static/images/map.jpg" alt="Google map" /> */}

                {/* <Map
                    google={this.props.google}
                    apiKey = {'AIzaSyDmdPkeRHjSv5vmVGZyL3RNgtfANGOKMw8'}
                    zoom={14}
                    style={mapStyles}
                    initialCenter={{
                    lat: -1.2884,
                    lng: 36.8233
                    }}
                /> */}


                 <GoogleMapReact
                    bootstrapURLKeys={{ key:'AIzaSyDmdPkeRHjSv5vmVGZyL3RNgtfANGOKMw8'}}
                    defaultCenter={center}
                    defaultZoom={11}
                    icon={pinImage}
                    yesIWantToUseGoogleMapApiInternals={true}
                    heatmapLibrary={true}
                    center={center}
                    mapTypeControl={true}
                    //options={this.getMapOptions}
                    >
                         <AnyReactComponent
                            lat={34.059680}
                            lng={-118.442570}
                         /> 

                    </GoogleMapReact> 

                </div>
                </div>
                </div>
                </section>

            </Layout>             
        );
      }
}

// export default GoogleApiWrapper({
//     apiKey: 'AIzaSyDmdPkeRHjSv5vmVGZyL3RNgtfANGOKMw8'
//   })(MapContainer);
