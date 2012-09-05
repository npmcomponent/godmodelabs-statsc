;(function() {

  /**
   * abbrevations:
   *   i = increment
   *   d = decrement
   *   t = timing
   *   g = gauge
   */

  var statsc = {};
  var addr, tag;

  var queue = [];

  statsc.connect = function(_addr) {
    tag = document.createElement('script');
    document.getElementsByTagName('head')[0].appendChild(tag);
    if (_addr) return addr = _addr;
    addr = 'http://localhost:8126/';
  };

  statsc.increment = function(stat, sampleRate) {
    queue.push(['i', stat, sampleRate]);
  };

  statsc.decrement = function(stat, sampleRate) {
    queue.push(['d', stat, sampleRate]);
  };

  statsc.gauge = function(stat, value, sampleRate) {
    queue.push(['g', stat, value, sampleRate]);
  };

  statsc.timing = function(stat, time, sampleRate) {
    if ('number' == typeof time) return queue.push(['t', stat, time, sampleRate]);
    if (time instanceof Date) return queue.push(['t', stat, fromNow(time.getTime()), sampleRate]);
    if ('function' == typeof time) {
      var start = new Date().getTime();
      time();
      return queue.push(['t', stat, fromNow(start), sampleRate]);
    }
  };

  statsc.timer = function(stat, sampleRate) {
    var start = new Date().getTime();

    return function() {
      queue.push(['t', stat, fromNow(start), sampleRate]);
    }
  };

  setInterval(function() {
    if (queue.length > 0) {
      // clear null values
      for (var i = 0; i < queue.length; i++) {
        for (var j = 0; j < queue[i].length; j++) {
          if (queue[i][j] == null) queue[i].splice(j, 1);
        }
      }
      tag.src = addr+JSON.stringify(queue);
      queue = [];
    }
  }, 5000);
  
  function fromNow(time) {
    return new Date().getTime() - time;
  }

  window.statsc = statsc;

})();