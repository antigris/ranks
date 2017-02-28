var boot = require('../server').boot;
var shutdown = require('../server').shutdown;
var port = require('../server').port;
var superagent = require('superagent-promise')(require('superagent'), Promise);

describe('server', function () {
  before(function () {
    boot();    
  });
  describe('postDefault', function(){   
    it('should return 0 as users length', function(done){
      let request = {};
      superagent
      .post('http://localhost:'+port + '/reset_ratings')
      .send(request)
      .then(function(res){
        if(res.body === 0) done();
        else return;
      })
    });     
    it('should respond to POST', function(done){
      let request = {"_id":0,"pts":1};
      superagent
      .post('http://localhost:'+port + '/inc_rank')
      .send(request)
      .then(function(res){
        if(res.statusCode===200) done();
        else return;
      })
    });  
    it('should return the same', function(done){
      let request = {"_id":0,"pts":1};
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
  