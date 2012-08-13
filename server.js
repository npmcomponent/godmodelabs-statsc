var http = require('http');
statsd = new require('node-statsd')('test02', 8125);

var server = http.createServer(function(req, res) {
	if (req.method == 'POST') {
		var data = '';
		req.on('data', function(chunk) {
			data += chunk.toString();
			if (data.length > 1e6) req.connection.destroy();
		});
		req.on('end', function() {
			res.writeHead(200, 'OK', {'Content-Type': 'text/plain'});
			res.end();
		});
	} else {
		res.end();
	}
});

server.listen(8126);