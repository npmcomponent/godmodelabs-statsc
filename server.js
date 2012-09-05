var log = new require('statistik')();
var validMethods = ['increment', 'decrement', 'timing', 'gauge', 'send'];

function server(req, res) {
  res.writeHead(200, {'Content-Type': 'application/javascript'});
	try {
	  if (req.method != 'GET') throw Error('Not supported');
	  var url = decodeURIComponent(req.url).replace(/\//g, '');
	  if (url == 'favicon.ico') return res.end();
	  if (url[0] != '[') throw Error('File serving not supported');
    var ops = JSON.parse(url);
    var op;
    for (var i = 0, len = ops.length; i < len; i++) {
      op = ops[i];
      if (!isArray(op)) throw Error('INVALID');
      if (validMethods.indexOf(op[0]) == -1) {
        throw Error('Method `'+op[0]+'` not supported');
      }
      log[op[0]].apply(log, op.splice(1));
      log.increment('client.stats.collected');
    }
		res.end('"OK";');
  } catch(e) {
    res.end('"'+e.toString()+'";');
    console.error(e);
  }
}

function isArray(o) {
  return typeof o == 'object' && o instanceof Array;
}

var http = require('http');

http.createServer(server).listen(8126, function() {
  console.log('StatsC server listening on port 8126');
});