/**
 * Create and export configuration variables
 * 
 */


 // Container for all the environments
var environments = {};


// Staiging (default) environment
environments.staiging = {
    'httpPort': 3000,
    'httpsPort': 3001,
    'envName': 'staiging',
    'hashingSecret': 'thisIsASecret',
    'maxChecks': 5,
    'twilio': {
        'accountSid': 'AC490496c3effee01d6554c46cd565eb31',
        'authToken': '78fb0e8632c3321bd50568a3542d9e1b',
        'fromPhone': '+12028834885'
    }
};

//2028834885


// Production environment
environments.production = {
    'httpPort': 5000,
    'httpsPort': 5001,
    'envName': 'production',
    'hashingSecret': 'thisIsAlsoASecret',
    'maxChecks': 5,
    'twilio': {
        'accountSid': 'ACb32d411ad7fe886aac54c665d25e5c5d',
        'authToken': '9455e3eb3109edc12e3d8c92768f7a67',
        'fromPhone': '9773161813'
    }
};

// Detwermine which environment was passed as a command-line argument
var currentEnvironment = typeof(process.env.NODE_ENV) == 'string' ? process.env.NODE_ENV.toLowerCase() : '';
var environmentToExport = typeof(environments[currentEnvironment]) == 'object' ? environments[currentEnvironment] : environments.staiging;

// Export the module
module.exports = environmentToExport;
