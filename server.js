const express = require('express');
const fs = require('fs');
const app = express();
const path = require('path');
const ioServer = require('socket.io');
const RTCMultiConnection = require('rtcmulticonnection');
const RTCMultiConnectionServer = require('rtcmulticonnection-server');
const robot = require('robotjs'); 
var options = {
    key: fs.readFileSync('privateKey.key'),
    cert: fs.readFileSync('certificate.crt')
};

app.use(express.static(path.join(__dirname, 'public'))); 

var PORT = 2002;
var config = require('./config.json');


//******************************************************************** */
var httpsApp = require('https').createServer(options, app);

//var connection = new RTCMultiConnectionServer();

RTCMultiConnectionServer.beforeHttpListen(httpsApp, config);
httpsApp = httpsApp.listen(process.env.PORT || PORT, process.env.IP || "0.0.0.0", function() {
    RTCMultiConnectionServer.afterHttpListen(httpsApp, config);
});


ioServer(httpsApp).on('connection', function(socket) {
    RTCMultiConnectionServer.addSocket(socket, config);
//*************************************************************** */
    // ----------------------
    // below code is optional

    const params = socket.handshake.query;

    if (!params.socketCustomEvent) {
        params.socketCustomEvent = 'custom-message';
    }

    socket.on(params.socketCustomEvent, function(message) {
        var x                   = message.mouse.mouse_position.x;
        var y                   = message.mouse.mouse_position.y;
        var mousedownLeft       = message.mouse.mouse_click.mousedownLeft;
        var mousedownRight      = message.mouse.mouse_click.mousedownRight;
        let key                 = message.keyboard.key;
        if(key !== null){
            if(key === 'Backspace')
                robot.keyTap("backspace")
            else
                robot.keyTap(key)
            console.log(message.keyboard.key)
        }
        if(mousedownLeft){
            robot.mouseClick("left")
        }
        else if(mousedownRight){
            robot.mouseClick("right")
        }
        robot.moveMouse(x, y);
        //console.log(message.keyboard);
        socket.broadcast.emit(params.socketCustomEvent, message);
    });
});
