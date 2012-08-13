StatsC
======

StatsC lets you log statistics to your graphite/statsd servers straight from the browser.

Just like StatsD, StatsC is a fire and forget thing. StatsC can't take your site down if it fails, only statistics won't get logged.

It supports 2 transports:

* **Ajax** (default): Statistics are aggregated and flushed every 10s
* **Websockets**: Statistics are transmitted immediately

However websockets are only recommended if you already have socket.io included in your site.

Usage
=====

* Include `client.js` in your `<head>`

```html
<script src="https://raw.github.com/juliangruber/statsc/master/client.js"></script>
```

* Connect to your statsc server. By default, `statsc.connect()` connects to `localhost:8126`.

```javascript
statsc.connect('addr:port');
```

* Start logging!

Counters
--------

```javascript
statsc.increment('name');
statsc.decrement('name');
```

Gauges
------

```javascript
statsc.gauge('name', 1337);
```

Timers
------

There are several possibilities for logging time values:

* Functional style

```javascript
var finished = statsc.timer('name');
// do stuff
finished();
```

* By passing a `date` object

```javascript
var start = new Date();
// do stuff
statsc.timing('name', start); // calculates diff
```

* Manually

```javascript
var ts = new Date().getTime();
// do stuff
statsc.timing('name', new Date().getTime()-ts);
```

* Sync style

```javascript
statsd.timing('name', function() {
  // do sync stuff
});
```