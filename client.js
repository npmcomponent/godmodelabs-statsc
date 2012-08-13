;(function() {

  var statsc = {};
  var addr;

  var queue = [];

  statsc.connect = function(_addr) {
    if (_addr) return addr = _addr;
    addr = 'http://localhost:8126/'
  };

  statsc.increment = function(counter) {
    queue.push({op:'increment', val:counter});
  };

  statsc.decrement = function(counter) {
    queue.push({op:'decrement', val:counter});
  };

  statsc.gauge = function(gauge, value) {
    queue.push({op:'gauge', val:value});
  };

  function fromNow(time) {
    return new Date().getTime() - time;
  }

  statsc.timing = function(timing, time) {
    if ('number' == typeof time) return queue.push({op:'timing', val:time});
    if (time instanceof Date) return queue.push({op:'timing', val:fromNow(time.getTime())})
    if ('function' == typeof time) {
      var start = new Date().getTime();
      time();
      return queue.push({op:'timing', val:fromNow(start)});
    }
  };

  statsc.timer = function(timing) {
    var start = new Date().getTime();

    return function() {
      queue.push({op:'timing', val:fromNow(start)});
    }
  };

  setInterval(function() {
    if (queue.length > 0) {
      $.post(addr, JSON.stringify(queue), function() {
        queue = [];
      }).error(function() { /* no-op */ });
    }
  }, 5000);

  window.statsc = statsc;

})();