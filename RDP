import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
//import  VncDisplay from 'react-vnc-display';
import RTCMultiConnection from 'rtcmulticonnection';
import config from '../config/config';
import '../assets/styles/rdp.css'


var connection = new RTCMultiConnection(); 


class RDP extends Component{
    constructor(props) {
        super(props);
        this.videocontainer = React.createRef();
        this.state = {
            mouse : {
                        "mouse_position": {
                            "x": 0, 
                            "y": 0 
                        }, 
                        "mouse_click": {
                            "mousedownLeft": false, 
                            "mousedownRight": false
                        }
                    },
            keyboard : {
                            "key"       : null,
                            "shiftkey"  : false,
                            "ctrlkey"   : false,
                            "altkey"    : false               
            },
            value : ''
        };
        //this.state = {value : ''};
        this.handleChange    = this.handleChange.bind(this);
        this.handleOpen      = this.handleOpen.bind(this);
        this.handleJoin      = this.handleJoin.bind(this);
        this.handleMouseMove = this.handleMouseMove.bind(this);
        this.handleMouseDown = this.handleMouseDown.bind(this);
        this.handleMouseUp   = this.handleMouseUp.bind(this);
        this.handleKeyPress  = this.handleKeyPress.bind(this);
        

        // ......................................................
        // ..................RTCMultiConnection Code.............
        // ......................................................
        connection.socketURL = `https://signaling-meeva.serveapp.ir/`;
        //connection.socketURL = 'http://localhost:9002/';

        connection.socketMessageEvent = 'screen-sharing';
        connection.setCustomSocketEvent('abcdef');

        connection.session = {
            screen: true,
            oneway: true,
            data:   true
        };

        connection.sdpConstraints.mandatory = {
            OfferToReceiveAudio: false,
            OfferToReceiveVideo: false
        };
        // connection.iceServers = [{
        //     'urls': [
        //         'stun:stun.l.google.com:19302',
        //         'stun:stun1.l.google.com:19302',
        //         'stun:stun2.l.google.com:19302',
        //         'stun:stun.l.google.com:19302?transport=udp',
        //     ]
        // }];
        // first step, ignore default STUN+TURN servers
        connection.iceServers = [];
        
        // second step, set STUN url
        connection.iceServers.push({
            urls: 'stun:stun.l.google.com:19302'
        });
        
        // last step, set TURN url (recommended)
        connection.iceServers.push({
            urls: 'turn:meeva.serveapp.ir:3478',
            credential: 'test',
            username: 'test'
        });
        
        
        connection.onopen = function(event) {
            connection.send(event);
        };
        connection.onmessage = function(event) {
            console.log(event.data);
            //clientX = event.data;
        };
        connection.onstream = function(event) {
            var existing = document.getElementById(event.streamid);
            if(existing && existing.parentNode) {
              existing.parentNode.removeChild(existing);
            }
        
            event.mediaElement.removeAttribute('src');
            event.mediaElement.removeAttribute('srcObject');
            event.mediaElement.muted = true;
            event.mediaElement.volume = 0;
        
            var video = document.createElement('video');
        
            try {
                video.setAttributeNode(document.createAttribute('autoplay'));
                video.setAttributeNode(document.createAttribute('playsinline'));
            } catch (e) {
                video.setAttribute('autoplay', true);
                video.setAttribute('playsinline', true);
            }
        
            if(event.type === 'local') {
              video.volume = 0;
              try {
                  video.setAttributeNode(document.createAttribute('muted'));
              } catch (e) {
                  video.setAttribute('muted', true);
              }
            }
            video.srcObject = event.stream;
        
            // var width = innerWidth - 80;
            // var mediaElement = getHTMLMediaElement(video, {
            //     title: event.userid,
            //     buttons: ['full-screen'],
            //     width: width,
            //     showOnMouseEnter: false
            // });
        
            connection.videosContainer.appendChild(video);
        
            // setTimeout(function() {
            //     video.media.play();
            // }, 5000);
            video.id = event.streamid;
            //document.addEventListener('keydown', event=>{ console.log(event.key)} );
        };
        
    }
    
