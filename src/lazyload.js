// simple lazyload plugin
(function() {

  function extendObject() {}

  var defaultOptions = {
    className: 'lazy'
  };

  function ImageLoader(images, options) {
    this.images = images;
    this.options = options;
  }

  var WHeight = window.innerHeight

  ImageLoader.prototype.load = function(scrollTop) {
    this.images.forEach(function(img) {
      var offsetTop = img.offsetTop, height = img.clientHeight;
      if (offsetTop < WHeight + scrollTop && offsetTop + height > scrollTop) {
        var original = img.getAttribute('data-original');
        var imageLoad = new Image();
        imageLoad.onload = function() {
          img.onload = function() {
            img.classList.add('lazy');
          };
          img.src = original;
        };
        imageLoad.onerror = function() {
          console.error('Cannot load image: ' + original);
        };
        imageLoad.src = original;
      }
    });
  };

  var loaders = [];

  function lazyload(selector, options) {
    options = options || {};
    var $wrapper = document.querySelectorAll(selector);
    for (var i = 0; i < $wrapper.length; ++i) {
      var $each = $wrapper[i];
      if ($each.tagName === 'IMG') {
        loaders.push(new ImageLoader([$each], options));
      } else {
        loaders.push(new ImageLoader(Array.prototype.slice.call($each.querySelectorAll('img')), options));
      }
    }
    var scrollTop = getScrollTop();
    loaders.forEach(function(loader) {
      loader.load(scrollTop);
    });
  }

  // Get scrollTop
  function getScrollTop() {
    return window['pageYOffset'] || document.documentElement['scrollTop'];
  }

  // 使用一个scroll监听
  window.addEventListener('scroll', function() {
    var scrollTop = getScrollTop();
    loaders.forEach(function(loader) {
      loader.load(scrollTop);
    });
  }, false);

  window.lazyload = lazyload;

})();
