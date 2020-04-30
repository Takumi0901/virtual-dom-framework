// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"scripts/createElement.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (tagName, _a) {
  var _b = _a === void 0 ? {} : _a,
      _c = _b.attrs,
      attrs = _c === void 0 ? {} : _c,
      _d = _b.children,
      children = _d === void 0 ? [] : _d;

  var vElem = Object.create(null);
  Object.assign(vElem, {
    tagName: tagName,
    attrs: attrs,
    children: children
  });
  return vElem;
};
},{}],"scripts/render.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var renderElem = function renderElem(_a) {
  var tagName = _a.tagName,
      attrs = _a.attrs,
      children = _a.children; // create the element
  //   e.g. <div></div>

  var $el = document.createElement(tagName); // add all attributs as specified in vNode.attrs
  //   e.g. <div id="app"></div>

  for (var _i = 0, _b = Object.entries(attrs); _i < _b.length; _i++) {
    var _c = _b[_i],
        k = _c[0],
        v = _c[1];
    $el.setAttribute(k, v);
  } // append all children as specified in vNode.children
  //   e.g. <div id="app"><img></div>


  for (var _d = 0, children_1 = children; _d < children_1.length; _d++) {
    var child = children_1[_d];
    $el.appendChild(render(child));
  }

  return $el;
};

var render = function render(vNode) {
  if (typeof vNode === "string") {
    return document.createTextNode(vNode);
  } // we assume everything else to be a virtual element


  return renderElem(vNode);
};

exports.default = render;
},{}],"scripts/diff.ts":[function(require,module,exports) {
"use strict";

var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

var render_1 = __importDefault(require("./render"));

var zip = function zip(xs, ys) {
  var zipped = [];

  for (var i = 0; i < Math.min(xs.length, ys.length); i++) {
    zipped.push([xs[i], ys[i]]);
  }

  return zipped;
};

var diffAttrs = function diffAttrs(oldAttrs, newAttrs) {
  var patches = [];

  var _loop_1 = function _loop_1(k, v) {
    patches.push(function ($node) {
      $node.setAttribute(k, v);
      return $node;
    });
  }; // setting newAttrs


  for (var _i = 0, _a = Object.entries(newAttrs); _i < _a.length; _i++) {
    var _b = _a[_i],
        k = _b[0],
        v = _b[1];

    _loop_1(k, v);
  }

  var _loop_2 = function _loop_2(k) {
    if (!(k in newAttrs)) {
      patches.push(function ($node) {
        $node.removeAttribute(k);
        return $node;
      });
    }
  }; // removing attrs


  for (var k in oldAttrs) {
    _loop_2(k);
  }

  return function ($node) {
    for (var _i = 0, patches_1 = patches; _i < patches_1.length; _i++) {
      var patch = patches_1[_i];
      patch($node);
    }

    return $node;
  };
};

var diffChildren = function diffChildren(oldVChildren, newVChildren) {
  var childPatches = [];
  oldVChildren.forEach(function (oldVChild, i) {
    childPatches.push(diff(oldVChild, newVChildren[i]));
  });
  var additionalPatches = [];

  var _loop_3 = function _loop_3(additionalVChild) {
    additionalPatches.push(function ($node) {
      $node.appendChild(render_1.default(additionalVChild));
      return $node;
    });
  };

  for (var _i = 0, _a = newVChildren.slice(oldVChildren.length); _i < _a.length; _i++) {
    var additionalVChild = _a[_i];

    _loop_3(additionalVChild);
  }

  return function ($parent) {
    // since childPatches are expecting the $child, not $parent,
    // we cannot just loop through them and call patch($parent)
    for (var _i = 0, _a = zip(childPatches, $parent.childNodes); _i < _a.length; _i++) {
      var _b = _a[_i],
          patch = _b[0],
          $child = _b[1];
      patch($child);
    }

    for (var _c = 0, additionalPatches_1 = additionalPatches; _c < additionalPatches_1.length; _c++) {
      var patch = additionalPatches_1[_c];
      patch($parent);
    }

    return $parent;
  };
};

var diff = function diff(oldVTree, newVTree) {
  // let's assume oldVTree is not undefined!
  if (newVTree === undefined) {
    return function ($node) {
      $node.remove(); // the patch should return the new root node.
      // since there is none in this case,
      // we will just return undefined.

      return undefined;
    };
  }

  if (typeof oldVTree === "string" || typeof newVTree === "string") {
    if (oldVTree !== newVTree) {
      // could be 2 cases:
      // 1. both trees are string and they have different values
      // 2. one of the trees is text node and
      //    the other one is elem node
      // Either case, we will just render(newVTree)!
      return function ($node) {
        var $newNode = render_1.default(newVTree);
        $node.replaceWith($newNode);
        return $newNode;
      };
    } else {
      // this means that both trees are string
      // and they have the same values
      return function ($node) {
        return $node;
      };
    }
  }

  if (oldVTree.tagName !== newVTree.tagName) {
    // we assume that they are totally different and
    // will not attempt to find the differences.
    // simply render the newVTree and mount it.
    return function ($node) {
      var $newNode = render_1.default(newVTree);
      $node.replaceWith($newNode);
      return $newNode;
    };
  }

  var patchAttrs = diffAttrs(oldVTree.attrs, newVTree.attrs);
  var patchChildren = diffChildren(oldVTree.children, newVTree.children);
  return function ($node) {
    patchAttrs($node);
    patchChildren($node);
    return $node;
  };
};

exports.default = diff;
},{"./render":"scripts/render.ts"}],"scripts/index.ts":[function(require,module,exports) {
"use strict";

var __spreadArrays = this && this.__spreadArrays || function () {
  for (var s = 0, i = 0, il = arguments.length; i < il; i++) {
    s += arguments[i].length;
  }

  for (var r = Array(s), k = 0, i = 0; i < il; i++) {
    for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++) {
      r[k] = a[j];
    }
  }

  return r;
};

var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

var createElement_1 = __importDefault(require("./createElement"));

var render_1 = __importDefault(require("./render"));

var diff_1 = __importDefault(require("./diff"));

var createVApp = function createVApp(count) {
  return createElement_1.default("div", {
    attrs: {
      id: "app",
      dataCount: count
    },
    children: __spreadArrays(["The current count is: ", String(count)], Array.from({
      length: count
    }, function () {
      return createElement_1.default("img", {
        attrs: {
          src: "https://media.giphy.com/media/cuPm4p4pClZVC/giphy.gif"
        }
      });
    }))
  });
};

exports.mount = function ($node, $target) {
  $target.replaceWith($node);
  return $node;
};

var count = 2;
var vApp = createVApp(count);
var $app = render_1.default(vApp);
var $rootEl = exports.mount($app, document.getElementById("app"));
setInterval(function () {
  var n = Math.floor(Math.random() * 10);
  var vNewApp = createVApp(n);
  var patch = diff_1.default(vApp, vNewApp);
  $rootEl = patch($rootEl);
  vApp = vNewApp;
}, 1000);
},{"./createElement":"scripts/createElement.ts","./render":"scripts/render.ts","./diff":"scripts/diff.ts"}],"../node_modules/parcel/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "50848" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["../node_modules/parcel/src/builtins/hmr-runtime.js","scripts/index.ts"], null)
//# sourceMappingURL=/scripts.2ed900e3.js.map