    handleMouseMove = event => {
        event.preventDefault();
        this.setState({
            mouse : 
            {
                "mouse_position": 
                {
                    "x": event.clientX, 
                    "y": event.clientY 
                }, 
                "mouse_click": 
                {
                    "mousedownLeft": this.state.mouse.mouse_click.mousedownLeft, 
                    "mousedownRight": this.state.mouse.mouse_click.mousedownRight
                }
            },
            keyboard : {
                "key"       : null,
                "shiftkey"  : false,
                "ctrlkey"   : false,
                "altkey"    : false               
            },       

        })
        //console.log(this.state.mouse);
        connection.socket.emit('abcdef', this.state);
    }
    handleMouseDown = event => {
        event.preventDefault();
        if(event.button === 0){
            this.setState({
                mouse : 
                {
                    "mouse_position": 
                    {
                        "x": event.clientX, 
                        "y": event.clientY 
                    }, 
                    "mouse_click": 
                    {
                        "mousedownLeft": true, 
                        "mousedownRight": this.state.mouse.mouse_click.mousedownRight
                    }
                },
                keyboard : {
                    "key"       : null,
                    "shiftkey"  : false,
                    "ctrlkey"   : false,
                    "altkey"    : false               
                },
                
            })
        } else if(event.button === 2){
            this.setState({
                mouse : 
                {
                    "mouse_position": 
                    {
                        "x": event.clientX, 
                        "y": event.clientY 
                    }, 
                    "mouse_click": 
                    {
                        "mousedownLeft": this.state.mouse.mouse_click.mousedownLeft, 
                        "mousedownRight": true
                    }
                },
                
            })
        }
        
        connection.socket.emit('abcdef', this.state);
    }
    handleMouseUp = event =>{
        event.preventDefault();
        this.setState({
            mouse : {
                    "mouse_position": {
                        "x": event.clientX, 
                        "y": event.clientY 
                    }, 
                    "mouse_click": {
                        "mousedownLeft": false, 
                        "mousedownRight": false
                    }
                },
        })
        connection.socket.emit('abcdef', this.state);
    }

    handleChange(event){
        this.setState({value: event.target.value})
    }
    handleOpen(event){
        connection.openOrJoin(this.state.value); 
        event.preventDefault(); 
    }
    handleJoin(event){
        event.preventDefault();
        connection.sdpConstraints.mandatory = {
            OfferToReceiveAudio: false,
            OfferToReceiveVideo: true
        };
        console.log(this.state.value);
        connection.join(this.state.value);
    }
    handleKeyPress  = event => {
        event.preventDefault();
        console.log(event.key);
        //document.getElementById("videos-container").addEventListener('keydown', event =>{console.log(event)} );
        switch(event.key){
            case "shiftkey" :
                this.setState({
                    keyboard : {
                        "key"       : this.state.keyboard.key,
                        "shiftkey"  : true,
                        "ctrlkey"   : false,
                        "altkey"    : false               
                    }
                });
                break;
            case "ctrlkey" :
                this.setState({
                    keyboard : {
                        "key"       : this.state.keyboard.key,
                        "shiftkey"  : false,
                        "ctrlkey"   : true,
                        "altkey"    : false               
                    }
                });
                break;
            case "altkey" :
            this.setState({
                keyboard : {
                    "key"       : this.state.keyboard.key,
                    "shiftkey"  : false,
                    "ctrlkey"   : false,
                    "altkey"    : true               
                }
            });
            break;
            default :
            this.setState({
                keyboard : {
                    "key"       : event.key,
                    "shiftkey"  : false,
                    "ctrlkey"   : false,
                    "altkey"    : false               
                }
            });
        }
        connection.socket.emit('abcdef', this.state);
        
    }
    
    componentDidMount(){
        const video = this.videocontainer.current;
        connection.videosContainer = video;
        
        document.addEventListener('contextmenu', event => event.preventDefault());
        //document.getElementById("videos-container").addEventListener('keydown', console.log("Didmount") );
        
        
    }
    componentDidUpdate(){
        //window.addEventListener('keydown', this.handleKeyPress);
    }
    // componentWillMount() {
    //     document.addEventListener("keydown", this.handleKeyPress);
    // }
    
  
    // componentWillUnmount() {
    //     document.removeEventListener("keydown", this.handleKeyPress);
    // } 
    render(){
        const {x, y} = this.state
        return(
            <div>
                {/* <div tabIndex={0} onKeyPress  ={this.handleKeyPress}>

                    <a className="logo" >
                        <img src="/sdr.png" ></img>
                    </a>
                </div> */}
                <br></br>
                <form onSubmit={this.handleOpen}>
                    <input type="text" id="room-id" value={this.state.value} onChange={this.handleChange} autoCorrect='off' autoCapitalize='off' size='20px' />
                    <br></br>
                    <br></br>

                    <button id="open-room">Open Room</button>
                </form>
                <br></br>
                <form onSubmit={this.handleJoin}>
                    <button id="join-room">Join Room</button>
                </form>

                {/* <button id="open-or-join-room">Auto Open Or Join Room</button> */}
                
                <div    id          ="videos-container" 
                        style       ={{margin: "20px 0"}} 
                        ref         ={this.videocontainer} 
                        onMouseMove ={this.handleMouseMove} 
                        onMouseDown ={this.handleMouseDown} 
                        onMouseUp   ={this.handleMouseUp}
                        onKeyDown   ={this.handleKeyPress}
                        tabIndex    ="0"   
                >
                    {/* <div>
                        The current mouse position is ({x}, {y})
                    </div> */}
                </div>  
            </div>
        )
    }
}

export {RDP}
