
const uuid = require('uuid')
const id = uuid.v1()
var winston = require('winston');
var seneca = require('seneca')();
const debug = require('debug')('state-microservice')
const name = 'state-microservice'

var esTransports = require('../edgestream/logging/transports/azure-queue-transport.js');

debug('booting %s', name)
debug('Identified by %s', id)

var logging_options = {
    file: {
        level: 'info',
        filename: 'app.log',
        handleExceptions: true,
        format: winston.format.json(),
        maxsize: 5242880, // 5MB
        maxFiles: 5,
        colorize: false,
    },
    console: {
        level: 'debug',
        handleExceptions: true,
        format: winston.format.json(),
        colorize: true,
    },
};

/*
var logger = winston.createLogger({
    transports: [
        new winston.transports.File(logging_options.file),
        new winston.transports.Console(logging_options.console)
    ],
    exitOnError: false, // do not exit on handled exceptions
});
*/

let logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.printf(info => {
            return `${info.timestamp} ${info.level}: ${info.message}`;
        })
    ),    
    transports: [new esTransports()]
});

logger.info('Hello world!', {timestamp: Date.now(), pid: process.pid});

debug('Creating NY Salestax');
var pattern_ny = { role: 'NY', cmd: 'salestax' };
var action_ny = function (msg, done) {
    var rate = 0.08;
    var total = msg.net * ( 1 + rate );
    done( null, { total: total } );
 };

 debug('Creating FL Salestax');
var pattern_fl = { role: 'FL', cmd: 'salestax' };
var action_fl = function (msg, done) {
    var rate = 0.04;
    var total = msg.net * ( 1 + rate );
    done( null, { total: total } );
 };

 debug('Adding NY Salestax');
seneca.add( pattern_ny, action_ny);
debug('Adding FL Salestax');
seneca.add( pattern_fl, action_fl);

 //invoking the function
 
 debug('Testing NY Salestax');
 var message = {  role: 'NY', cmd: 'salestax', net: 150 };
 seneca.act( message, function (err, result) {
    debug('NY Salestax Result for ' + message.net + ' is ' + result.total);
 } );

 debug('Testing FL Salestax');
 message = {  role: 'FL', cmd: 'salestax', net: 150 };
 seneca.act( message, function (err, result) {
    debug('FL Salestax Result for ' + message.net + ' is ' + result.total);
 } );
 