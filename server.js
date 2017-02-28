var express = require('express');
var app = express();
var http = require('http');
var bodyParser = require('body-parser');
var users = [];
var groupCapacity = 20;
initUsers();

app.use(bodyParser.json());
app.set('port', process.env.PORT || 3427);

app.get('/', function(req, res) {
  res.json([users]);

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
}

function initUsers() {
    for(let u =0; u<groupCapacity+1;u++) {
        let user = {
            points:u*u,
            groupId:groupIndex(users.length)
        };
        users.push(user);
    }
}

function groupIndex(userCount) {
    return ((userCount-userCount%groupCapacity)/groupCapacity);
};