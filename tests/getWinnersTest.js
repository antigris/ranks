var boot = require('../server').boot;
var reset = require('../server').reset;
var init = require('../server').init;
var shutdown = require('../server').shutdown;
var port = require('../server').port;
var superagent = require('superagent-promise')(require('superagent'), Promise);

var winners = [];
describe('server', function () {
  before(function () {
    boot();
    reset();
    winners = init();
  });
  describe('getWinners', function(){      
    it('should respond to GET winners', function(done){
      superagent
      .get('http://localhost:'+port + '/get_winners')
      .then(function(res){
        if(res.statusCode===200) done();
        else return;
      })
    });
    it('should get array', function(done){
      superagent
      .get('http://localhost:'+port + '/get_winners')
      .then(function(res){
        if(Array.isArray(res.body)) done();
        else return;
      })
    });
    it('should get correct winners array', function(done){
      superagent
      .get('http://localhost:'+port + '/get_winners')
      .then(function(res){
        if(Array.isArray(res.body)) {             
            let resWinners = res.body;
            let checked;
            for(let w = 0; w<winners.length;w++) {              
              checked = sameObject(winners[w],resWinners[w]);
            }
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
  