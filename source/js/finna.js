var finna = (function finnaModule() {
  return {
    init: function init() {
      var modules = [
        'mdEditable',
      ];

      $.each(modules, function initModule(index, module) {
        if (typeof finna[module] !== 'undefined') {
          finna[module].init();
        }
      });
    }
  };
})();

$(document).ready(function onReady() {
  finna.init();
});
