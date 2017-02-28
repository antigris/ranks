var boot = require('../server').boot;
var shutdown = require('../server').shutdown;
var port = require('../server').port;
var superagent = require('superagent-promise')(require('superagent'), Promise);
describe('server', function () {
  before(function () {
    boot();    
  });
    describe('postReset', function(){
    it('should get current users count greater then 0', function(done){
      superagent
      .get('http://localhost:'+port)
      .then(function(res){
        if(res.body.length>0) done();
        else return;
      })
    });
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
    it('should get current users count equal 0', function(done){
      superagent
      .get('http://localhost:'+port)
      .then(function(res){
        if(res.body.length==0) done();
        else return;
      })
    });

  });
  after(function () {
    shutdown();
  });
}); 
  