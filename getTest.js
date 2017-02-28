var boot = require('../server').boot;
var shutdown = require('../server').shutdown;
var port = require('../server').port;
var superagent = require('superagent-promise')(require('superagent'), Promise);

describe('server', function () {
  before(function () {
    boot();    
  });
  describe('getDefault', function(){      
    it('should respond to GET', function(done){
      superagent
      .get('http://localhost:'+port)
      .then(function(res){
        if(res.statusCode===200) done();
        else return;
      })
    });
    it('should get array', function(done){
      superagent
      .get('http://localhost:'+port)
      .then(function(res){console.log(res.body);
        if(Array.isArray(res.body)) done();
        else return;
      })
    });
  });
  after(function () {
    shutdown();
  });
}); 
  