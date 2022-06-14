var VuFind = (function VuFind() {
  var _submodules = [];
  var _initialized = false;

  var register = function register(name, module) {
    if (_submodules.indexOf(name) === -1) {
      _submodules.push(name);
      this[name] = typeof module == 'function' ? module() : module;

      // If the object has already initialized, we should auto-init on register:
      if (_initialized && this[name].init) {
        this[name].init();
      }
    }
  };

  return {
    register: register,
    translate: function translate(string) {
      return string;
    },
    init: function init() {
      for (var i = 0; i < _submodules.length; i++) {
        if (this[_submodules[i]].init) {
          this[_submodules[i]].init();
        }
      }
      _initialized = true;
    }
  };
})();

$(document).ready(function onDocumentReady() {
  VuFind.init();
});
