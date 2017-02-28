var express = require('express');
var app = express();
var http = require('http');
var bodyParser = require('body-parser');

app.use(bodyParser.json());
app.set('port', process.env.PORT || 3427);

app.get('/', function(req, res) {
  res.json(["get200"]);

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