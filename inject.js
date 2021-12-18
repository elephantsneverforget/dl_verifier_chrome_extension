function loadNextPlugin(plugins) {
    var nextPlugin = plugins.shift();
    // load it, and recursively invoke loadNextPlugin on the remaining queue
    var script = document.createElement('script');
    script.setAttribute('type', 'text/javascript');
    script.src = chrome.runtime.getURL(nextPlugin);
    script.onload = function() {
      if (plugins.length)
        loadNextPlugin(plugins);
    }
    var head = document.getElementsByTagName('head')[0];
    head.appendChild(script);
  }
  
  
  loadNextPlugin(["joi.js", "verifier.js", "index.js"]);