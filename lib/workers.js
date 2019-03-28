/**
 * worker-related tasks
 * 
 */

// Dependencies
var path = require('path');
var fs = require('fs');
var _data = require('./data');
var https = require('http');
var https = require('https');
var helpers = require('./helpers');
var url = require('url');

// Instanciate the worker object
var workers = {};


// Lookup the all checks, get their data, send to a validator
workers.gatherAllChecks = function() {
    // Get all the checks 
    _data.list('checks', function(err, checks){
        if(!err && checks && checks.length > 0){
            checks.forEach(function(check) {
                // Read in the check data 
                _data.read('checks', check, function(err, originalCheckData){
                    if(!ee && originalCheckData){
                        // Pass it to the check validator, and let that function continue or log errors as needed
                        workers.validateCheckData(originalCheckData);
                    }else{
                        console.log("Error: reading one of the check's data");
                    }
                });
            });
        }else {
            console.log('Error: Could not find any checks to process');
        }
    });
};

// Sanity-check the check-data
workers.validateCheckData = function(originalCheckData) {
    originalCheckData = typeof(originalCheckData) == 'object' && originalCheckData != null ? originalCheckData : {};
    originalCheckData.id = helpers.checkIsString(originalCheckData.id) && originalCheckData.id.trim().length == 20 ? originalCheckData.id.trim() : false;
    originalCheckData.userPhone = helpers.checkIsString(originalCheckData.userPhone) && originalCheckData.userPhone.trim().length == 10 ? originalCheckData.userPhone.trim() : false;
    originalCheckData.protocol = helpers.checkIsString(originalCheckData.protocol) && ~['http', 'https'].indexOf(originalCheckData.protocol) ? originalCheckData.protocol.trim() : false;
    originalCheckData.url = helpers.checkIsString(originalCheckData.url) && originalCheckData.url.trim().length > 0 ? originalCheckData.url.trim() : false;
    originalCheckData.method = helpers.checkIsString(originalCheckData.method) && ~['post', 'get', 'put', 'delete'].indexOf(originalCheckData.method) ? originalCheckData.method.trim() : false;

};

// Timer to execute the worker-process once per minute
workers.loop = function(){
    setInterval(function(){
        workers.gatherAllChecks();
    },1000 * 60);
};


// Init script
workers.init = function(){
    // Execute all the checks immediately
    workers.gatherAllChecks();
    // Call the loop so the checks will execute later on
    workers.loop();
};


// Export module
module.exports = workers;
