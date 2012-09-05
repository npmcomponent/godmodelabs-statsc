var http = require('http');
var url = require('url');
var log = new require('statistik')();
var validMethods = ['increment', 'decrement', 'timing', 'gauge', 'send'];

var server = http.createServer(function(req, res) {
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
    }
		res.end('"OK";');
  } catch(e) {
    res.end('"'+e.toString()+'";');
    console.error(e);
  }
});

function isArray(o) {
  return typeof o == 'object' && o instanceof Array;
}

server.listen(8126);