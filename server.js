var log = new require('statistik')();
var validMethods = ['increment', 'decrement', 'timing', 'gauge', 'send'];

function server(req, res) {
  res.writeHead(200, {'Content-Type': 'application/javascript'});
  
  if (req.method != 'GET') return warn('Only GET supported', res);
  
  var url = decodeURIComponent(req.url).replace(/\//g, '');
  if (url == 'favicon.ico') return res.end();
  if (url[0] != '[') return warn('File serving not supported', res);
  
  try {
    var ops = JSON.parse(url);
  } catch (err) {
    return warn(err, res);
  }
  
  var op;
  for (var i = 0, len = ops.length; i < len; i++) {
    // op = [method, stat, (value/sampleRate), (sampleRate/method), (sampleRate)]
    op = ops[i];
    
    // must be array
    if (!isArray(op)) return warn('op must be Array', res);
    
    // must only consist of strings, numbers and nulls (sampleRate)
    var isString, isNumber, isObject, isNull;
    for (var j = 0, len = op.length; j < len; j++) {
      isString = typeof op[j] == 'string';
      isNumber = typeof op[j] == 'number';
      isObject = typeof op[j] == 'object';
      isNull = op[j] == null;
      if (!isString && !isNumber && !(isObject && isNull)) {
        return warn('invalid types, given: ', op[j], res);
      }
    }
    
    // must call valid method
    if (validMethods.indexOf(op[0]) == -1) {
      return warn('Method `'+op[0]+'` not supported', res);
    }
    
    // must have max. 4 arguments + 1 method
    if (op.length > 5) return warn('Too many arguments', op, res);
    
    // log away, everything's fine
    try {
      log[op[0]].apply(log, op.splice(1));
    } catch (err) {
      return warn(err, res);
    }
    log.increment('client.stats.collected');
  }

	res.end('"OK";');
}

function isArray(o) {
  return typeof o == 'object' && o instanceof Array;
}

function warn(str, arg, res) {
  if (arguments.length == 3) {
    res.end('"'+str+arg+'";');
    console.error(str, arg);
  } else {
    arg.end('"'+str+'";');
    console.error(str);
  }
}

var http = require('http');

http.createServer(server).listen(8126, function() {
  console.log('StatsC server listening on port 8126');
});