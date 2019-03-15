var spawn = require('child_process').spawn;
const {c, cpp, node, python, java} = require('compile-run');
var shell = require('shelljs');
var request = require('sync-request');
module.exports = function(message, done) {
    //done('Awesome thread script may run in browser and node.js!');
   java.runFile(req.cookies.email+req.cookies.username+req.query.quesid+'.cpp', { stdin:'3\n2 '});
    resultPromise = java.runFile(, { stdin:'3\n2 '});
   resultPromise
       .then(result => {
           console.log(result);//result object
           done(result);
        })
       .catch(err => {
           console.log(err);
           done(err);
       }); 
    
};