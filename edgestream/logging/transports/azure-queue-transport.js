const Transport = require('winston-transport');
const azure = require('azure-storage');
const util = require('util');

const queueSvc = azure.createQueueService();

//
// Inherit from `winston-transport` so you can take advantage
// of the base functionality and `.exceptions.handle()`.
//
module.exports = class EdgesreamQueueTransport extends Transport {
  constructor(opts) {
    super(opts);

    console.log("options");
    //
    // Consume any custom options here. e.g.:
    // - Connection information for databases
    // - Authentication information for APIs (e.g. loggly, papertrail, 
    //   logentries, etc.).
    //
    var myFirstPromise = new Promise((resolve, reject) => {
      queueSvc.createQueueIfNotExists('logs-platform', function(error, result, response){
          if(!error){
              // Queue created or exists
              console.log('ES-QUEUE-LOG: queue connected');
              resolve(result);
          }else{
              console.log('ES-QUEUE-ERR: ' + error.message);
              reject(error);
          }
      });
    });

    
  }

  log(info, callback) {
    setImmediate(() => {
      this.emit('logged', info);
    });

    // Perform the writing to the remote service
    queueSvc.createMessage('logs-platform', JSON.stringify(info).toString('base64'), function(error, result, response){
      if(!error){
        // Message inserted
        console.log('ES-QUEUE-MSG: ' + JSON.stringify(info));
        callback();
      }else{
        console.log('ES-QUEUE-ERR: ' + error.message);
        callback();
      }
    });
    
  }
};