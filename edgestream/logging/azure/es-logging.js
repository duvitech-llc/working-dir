var azure = require('azure-storage');

var queueSvc = azure.createQueueService();

module.exports = {
    logConnect: function(){
        // Run in a fiber 
        queueSvc.createQueueIfNotExists('logs-test', function(error, result, response){
            if(!error){
                // Queue created or exists
                console.log('ESLOGGING-LOG: queue connected');
                return true;
            }else{
                console.log('ESLOGGING-ERR: ' + error.message);
                return false;
            }
        });
    },
    logMessage: function(msg){
        queueSvc.createMessage('logs-test', msg.toString('base64'), function(error, result, response){
          if(!error){
            // Message inserted
            console.log('ESLOGGING-MSG: ' + msg);
            return true;
          }else{
            console.log('ESLOGGING-ERR: ' + error.message);
            
            return false;
          }
        });
    }
}