var express = require('express');
var app = express();
var http = require('http');
var bodyParser = require('body-parser');
var mongojs = require('mongojs');
var db = mongojs('users',['users']);
var users = [];

app.use(bodyParser.json());
app.set('port', process.env.PORT || 3333);
app.set('groupCapacity', 20);

app.get('/', function(req, res) {
  res.json(users);
});

app.get('/get_rank/:id',function(req,res){
    res.json(userRank(req.params.id));
});

app.get('/get_winners',function(req,res){
    res.json(winners());
});

app.post('/inc_rank',function(req, res) {
        userId = req.body._id;        
        increment = req.body.points;
        let index = containsUser(users, userId);
        let user;
        if(index>-1){
            addPoints(userId,index,increment);
            user = users[index];
        }
        else user = addUser(increment);
        res.json(user);
});

app.post('/reset_ratings',function(req,res) {
    reset();
    res.json(users.length);
});

var server = http.createServer(app);
var boot = function () {
    dbLoadUsers(); 
};
var shutdown = function() {
  server.close();
}
if (require.main === module) {
  boot();
}
else {
    console.info('Running server as a module')
    exports.boot = boot;
    exports.shutdown = shutdown;
    exports.port = app.get('port');
    exports.groupCapacity = app.get('groupCapacity');
}


function containsUser(array, id) {
    for(i=0;i<array.length;i++) {
        if(array[i]["_id"] == id) return i;        
    }
    return -1;
};

function groupIndex(userCount) {
    return (userCount-userCount%app.get('groupCapacity'))/app.get('groupCapacity');
};

function oneSortedGroup(groupId) {
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

function reset(){
    db.users.remove({});
    users = [];
};

function winners() {
    let winners = []
    let groupCount = groupIndex(users.length);

    for(let g = 0;g<groupCount;g++) {
        let w = oneSortedGroup(g)[0];
        
        winners.push({_id:w._id,points:w.points});
    }   
    return winners;
};

function userRank(userId) {
    let rank = {};
    let index = containsUser(users,userId);
    if(index>-1) {
        let user = users[index];
        rank._id = users[index]._id;
        rank.points = user.points;
        let group = oneSortedGroup(user.groupId);
        rank.place = containsUser(group,userId) + 1;
    }
    return rank;
};

function dbLoadUsers() {
    db.users.find({},function(err,docs){        
            for(let u = 0; u<docs.length;u++) users.push(docs[u]);         
            server.listen(app.get('port'), function(){
            console.info('running on port ' + app.get('port'));
            
        });
    });
     
};

function addUser(increment) {
    users.push({points:increment});
    let groupId = groupIndex(users.length-1);
    let index =users.length-1;
    users[index].groupId = groupId;
    let user = users[index];
    db.users.insert(user, function(err,docsInserted){
        users[index]._id = docsInserted._id;
    })
    
    return users[index];
};

function addPoints(userId,index, increment) {    
    users[index].points+=increment;
    db.users.findAndModify({
        query: { _id: mongojs.ObjectId(userId)},    
        update: { $inc:{ points: increment}},   
        new: true },function(err,doc){});
    
};
