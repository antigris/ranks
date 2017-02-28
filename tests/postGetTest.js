var boot = require('../server').boot;
var shutdown = require('../server').shutdown;
var port = require('../server').port;
var superagent = require('superagent-promise')(require('superagent'), Promise);
var users =[];
var groupCapacity = 10;

describe('server', function () {
  before(function () {
    boot();    
  });
  describe('postGet', function(){      
  it('should post 2,5 groups of users ', function(done){
      var count = 0;
      for(let u = 0; u<groupCapacity*2.5;u++) {
        let request = {"pts":u*u};
        superagent
        .post('http://localhost:'+port + '/inc_rank')
        .send(request)
        .then(function(res){
          if(res.statusCode===200) {
             count++;
             users.push(res.body);
          }
          return count; 
        })
        .then(function(count){
          if(count==groupCapacity*2.5) done();
          else return;
      })
    }
  });  
    it('should get same array of objects', function(done){
      superagent
      .get('http://localhost:'+port)
      .then(function(res){
        if(Array.isArray(res.body)) {             
            let resUsers = res.body;
            let checked;
            for(let u = 0; u<users.length;u++) {              
              checked = sameObject(users[u],resUsers[u]);
            }
            if(checked) done();
            else return;
        }
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
  /*for (let b = 0; b<keysB.length; b++) {
    if(objectA[keysB[b]] != objectB[keysB[b]]) return false;
  }*/
  return true;
};


  