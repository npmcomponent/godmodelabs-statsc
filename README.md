StatsC
======

Push Stats to StatsD on the Client

* Fire and forget

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