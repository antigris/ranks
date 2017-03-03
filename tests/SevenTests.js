var boot = require('../server').boot;
var shutdown = require('../server').shutdown;
var port = require('../server').port;
var groupCapacity = require('../server').groupCapacity;
var superagent = require('superagent-promise')(require('superagent'), Promise);
var users = usersSample();
var resUsers = [];
var testWinners;
var resWinners;
var request = {};
describe('server', function () {
  before(function () {
      boot();
  });
  describe('postGet', function(){
      let groupId;
      request = {"points":-10};
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
     let user = {"_id":userId,"points":request.points,"groupId":groupId};
      request = {"_id":userId,"points":11};      
      user.points+=request.points;
      superagent
      .post('http://localhost:'+port + '/inc_rank')
      .send(request)
      .then(function(res){

        if(sameObject(user,res.body))done();
        else return;
      })
    }); 
   it('should return 0 as users length', function(done){
      request = {};
      superagent
      .post('http://localhost:'+port + '/reset_ratings')
      .send(request)
      .then(function(res){
        if(res.body === 0) done();
        else return;
      })
    });        
    it('should POST sample of users ', function(done){      
        for(let u = 0; u<users.length;u++) {            
            let request = users[u];            
            superagent
            .post('http://localhost:'+port + '/inc_rank')
            .send(request)
            .then(function(res){
                if(res.statusCode===200) {
                    resUsers.push(res.body);             
                }
            })
            .then(function(){
                if(resUsers.length==users.length) {
                    done();
                }
            })
        }
    });
    it('should GET same array of objects', function(done){
      superagent
      .get('http://localhost:'+port)
      .then(function(res){
        if(Array.isArray(res.body)) {             
            users = res.body;
            let checked;
            for(let u = 0; u<users.length;u++) {              
              checked = sameObject(users[u],resUsers[u]);
            }
            if(checked) done();
            else return;
        }
      })
    });
    it('should GET correct array of winners', function(done){
        testWinners = winners(users);
        resWinners = [];
        superagent
        .get('http://localhost:'+port + '/get_winners')
        .then(function(res){
            if(Array.isArray(res.body)) { 
                resWinners = res.body;
                let checked;
                for(let u = 0; u<testWinners.length;u++) {              
                    checked = sameObject(testWinners[u],resWinners[u]);
                }
                if(checked) done();
                else return;
            }
            else return;
        })
    });
    it('should GET correct rank for winners', function(done){
        let count = testWinners.length;
        for(let w=0;w<testWinners.length;w++) {
            
            let userId = testWinners[w]._id
            let winnerRank = {_id:userId, points:testWinners[w].points, place:1}
            superagent
            .get('http://localhost:'+port + '/get_rank/'+ userId)
            .then(function(res){
                let resRank = res.body;
                if(sameObject(resRank,winnerRank)) count--;
                if(count==0)done();                
                else return;
            })
        }
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

function usersSample() {
    let sample =[];    
    for(let u = 0; u<groupCapacity*3;u++) {
       let user = {points:u*u}
       sample.push(user);
    }
    return sample;
};

function containsUser(array, id) {
    for(i=0;i<array.length;i++) {
        if(array[i]["_id"] == id) return i;        
    }
    return -1;
};



function winners(users) {
    let winners = []
    let groupCount = groupIndex(users.length);

    for(let g = 0;g<groupCount;g++) {
        let w = oneSortedGroup(users,g)[0];
        winners.push({_id:w._id,points:w.points});
    }
    return winners;
};

function oneSortedGroup(users, groupId) {
    let group = [];
    for(let u =0;u<users.length;u++){
        if(users[u].groupId == groupId) group.push(users[u]);
    }
    group.sort(function (a, b) {
        if (a.points < b.points) return 1;
        if (a.points > b.points) return -1;
        return 0;
    })
   return group;
};

function groupIndex(userCount) {
    return (userCount-userCount%groupCapacity)/groupCapacity;
};


  