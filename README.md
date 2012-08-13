StatsC
======

StatsC lets you log statistics to your graphite/statsd servers straight from the browser.

Just like StatsD, StatsC is a fire and forget thing. StatsC can't take your site down if it fails, only statistics won't get logged.

It supports 2 transports:

* **Ajax** (default): Statistics are aggregated and flushed every 10s
* **Websockets**: Statistics are transmitted immediately

However websockets are only recommended if you already have socket.io included in your site.

Installation
============

Server
------

```bash
git clone git://github.com/juliangruber/statsc.git
cd statsc
npm install
node server
```

Client
------

In your `<head>`:

```html
<script src="https://raw.github.com/juliangruber/statsc/master/client.js">
  statsc.connect('addr:port'); // by default connects to localhost:8126
</script>
```

Usage
=====

Counters
--------

Simple counters for
* pageviews
* features uses
* subscriptions
* etc.

```javascript
statsc.increment('name');
statsc.decrement('name');
```

Gauges
------

Stores arbitrary numeric values for
* sizes of api responses
* etc.

```javascript
statsc.gauge('name', 1337);
```

Timers
------

Timers get averaged, their 90th percentile gets calculated etc. Use for:
* benchmarks
* load times
* etc.

There are several possibilities for logging time values:

* Functional style

```javascript
var finished = statsc.timer('name');
// do stuff
finished();
```

* Sync style

```javascript
statsd.timing('name', function() {
  // do sync stuff
});
```

* By passing a `date` object

```javascript
var start = new Date();
// do stuff
statsc.timing('name', start); // calculates diff
```

* By passing a value in miliseconds

```javascript
var ts = new Date().getTime();
// do stuff
statsc.timing('name', new Date().getTime()-ts);
```
