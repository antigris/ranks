var boot = require('../server').boot;
var shutdown = require('../server').shutdown;
var reset = require('../server').reset;
var init = require('../server').init;
var port = require('../server').port;
var superagent = require('superagent-promise')(require('superagent'), Promise);

describe('server', function () {
  before(function () {
    boot();
    reset();
   // init();    
});
  var userId;
  var request = {"pts":-10};
  var user;
  var groupId; 
  describe('postDefault', function(){    
    it('should respond to POST request', function(done){
      superagent
      .post('http://localhost:'+port + '/inc_rank')
      .send(request)
      .then(function(res){
        if(res.statusCode===200){
           userId = res.body._id;
           groupId = res.body.groupId;
           done();
        }
        else return;
      })
    });  
    it('should return the same object', function(done){
      user = {"_id":userId,"points":request.pts,"groupId":groupId};
      request = {"_id":userId,"pts":11};
      user.points+=request.pts;
      superagent
      .post('http://localhost:'+port + '/inc_rank')
      .send(request)
      .then(function(res){
        if(sameObject(user,res.body))done();
        else return;
      })
    }); 
  });
  after(function () {
    shutdown();
  });
}); 

function sameObject(objectA,objectB) {
  let keysA = Object.keys( objectA );
  let keysB = Object.keys( objectB );
  if ( keysA.length != keysB.length ) return false;
  for (let a = 0; a<keysA.length; a++) {
    if(objectB[keysA[a]] != objectA[keysA[a]]) return false;
  }
  return true;
};
  