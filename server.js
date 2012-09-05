var log = new require('statistik')();
var methods = {
  i: 'increment',
  d: 'decrement',
  t: 'timing',
  g: 'gauge',
  s: 'send'
}

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
    // op = [method, stat, (value/sampleRate), (sampleRate)]
    op = ops[i];
    
    // must be array
    if (!isArray(op)) return warn('op must be Array', res);
    
    // must only consist of strings and numbers
    if (typeof op[0] != 'string') {
      return warn('1st arg must be method, is', op[0], res);
    }
    if (typeof op[1] != 'string') {
      return warn('2nd arg must be stat, is', op[1], res);
    }
    if (typeof op[2] != 'undefined' && typeof op[2] != 'number') {
      return warn('3rd arg must be number, is', op[2], res);
    }
    if (typeof op[3] != 'undefined' && typeof op[3] != 'number') {
      return warn('4rd arg must be number, is', op[3], res);
    }
    
    // must call valid method
    var valid = false;
    for (abr in methods) {
      if (abr == op[0]) {
        op[0] = methods[abr];
        valid = true;
        break;
      }
    }
    if (!valid) return warn('Method `'+op[0]+'` not supported', res);
    
    // must have max. 3 arguments + 1 method
    if (op.length > 4) return warn('Too many arguments', op, res);
    
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
    res.end('"'+str+' '+arg+'";');
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