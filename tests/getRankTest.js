var boot = require('../server').boot;
var reset = require('../server').reset;
var init = require('../server').init;
var shutdown = require('../server').shutdown;
var port = require('../server').port;
var rank = require('../server').rank;


var superagent = require('superagent-promise')(require('superagent'), Promise);

var userId = 0;
var userRank =rank(0);
describe('server', function () {
  before(function () {
    boot();
    reset();
    init();
  });
  describe('getRank', function(){      
    it('should respond to GET rank', function(done){
      superagent
      .get('http://localhost:'+port + '/get_rank/' + userId)
      .then(function(res){
        if(res.statusCode===200) done();
        else return;
      })
    });
    it('should get correct user rank', function(done){
      superagent
      .get('http://localhost:'+port + '/get_rank/' + userId)
      .then(function(res){
        if(res.statusCode===200) {             
            let resRank = res.body;
            let checked;           
              checked = sameObject(userRank,resRank);
            if(checked) done();
            else return;
        }
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
  