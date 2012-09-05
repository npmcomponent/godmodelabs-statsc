;(function() {

  var statsc = {};
  var addr, tag;

  var queue = [];

  statsc.connect = function(_addr) {
    tag = document.createElement('script');
    document.getElementsByTagName('head')[0].appendChild(tag);
    if (_addr) return addr = _addr;
    addr = 'http://localhost:8126/';
  };

  statsc.increment = function(counter, sampleRate) {
    queue.push(['increment', counter, sampleRate]);
  };

  statsc.decrement = function(counter, sampleRate) {
    queue.push(['decrement', counter, sampleRate]);
  };

  statsc.gauge = function(gauge, value, sampleRate) {
    queue.push(['gauge', value, sampleRate]);
  };

  function fromNow(time) {
    return new Date().getTime() - time;
  }

  statsc.timing = function(timing, time, sampleRate) {
    if ('number' == typeof time) return queue.push(['timing', time, sampleRate]);
    if (time instanceof Date) return queue.push(['timing', fromNow(time.getTime()), sampleRate]);
    if ('function' == typeof time) {
      var start = new Date().getTime();
      time();
      return queue.push(['timing', fromNow(start), sampleRate]);
    }
  };

  statsc.timer = function(timing, sampleRate) {
    var start = new Date().getTime();

    return function() {
      queue.push(['timing', fromNow(start), sampleRate]);
    }
  };

  setInterval(function() {
    if (queue.length > 0) {
      // $.post(addr, JSON.stringify(queue), function(data) {
      //         queue = [];
      //         console.log(data);
      //       }).error(function() { /* no-op */ });
      tag.src = addr+JSON.stringify(queue);
    }
  }, 5000);

  window.statsc = statsc;

})();