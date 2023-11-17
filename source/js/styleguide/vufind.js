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
    icon: function icon(name) {
      return '[icon ' + name + ']';
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

/**
 * Keyboard and focus controllers
 * Adapted from Micromodal
 * - https://github.com/ghosh/Micromodal/blob/master/lib/src/index.js
 */
const FOCUSABLE_ELEMENTS = ['a[href]', 'area[href]', 'input:not([disabled]):not([type="hidden"]):not([aria-hidden])', 'select:not([disabled]):not([aria-hidden])', 'textarea:not([disabled]):not([aria-hidden])', 'button:not([disabled]):not([aria-hidden])', 'iframe', 'object', 'embed', '[contenteditable]', '[tabindex]:not([tabindex^="-"])'];
function getFocusableNodes(container) {
  const nodes = container.querySelectorAll(FOCUSABLE_ELEMENTS);
  return Array.from(nodes);
}

$(document).ready(function onDocumentReady() {
  VuFind.init();
});
