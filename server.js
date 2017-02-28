var express = require('express');
var app = express();
var http = require('http');
var bodyParser = require('body-parser');
var users = [];
var groupCapacity = 10;

//initUsers();

app.use(bodyParser.json());
app.set('port', process.env.PORT || 3427);
app.set('groupCapacity', 20);

app.get('/', function(req, res) {
  res.json(users);
});

app.post('/inc_rank',function(req, res) {
        userId = req.body._id;        
        increment = req.body.pts;
        let index = containsUser(users, userId);
        if(index > -1) users[index].points+=incRate;
        else  users.push({"_id":-2,"points":increment,"groupId":groupIndex(users.length)});//when db remove id
        res.json(users[users.length-1]);
});

app.post('//reset_ratings',function(req, res) {
        users = [];
        res.json(users.length);
});

var server = http.createServer(app);
var boot = function () {
  
  server.listen(app.get('port'), function(){
    console.info('server on port ' + app.get('port'));
  });
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

function initUsers() {
    for(let u =0; u<13;u++) {
        let user = {
            points:u*u,
            groupId:groupIndex(users.length)
        };
        users.push(user);
    }
}

function groupIndex(userCount) {
    return ((userCount-userCount%app.get('groupCapacity'))/app.get('groupCapacity'));
};



function containsUser(array, id) {
    for(i=0;i<array.length;i++) {
        if(array[i]["_id"] == id) return i;        
    }
    return -1;
};