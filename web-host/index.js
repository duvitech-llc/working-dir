'use strict';

var express = require('express');

var compression = require('compression');
var helmet = require('helmet');
var path = require('path');
var serverPort = 8080;

var app = express();

var root = __dirname + '/site/';

app.use(express.static('site'));

app.get("/",function(req,res){
    res.sendFile(root + "index.html");
});

// Start the server
app.listen(serverPort, function () {
    console.log('Your server is listening on port %d (http://localhost:%d)', serverPort, serverPort);
});
