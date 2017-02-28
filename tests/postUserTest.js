var boot = require('../server').boot;
var shutdown = require('../server').shutdown;
var reset = require('../server').reset;
var port = require('../server').port;
var superagent = require('superagent-promise')(require('superagent'), Promise);

describe('server', function () {
  before(function () {
    boot();
    reset();    
  });
  var request = {"_id":-10,"pts":-10};
  describe('postDefault', function(){    
    it('should respond to POST request', function(done){
      superagent
      .post('http://localhost:'+port + '/inc_rank')
      .send(request)
      .then(function(res){
        if(res.statusCode===200) done();
        else return;
      })
    });  
    it('should return the same as requested', function(done){
      superagent
      .post('http://localhost:'+port + '/inc_rank')
      .send(request)
      .then(function(res){
        if(res.body.points === request.pts) done();
        else return;
      })
    });  
  });
  after(function () {
    shutdown();
  });
}); 
  