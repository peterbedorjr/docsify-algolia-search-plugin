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
})({"../node_modules/inherits/inherits_browser.js":[function(require,module,exports) {
if (typeof Object.create === 'function') {
  // implementation from standard node.js 'util' module
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    ctor.prototype = Object.create(superCtor.prototype, {
      constructor: {
        value: ctor,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
  };
} else {
  // old school shim for old browsers
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    var TempCtor = function () {}
    TempCtor.prototype = superCtor.prototype
    ctor.prototype = new TempCtor()
    ctor.prototype.constructor = ctor
  }
}

},{}],"../node_modules/foreach/index.js":[function(require,module,exports) {

var hasOwn = Object.prototype.hasOwnProperty;
var toString = Object.prototype.toString;

module.exports = function forEach (obj, fn, ctx) {
    if (toString.call(fn) !== '[object Function]') {
        throw new TypeError('iterator must be a function');
    }
    var l = obj.length;
    if (l === +l) {
        for (var i = 0; i < l; i++) {
            fn.call(ctx, obj[i], i, obj);
        }
    } else {
        for (var k in obj) {
            if (hasOwn.call(obj, k)) {
                fn.call(ctx, obj[k], k, obj);
            }
        }
    }
};


},{}],"../node_modules/algoliasearch/src/errors.js":[function(require,module,exports) {
'use strict'; // This file hosts our error definitions
// We use custom error "types" so that we can act on them when we need it
// e.g.: if error instanceof errors.UnparsableJSON then..

var inherits = require('inherits');

function AlgoliaSearchError(message, extraProperties) {
  var forEach = require('foreach');

  var error = this; // try to get a stacktrace

  if (typeof Error.captureStackTrace === 'function') {
    Error.captureStackTrace(this, this.constructor);
  } else {
    error.stack = new Error().stack || 'Cannot get a stacktrace, browser is too old';
  }

  this.name = 'AlgoliaSearchError';
  this.message = message || 'Unknown error';

  if (extraProperties) {
    forEach(extraProperties, function addToErrorObject(value, key) {
      error[key] = value;
    });
  }
}

inherits(AlgoliaSearchError, Error);

function createCustomError(name, message) {
  function AlgoliaSearchCustomError() {
    var args = Array.prototype.slice.call(arguments, 0); // custom message not set, use default

    if (typeof args[0] !== 'string') {
      args.unshift(message);
    }

    AlgoliaSearchError.apply(this, args);
    this.name = 'AlgoliaSearch' + name + 'Error';
  }

  inherits(AlgoliaSearchCustomError, AlgoliaSearchError);
  return AlgoliaSearchCustomError;
} // late exports to let various fn defs and inherits take place


module.exports = {
  AlgoliaSearchError: AlgoliaSearchError,
  UnparsableJSON: createCustomError('UnparsableJSON', 'Could not parse the incoming response as JSON, see err.more for details'),
  RequestTimeout: createCustomError('RequestTimeout', 'Request timed out before getting a response'),
  Network: createCustomError('Network', 'Network issue, see err.more for details'),
  JSONPScriptFail: createCustomError('JSONPScriptFail', '<script> was loaded but did not call our provided callback'),
  JSONPScriptError: createCustomError('JSONPScriptError', '<script> unable to load due to an `error` event on it'),
  Unknown: createCustomError('Unknown', 'Unknown error occured')
};
},{"inherits":"../node_modules/inherits/inherits_browser.js","foreach":"../node_modules/foreach/index.js"}],"../node_modules/algoliasearch/src/buildSearchMethod.js":[function(require,module,exports) {
module.exports = buildSearchMethod;

var errors = require('./errors.js');
/**
 * Creates a search method to be used in clients
 * @param {string} queryParam the name of the attribute used for the query
 * @param {string} url the url
 * @return {function} the search method
 */


function buildSearchMethod(queryParam, url) {
  /**
   * The search method. Prepares the data and send the query to Algolia.
   * @param {string} query the string used for query search
   * @param {object} args additional parameters to send with the search
   * @param {function} [callback] the callback to be called with the client gets the answer
   * @return {undefined|Promise} If the callback is not provided then this methods returns a Promise
   */
  return function search(query, args, callback) {
    // warn V2 users on how to search
    if (typeof query === 'function' && typeof args === 'object' || typeof callback === 'object') {
      // .search(query, params, cb)
      // .search(cb, params)
      throw new errors.AlgoliaSearchError('index.search usage is index.search(query, params, cb)');
    } // Normalizing the function signature


    if (arguments.length === 0 || typeof query === 'function') {
      // Usage : .search(), .search(cb)
      callback = query;
      query = '';
    } else if (arguments.length === 1 || typeof args === 'function') {
      // Usage : .search(query/args), .search(query, cb)
      callback = args;
      args = undefined;
    } // At this point we have 3 arguments with values
    // Usage : .search(args) // careful: typeof null === 'object'


    if (typeof query === 'object' && query !== null) {
      args = query;
      query = undefined;
    } else if (query === undefined || query === null) {
      // .search(undefined/null)
      query = '';
    }

    var params = '';

    if (query !== undefined) {
      params += queryParam + '=' + encodeURIComponent(query);
    }

    var additionalUA;

    if (args !== undefined) {
      if (args.additionalUA) {
        additionalUA = args.additionalUA;
        delete args.additionalUA;
      } // `_getSearchParams` will augment params, do not be fooled by the = versus += from previous if


      params = this.as._getSearchParams(args, params);
    }

    return this._search(params, url, callback, additionalUA);
  };
}
},{"./errors.js":"../node_modules/algoliasearch/src/errors.js"}],"../node_modules/algoliasearch/src/deprecate.js":[function(require,module,exports) {
module.exports = function deprecate(fn, message) {
  var warned = false;

  function deprecated() {
    if (!warned) {
      /* eslint no-console:0 */
      console.warn(message);
      warned = true;
    }

    return fn.apply(this, arguments);
  }

  return deprecated;
};
},{}],"../node_modules/algoliasearch/src/deprecatedMessage.js":[function(require,module,exports) {
module.exports = function deprecatedMessage(previousUsage, newUsage) {
  var githubAnchorLink = previousUsage.toLowerCase().replace(/[\.\(\)]/g, '');
  return 'algoliasearch: `' + previousUsage + '` was replaced by `' + newUsage + '`. Please see https://github.com/algolia/algoliasearch-client-javascript/wiki/Deprecated#' + githubAnchorLink;
};
},{}],"../node_modules/algoliasearch/src/merge.js":[function(require,module,exports) {
var foreach = require('foreach');

module.exports = function merge(destination
/* , sources */
) {
  var sources = Array.prototype.slice.call(arguments);
  foreach(sources, function (source) {
    for (var keyName in source) {
      if (source.hasOwnProperty(keyName)) {
        if (typeof destination[keyName] === 'object' && typeof source[keyName] === 'object') {
          destination[keyName] = merge({}, destination[keyName], source[keyName]);
        } else if (source[keyName] !== undefined) {
          destination[keyName] = source[keyName];
        }
      }
    }
  });
  return destination;
};
},{"foreach":"../node_modules/foreach/index.js"}],"../node_modules/algoliasearch/src/clone.js":[function(require,module,exports) {
module.exports = function clone(obj) {
  return JSON.parse(JSON.stringify(obj));
};
},{}],"../node_modules/object-keys/isArguments.js":[function(require,module,exports) {
'use strict';

var toStr = Object.prototype.toString;

module.exports = function isArguments(value) {
  var str = toStr.call(value);
  var isArgs = str === '[object Arguments]';

  if (!isArgs) {
    isArgs = str !== '[object Array]' && value !== null && typeof value === 'object' && typeof value.length === 'number' && value.length >= 0 && toStr.call(value.callee) === '[object Function]';
  }

  return isArgs;
};
},{}],"../node_modules/object-keys/implementation.js":[function(require,module,exports) {
'use strict';

var keysShim;

if (!Object.keys) {
  // modified from https://github.com/es-shims/es5-shim
  var has = Object.prototype.hasOwnProperty;
  var toStr = Object.prototype.toString;

  var isArgs = require('./isArguments'); // eslint-disable-line global-require


  var isEnumerable = Object.prototype.propertyIsEnumerable;
  var hasDontEnumBug = !isEnumerable.call({
    toString: null
  }, 'toString');
  var hasProtoEnumBug = isEnumerable.call(function () {}, 'prototype');
  var dontEnums = ['toString', 'toLocaleString', 'valueOf', 'hasOwnProperty', 'isPrototypeOf', 'propertyIsEnumerable', 'constructor'];

  var equalsConstructorPrototype = function (o) {
    var ctor = o.constructor;
    return ctor && ctor.prototype === o;
  };

  var excludedKeys = {
    $applicationCache: true,
    $console: true,
    $external: true,
    $frame: true,
    $frameElement: true,
    $frames: true,
    $innerHeight: true,
    $innerWidth: true,
    $onmozfullscreenchange: true,
    $onmozfullscreenerror: true,
    $outerHeight: true,
    $outerWidth: true,
    $pageXOffset: true,
    $pageYOffset: true,
    $parent: true,
    $scrollLeft: true,
    $scrollTop: true,
    $scrollX: true,
    $scrollY: true,
    $self: true,
    $webkitIndexedDB: true,
    $webkitStorageInfo: true,
    $window: true
  };

  var hasAutomationEqualityBug = function () {
    /* global window */
    if (typeof window === 'undefined') {
      return false;
    }

    for (var k in window) {
      try {
        if (!excludedKeys['$' + k] && has.call(window, k) && window[k] !== null && typeof window[k] === 'object') {
          try {
            equalsConstructorPrototype(window[k]);
          } catch (e) {
            return true;
          }
        }
      } catch (e) {
        return true;
      }
    }

    return false;
  }();

  var equalsConstructorPrototypeIfNotBuggy = function (o) {
    /* global window */
    if (typeof window === 'undefined' || !hasAutomationEqualityBug) {
      return equalsConstructorPrototype(o);
    }

    try {
      return equalsConstructorPrototype(o);
    } catch (e) {
      return false;
    }
  };

  keysShim = function keys(object) {
    var isObject = object !== null && typeof object === 'object';
    var isFunction = toStr.call(object) === '[object Function]';
    var isArguments = isArgs(object);
    var isString = isObject && toStr.call(object) === '[object String]';
    var theKeys = [];

    if (!isObject && !isFunction && !isArguments) {
      throw new TypeError('Object.keys called on a non-object');
    }

    var skipProto = hasProtoEnumBug && isFunction;

    if (isString && object.length > 0 && !has.call(object, 0)) {
      for (var i = 0; i < object.length; ++i) {
        theKeys.push(String(i));
      }
    }

    if (isArguments && object.length > 0) {
      for (var j = 0; j < object.length; ++j) {
        theKeys.push(String(j));
      }
    } else {
      for (var name in object) {
        if (!(skipProto && name === 'prototype') && has.call(object, name)) {
          theKeys.push(String(name));
        }
      }
    }

    if (hasDontEnumBug) {
      var skipConstructor = equalsConstructorPrototypeIfNotBuggy(object);

      for (var k = 0; k < dontEnums.length; ++k) {
        if (!(skipConstructor && dontEnums[k] === 'constructor') && has.call(object, dontEnums[k])) {
          theKeys.push(dontEnums[k]);
        }
      }
    }

    return theKeys;
  };
}

module.exports = keysShim;
},{"./isArguments":"../node_modules/object-keys/isArguments.js"}],"../node_modules/object-keys/index.js":[function(require,module,exports) {
'use strict';

var slice = Array.prototype.slice;

var isArgs = require('./isArguments');

var origKeys = Object.keys;
var keysShim = origKeys ? function keys(o) {
  return origKeys(o);
} : require('./implementation');
var originalKeys = Object.keys;

keysShim.shim = function shimObjectKeys() {
  if (Object.keys) {
    var keysWorksWithArguments = function () {
      // Safari 5.0 bug
      var args = Object.keys(arguments);
      return args && args.length === arguments.length;
    }(1, 2);

    if (!keysWorksWithArguments) {
      Object.keys = function keys(object) {
        // eslint-disable-line func-name-matching
        if (isArgs(object)) {
          return originalKeys(slice.call(object));
        }

        return originalKeys(object);
      };
    }
  } else {
    Object.keys = keysShim;
  }

  return Object.keys || keysShim;
};

module.exports = keysShim;
},{"./isArguments":"../node_modules/object-keys/isArguments.js","./implementation":"../node_modules/object-keys/implementation.js"}],"../node_modules/algoliasearch/src/omit.js":[function(require,module,exports) {
module.exports = function omit(obj, test) {
  var keys = require('object-keys');

  var foreach = require('foreach');

  var filtered = {};
  foreach(keys(obj), function doFilter(keyName) {
    if (test(keyName) !== true) {
      filtered[keyName] = obj[keyName];
    }
  });
  return filtered;
};
},{"object-keys":"../node_modules/object-keys/index.js","foreach":"../node_modules/foreach/index.js"}],"../node_modules/isarray/index.js":[function(require,module,exports) {
var toString = {}.toString;

module.exports = Array.isArray || function (arr) {
  return toString.call(arr) == '[object Array]';
};

},{}],"../node_modules/algoliasearch/src/map.js":[function(require,module,exports) {
var foreach = require('foreach');

module.exports = function map(arr, fn) {
  var newArr = [];
  foreach(arr, function (item, itemIndex) {
    newArr.push(fn(item, itemIndex, arr));
  });
  return newArr;
};
},{"foreach":"../node_modules/foreach/index.js"}],"../node_modules/algoliasearch/src/IndexCore.js":[function(require,module,exports) {
var buildSearchMethod = require('./buildSearchMethod.js');

var deprecate = require('./deprecate.js');

var deprecatedMessage = require('./deprecatedMessage.js');

module.exports = IndexCore;
/*
* Index class constructor.
* You should not use this method directly but use initIndex() function
*/

function IndexCore(algoliasearch, indexName) {
  this.indexName = indexName;
  this.as = algoliasearch;
  this.typeAheadArgs = null;
  this.typeAheadValueOption = null; // make sure every index instance has it's own cache

  this.cache = {};
}
/*
* Clear all queries in cache
*/


IndexCore.prototype.clearCache = function () {
  this.cache = {};
};
/*
* Search inside the index using XMLHttpRequest request (Using a POST query to
* minimize number of OPTIONS queries: Cross-Origin Resource Sharing).
*
* @param {string} [query] the full text query
* @param {object} [args] (optional) if set, contains an object with query parameters:
* - page: (integer) Pagination parameter used to select the page to retrieve.
*                   Page is zero-based and defaults to 0. Thus,
*                   to retrieve the 10th page you need to set page=9
* - hitsPerPage: (integer) Pagination parameter used to select the number of hits per page. Defaults to 20.
* - attributesToRetrieve: a string that contains the list of object attributes
* you want to retrieve (let you minimize the answer size).
*   Attributes are separated with a comma (for example "name,address").
*   You can also use an array (for example ["name","address"]).
*   By default, all attributes are retrieved. You can also use '*' to retrieve all
*   values when an attributesToRetrieve setting is specified for your index.
* - attributesToHighlight: a string that contains the list of attributes you
*   want to highlight according to the query.
*   Attributes are separated by a comma. You can also use an array (for example ["name","address"]).
*   If an attribute has no match for the query, the raw value is returned.
*   By default all indexed text attributes are highlighted.
*   You can use `*` if you want to highlight all textual attributes.
*   Numerical attributes are not highlighted.
*   A matchLevel is returned for each highlighted attribute and can contain:
*      - full: if all the query terms were found in the attribute,
*      - partial: if only some of the query terms were found,
*      - none: if none of the query terms were found.
* - attributesToSnippet: a string that contains the list of attributes to snippet alongside
* the number of words to return (syntax is `attributeName:nbWords`).
*    Attributes are separated by a comma (Example: attributesToSnippet=name:10,content:10).
*    You can also use an array (Example: attributesToSnippet: ['name:10','content:10']).
*    By default no snippet is computed.
* - minWordSizefor1Typo: the minimum number of characters in a query word to accept one typo in this word.
* Defaults to 3.
* - minWordSizefor2Typos: the minimum number of characters in a query word
* to accept two typos in this word. Defaults to 7.
* - getRankingInfo: if set to 1, the result hits will contain ranking
* information in _rankingInfo attribute.
* - aroundLatLng: search for entries around a given
* latitude/longitude (specified as two floats separated by a comma).
*   For example aroundLatLng=47.316669,5.016670).
*   You can specify the maximum distance in meters with the aroundRadius parameter (in meters)
*   and the precision for ranking with aroundPrecision
*   (for example if you set aroundPrecision=100, two objects that are distant of
*   less than 100m will be considered as identical for "geo" ranking parameter).
*   At indexing, you should specify geoloc of an object with the _geoloc attribute
*   (in the form {"_geoloc":{"lat":48.853409, "lng":2.348800}})
* - insideBoundingBox: search entries inside a given area defined by the two extreme points
* of a rectangle (defined by 4 floats: p1Lat,p1Lng,p2Lat,p2Lng).
*   For example insideBoundingBox=47.3165,4.9665,47.3424,5.0201).
*   At indexing, you should specify geoloc of an object with the _geoloc attribute
*   (in the form {"_geoloc":{"lat":48.853409, "lng":2.348800}})
* - numericFilters: a string that contains the list of numeric filters you want to
* apply separated by a comma.
*   The syntax of one filter is `attributeName` followed by `operand` followed by `value`.
*   Supported operands are `<`, `<=`, `=`, `>` and `>=`.
*   You can have multiple conditions on one attribute like for example numericFilters=price>100,price<1000.
*   You can also use an array (for example numericFilters: ["price>100","price<1000"]).
* - tagFilters: filter the query by a set of tags. You can AND tags by separating them by commas.
*   To OR tags, you must add parentheses. For example, tags=tag1,(tag2,tag3) means tag1 AND (tag2 OR tag3).
*   You can also use an array, for example tagFilters: ["tag1",["tag2","tag3"]]
*   means tag1 AND (tag2 OR tag3).
*   At indexing, tags should be added in the _tags** attribute
*   of objects (for example {"_tags":["tag1","tag2"]}).
* - facetFilters: filter the query by a list of facets.
*   Facets are separated by commas and each facet is encoded as `attributeName:value`.
*   For example: `facetFilters=category:Book,author:John%20Doe`.
*   You can also use an array (for example `["category:Book","author:John%20Doe"]`).
* - facets: List of object attributes that you want to use for faceting.
*   Comma separated list: `"category,author"` or array `['category','author']`
*   Only attributes that have been added in **attributesForFaceting** index setting
*   can be used in this parameter.
*   You can also use `*` to perform faceting on all attributes specified in **attributesForFaceting**.
* - queryType: select how the query words are interpreted, it can be one of the following value:
*    - prefixAll: all query words are interpreted as prefixes,
*    - prefixLast: only the last word is interpreted as a prefix (default behavior),
*    - prefixNone: no query word is interpreted as a prefix. This option is not recommended.
* - optionalWords: a string that contains the list of words that should
* be considered as optional when found in the query.
*   Comma separated and array are accepted.
* - distinct: If set to 1, enable the distinct feature (disabled by default)
* if the attributeForDistinct index setting is set.
*   This feature is similar to the SQL "distinct" keyword: when enabled
*   in a query with the distinct=1 parameter,
*   all hits containing a duplicate value for the attributeForDistinct attribute are removed from results.
*   For example, if the chosen attribute is show_name and several hits have
*   the same value for show_name, then only the best
*   one is kept and others are removed.
* - restrictSearchableAttributes: List of attributes you want to use for
* textual search (must be a subset of the attributesToIndex index setting)
* either comma separated or as an array
* @param {function} [callback] the result callback called with two arguments:
*  error: null or Error('message'). If false, the content contains the error.
*  content: the server answer that contains the list of results.
*/


IndexCore.prototype.search = buildSearchMethod('query');
/*
* -- BETA --
* Search a record similar to the query inside the index using XMLHttpRequest request (Using a POST query to
* minimize number of OPTIONS queries: Cross-Origin Resource Sharing).
*
* @param {string} [query] the similar query
* @param {object} [args] (optional) if set, contains an object with query parameters.
*   All search parameters are supported (see search function), restrictSearchableAttributes and facetFilters
*   are the two most useful to restrict the similar results and get more relevant content
*/

IndexCore.prototype.similarSearch = deprecate(buildSearchMethod('similarQuery'), deprecatedMessage('index.similarSearch(query[, callback])', 'index.search({ similarQuery: query }[, callback])'));
/*
* Browse index content. The response content will have a `cursor` property that you can use
* to browse subsequent pages for this query. Use `index.browseFrom(cursor)` when you want.
*
* @param {string} query - The full text query
* @param {Object} [queryParameters] - Any search query parameter
* @param {Function} [callback] - The result callback called with two arguments
*   error: null or Error('message')
*   content: the server answer with the browse result
* @return {Promise|undefined} Returns a promise if no callback given
* @example
* index.browse('cool songs', {
*   tagFilters: 'public,comments',
*   hitsPerPage: 500
* }, callback);
* @see {@link https://www.algolia.com/doc/rest_api#Browse|Algolia REST API Documentation}
*/

IndexCore.prototype.browse = function (query, queryParameters, callback) {
  var merge = require('./merge.js');

  var indexObj = this;
  var page;
  var hitsPerPage; // we check variadic calls that are not the one defined
  // .browse()/.browse(fn)
  // => page = 0

  if (arguments.length === 0 || arguments.length === 1 && typeof arguments[0] === 'function') {
    page = 0;
    callback = arguments[0];
    query = undefined;
  } else if (typeof arguments[0] === 'number') {
    // .browse(2)/.browse(2, 10)/.browse(2, fn)/.browse(2, 10, fn)
    page = arguments[0];

    if (typeof arguments[1] === 'number') {
      hitsPerPage = arguments[1];
    } else if (typeof arguments[1] === 'function') {
      callback = arguments[1];
      hitsPerPage = undefined;
    }

    query = undefined;
    queryParameters = undefined;
  } else if (typeof arguments[0] === 'object') {
    // .browse(queryParameters)/.browse(queryParameters, cb)
    if (typeof arguments[1] === 'function') {
      callback = arguments[1];
    }

    queryParameters = arguments[0];
    query = undefined;
  } else if (typeof arguments[0] === 'string' && typeof arguments[1] === 'function') {
    // .browse(query, cb)
    callback = arguments[1];
    queryParameters = undefined;
  } // otherwise it's a .browse(query)/.browse(query, queryParameters)/.browse(query, queryParameters, cb)
  // get search query parameters combining various possible calls
  // to .browse();


  queryParameters = merge({}, queryParameters || {}, {
    page: page,
    hitsPerPage: hitsPerPage,
    query: query
  });

  var params = this.as._getSearchParams(queryParameters, '');

  return this.as._jsonRequest({
    method: 'POST',
    url: '/1/indexes/' + encodeURIComponent(indexObj.indexName) + '/browse',
    body: {
      params: params
    },
    hostType: 'read',
    callback: callback
  });
};
/*
* Continue browsing from a previous position (cursor), obtained via a call to `.browse()`.
*
* @param {string} query - The full text query
* @param {Object} [queryParameters] - Any search query parameter
* @param {Function} [callback] - The result callback called with two arguments
*   error: null or Error('message')
*   content: the server answer with the browse result
* @return {Promise|undefined} Returns a promise if no callback given
* @example
* index.browseFrom('14lkfsakl32', callback);
* @see {@link https://www.algolia.com/doc/rest_api#Browse|Algolia REST API Documentation}
*/


IndexCore.prototype.browseFrom = function (cursor, callback) {
  return this.as._jsonRequest({
    method: 'POST',
    url: '/1/indexes/' + encodeURIComponent(this.indexName) + '/browse',
    body: {
      cursor: cursor
    },
    hostType: 'read',
    callback: callback
  });
};
/*
* Search for facet values
* https://www.algolia.com/doc/rest-api/search#search-for-facet-values
*
* @param {string} params.facetName Facet name, name of the attribute to search for values in.
* Must be declared as a facet
* @param {string} params.facetQuery Query for the facet search
* @param {string} [params.*] Any search parameter of Algolia,
* see https://www.algolia.com/doc/api-client/javascript/search#search-parameters
* Pagination is not supported. The page and hitsPerPage parameters will be ignored.
* @param callback (optional)
*/


IndexCore.prototype.searchForFacetValues = function (params, callback) {
  var clone = require('./clone.js');

  var omit = require('./omit.js');

  var usage = 'Usage: index.searchForFacetValues({facetName, facetQuery, ...params}[, callback])';

  if (params.facetName === undefined || params.facetQuery === undefined) {
    throw new Error(usage);
  }

  var facetName = params.facetName;
  var filteredParams = omit(clone(params), function (keyName) {
    return keyName === 'facetName';
  });

  var searchParameters = this.as._getSearchParams(filteredParams, '');

  return this.as._jsonRequest({
    method: 'POST',
    url: '/1/indexes/' + encodeURIComponent(this.indexName) + '/facets/' + encodeURIComponent(facetName) + '/query',
    hostType: 'read',
    body: {
      params: searchParameters
    },
    callback: callback
  });
};

IndexCore.prototype.searchFacet = deprecate(function (params, callback) {
  return this.searchForFacetValues(params, callback);
}, deprecatedMessage('index.searchFacet(params[, callback])', 'index.searchForFacetValues(params[, callback])'));

IndexCore.prototype._search = function (params, url, callback, additionalUA) {
  return this.as._jsonRequest({
    cache: this.cache,
    method: 'POST',
    url: url || '/1/indexes/' + encodeURIComponent(this.indexName) + '/query',
    body: {
      params: params
    },
    hostType: 'read',
    fallback: {
      method: 'GET',
      url: '/1/indexes/' + encodeURIComponent(this.indexName),
      body: {
        params: params
      }
    },
    callback: callback,
    additionalUA: additionalUA
  });
};
/*
* Get an object from this index
*
* @param objectID the unique identifier of the object to retrieve
* @param attrs (optional) if set, contains the array of attribute names to retrieve
* @param callback (optional) the result callback called with two arguments
*  error: null or Error('message')
*  content: the object to retrieve or the error message if a failure occurred
*/


IndexCore.prototype.getObject = function (objectID, attrs, callback) {
  var indexObj = this;

  if (arguments.length === 1 || typeof attrs === 'function') {
    callback = attrs;
    attrs = undefined;
  }

  var params = '';

  if (attrs !== undefined) {
    params = '?attributes=';

    for (var i = 0; i < attrs.length; ++i) {
      if (i !== 0) {
        params += ',';
      }

      params += attrs[i];
    }
  }

  return this.as._jsonRequest({
    method: 'GET',
    url: '/1/indexes/' + encodeURIComponent(indexObj.indexName) + '/' + encodeURIComponent(objectID) + params,
    hostType: 'read',
    callback: callback
  });
};
/*
* Get several objects from this index
*
* @param objectIDs the array of unique identifier of objects to retrieve
*/


IndexCore.prototype.getObjects = function (objectIDs, attributesToRetrieve, callback) {
  var isArray = require('isarray');

  var map = require('./map.js');

  var usage = 'Usage: index.getObjects(arrayOfObjectIDs[, callback])';

  if (!isArray(objectIDs)) {
    throw new Error(usage);
  }

  var indexObj = this;

  if (arguments.length === 1 || typeof attributesToRetrieve === 'function') {
    callback = attributesToRetrieve;
    attributesToRetrieve = undefined;
  }

  var body = {
    requests: map(objectIDs, function prepareRequest(objectID) {
      var request = {
        indexName: indexObj.indexName,
        objectID: objectID
      };

      if (attributesToRetrieve) {
        request.attributesToRetrieve = attributesToRetrieve.join(',');
      }

      return request;
    })
  };
  return this.as._jsonRequest({
    method: 'POST',
    url: '/1/indexes/*/objects',
    hostType: 'read',
    body: body,
    callback: callback
  });
};

IndexCore.prototype.as = null;
IndexCore.prototype.indexName = null;
IndexCore.prototype.typeAheadArgs = null;
IndexCore.prototype.typeAheadValueOption = null;
},{"./buildSearchMethod.js":"../node_modules/algoliasearch/src/buildSearchMethod.js","./deprecate.js":"../node_modules/algoliasearch/src/deprecate.js","./deprecatedMessage.js":"../node_modules/algoliasearch/src/deprecatedMessage.js","./merge.js":"../node_modules/algoliasearch/src/merge.js","./clone.js":"../node_modules/algoliasearch/src/clone.js","./omit.js":"../node_modules/algoliasearch/src/omit.js","isarray":"../node_modules/isarray/index.js","./map.js":"../node_modules/algoliasearch/src/map.js"}],"../node_modules/algoliasearch/src/exitPromise.js":[function(require,module,exports) {
// Parse cloud does not supports setTimeout
// We do not store a setTimeout reference in the client everytime
// We only fallback to a fake setTimeout when not available
// setTimeout cannot be override globally sadly
module.exports = function exitPromise(fn, _setTimeout) {
  _setTimeout(fn, 0);
};
},{}],"../../../../.nvm/versions/node/v10.15.3/lib/node_modules/parcel-bundler/node_modules/events/events.js":[function(require,module,exports) {
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.
'use strict';

var R = typeof Reflect === 'object' ? Reflect : null;
var ReflectApply = R && typeof R.apply === 'function' ? R.apply : function ReflectApply(target, receiver, args) {
  return Function.prototype.apply.call(target, receiver, args);
};
var ReflectOwnKeys;

if (R && typeof R.ownKeys === 'function') {
  ReflectOwnKeys = R.ownKeys;
} else if (Object.getOwnPropertySymbols) {
  ReflectOwnKeys = function ReflectOwnKeys(target) {
    return Object.getOwnPropertyNames(target).concat(Object.getOwnPropertySymbols(target));
  };
} else {
  ReflectOwnKeys = function ReflectOwnKeys(target) {
    return Object.getOwnPropertyNames(target);
  };
}

function ProcessEmitWarning(warning) {
  if (console && console.warn) console.warn(warning);
}

var NumberIsNaN = Number.isNaN || function NumberIsNaN(value) {
  return value !== value;
};

function EventEmitter() {
  EventEmitter.init.call(this);
}

module.exports = EventEmitter; // Backwards-compat with node 0.10.x

EventEmitter.EventEmitter = EventEmitter;
EventEmitter.prototype._events = undefined;
EventEmitter.prototype._eventsCount = 0;
EventEmitter.prototype._maxListeners = undefined; // By default EventEmitters will print a warning if more than 10 listeners are
// added to it. This is a useful default which helps finding memory leaks.

var defaultMaxListeners = 10;
Object.defineProperty(EventEmitter, 'defaultMaxListeners', {
  enumerable: true,
  get: function () {
    return defaultMaxListeners;
  },
  set: function (arg) {
    if (typeof arg !== 'number' || arg < 0 || NumberIsNaN(arg)) {
      throw new RangeError('The value of "defaultMaxListeners" is out of range. It must be a non-negative number. Received ' + arg + '.');
    }

    defaultMaxListeners = arg;
  }
});

EventEmitter.init = function () {
  if (this._events === undefined || this._events === Object.getPrototypeOf(this)._events) {
    this._events = Object.create(null);
    this._eventsCount = 0;
  }

  this._maxListeners = this._maxListeners || undefined;
}; // Obviously not all Emitters should be limited to 10. This function allows
// that to be increased. Set to zero for unlimited.


EventEmitter.prototype.setMaxListeners = function setMaxListeners(n) {
  if (typeof n !== 'number' || n < 0 || NumberIsNaN(n)) {
    throw new RangeError('The value of "n" is out of range. It must be a non-negative number. Received ' + n + '.');
  }

  this._maxListeners = n;
  return this;
};

function $getMaxListeners(that) {
  if (that._maxListeners === undefined) return EventEmitter.defaultMaxListeners;
  return that._maxListeners;
}

EventEmitter.prototype.getMaxListeners = function getMaxListeners() {
  return $getMaxListeners(this);
};

EventEmitter.prototype.emit = function emit(type) {
  var args = [];

  for (var i = 1; i < arguments.length; i++) args.push(arguments[i]);

  var doError = type === 'error';
  var events = this._events;
  if (events !== undefined) doError = doError && events.error === undefined;else if (!doError) return false; // If there is no 'error' event listener then throw.

  if (doError) {
    var er;
    if (args.length > 0) er = args[0];

    if (er instanceof Error) {
      // Note: The comments on the `throw` lines are intentional, they show
      // up in Node's output if this results in an unhandled exception.
      throw er; // Unhandled 'error' event
    } // At least give some kind of context to the user


    var err = new Error('Unhandled error.' + (er ? ' (' + er.message + ')' : ''));
    err.context = er;
    throw err; // Unhandled 'error' event
  }

  var handler = events[type];
  if (handler === undefined) return false;

  if (typeof handler === 'function') {
    ReflectApply(handler, this, args);
  } else {
    var len = handler.length;
    var listeners = arrayClone(handler, len);

    for (var i = 0; i < len; ++i) ReflectApply(listeners[i], this, args);
  }

  return true;
};

function _addListener(target, type, listener, prepend) {
  var m;
  var events;
  var existing;

  if (typeof listener !== 'function') {
    throw new TypeError('The "listener" argument must be of type Function. Received type ' + typeof listener);
  }

  events = target._events;

  if (events === undefined) {
    events = target._events = Object.create(null);
    target._eventsCount = 0;
  } else {
    // To avoid recursion in the case that type === "newListener"! Before
    // adding it to the listeners, first emit "newListener".
    if (events.newListener !== undefined) {
      target.emit('newListener', type, listener.listener ? listener.listener : listener); // Re-assign `events` because a newListener handler could have caused the
      // this._events to be assigned to a new object

      events = target._events;
    }

    existing = events[type];
  }

  if (existing === undefined) {
    // Optimize the case of one listener. Don't need the extra array object.
    existing = events[type] = listener;
    ++target._eventsCount;
  } else {
    if (typeof existing === 'function') {
      // Adding the second element, need to change to array.
      existing = events[type] = prepend ? [listener, existing] : [existing, listener]; // If we've already got an array, just append.
    } else if (prepend) {
      existing.unshift(listener);
    } else {
      existing.push(listener);
    } // Check for listener leak


    m = $getMaxListeners(target);

    if (m > 0 && existing.length > m && !existing.warned) {
      existing.warned = true; // No error code for this since it is a Warning
      // eslint-disable-next-line no-restricted-syntax

      var w = new Error('Possible EventEmitter memory leak detected. ' + existing.length + ' ' + String(type) + ' listeners ' + 'added. Use emitter.setMaxListeners() to ' + 'increase limit');
      w.name = 'MaxListenersExceededWarning';
      w.emitter = target;
      w.type = type;
      w.count = existing.length;
      ProcessEmitWarning(w);
    }
  }

  return target;
}

EventEmitter.prototype.addListener = function addListener(type, listener) {
  return _addListener(this, type, listener, false);
};

EventEmitter.prototype.on = EventEmitter.prototype.addListener;

EventEmitter.prototype.prependListener = function prependListener(type, listener) {
  return _addListener(this, type, listener, true);
};

function onceWrapper() {
  var args = [];

  for (var i = 0; i < arguments.length; i++) args.push(arguments[i]);

  if (!this.fired) {
    this.target.removeListener(this.type, this.wrapFn);
    this.fired = true;
    ReflectApply(this.listener, this.target, args);
  }
}

function _onceWrap(target, type, listener) {
  var state = {
    fired: false,
    wrapFn: undefined,
    target: target,
    type: type,
    listener: listener
  };
  var wrapped = onceWrapper.bind(state);
  wrapped.listener = listener;
  state.wrapFn = wrapped;
  return wrapped;
}

EventEmitter.prototype.once = function once(type, listener) {
  if (typeof listener !== 'function') {
    throw new TypeError('The "listener" argument must be of type Function. Received type ' + typeof listener);
  }

  this.on(type, _onceWrap(this, type, listener));
  return this;
};

EventEmitter.prototype.prependOnceListener = function prependOnceListener(type, listener) {
  if (typeof listener !== 'function') {
    throw new TypeError('The "listener" argument must be of type Function. Received type ' + typeof listener);
  }

  this.prependListener(type, _onceWrap(this, type, listener));
  return this;
}; // Emits a 'removeListener' event if and only if the listener was removed.


EventEmitter.prototype.removeListener = function removeListener(type, listener) {
  var list, events, position, i, originalListener;

  if (typeof listener !== 'function') {
    throw new TypeError('The "listener" argument must be of type Function. Received type ' + typeof listener);
  }

  events = this._events;
  if (events === undefined) return this;
  list = events[type];
  if (list === undefined) return this;

  if (list === listener || list.listener === listener) {
    if (--this._eventsCount === 0) this._events = Object.create(null);else {
      delete events[type];
      if (events.removeListener) this.emit('removeListener', type, list.listener || listener);
    }
  } else if (typeof list !== 'function') {
    position = -1;

    for (i = list.length - 1; i >= 0; i--) {
      if (list[i] === listener || list[i].listener === listener) {
        originalListener = list[i].listener;
        position = i;
        break;
      }
    }

    if (position < 0) return this;
    if (position === 0) list.shift();else {
      spliceOne(list, position);
    }
    if (list.length === 1) events[type] = list[0];
    if (events.removeListener !== undefined) this.emit('removeListener', type, originalListener || listener);
  }

  return this;
};

EventEmitter.prototype.off = EventEmitter.prototype.removeListener;

EventEmitter.prototype.removeAllListeners = function removeAllListeners(type) {
  var listeners, events, i;
  events = this._events;
  if (events === undefined) return this; // not listening for removeListener, no need to emit

  if (events.removeListener === undefined) {
    if (arguments.length === 0) {
      this._events = Object.create(null);
      this._eventsCount = 0;
    } else if (events[type] !== undefined) {
      if (--this._eventsCount === 0) this._events = Object.create(null);else delete events[type];
    }

    return this;
  } // emit removeListener for all listeners on all events


  if (arguments.length === 0) {
    var keys = Object.keys(events);
    var key;

    for (i = 0; i < keys.length; ++i) {
      key = keys[i];
      if (key === 'removeListener') continue;
      this.removeAllListeners(key);
    }

    this.removeAllListeners('removeListener');
    this._events = Object.create(null);
    this._eventsCount = 0;
    return this;
  }

  listeners = events[type];

  if (typeof listeners === 'function') {
    this.removeListener(type, listeners);
  } else if (listeners !== undefined) {
    // LIFO order
    for (i = listeners.length - 1; i >= 0; i--) {
      this.removeListener(type, listeners[i]);
    }
  }

  return this;
};

function _listeners(target, type, unwrap) {
  var events = target._events;
  if (events === undefined) return [];
  var evlistener = events[type];
  if (evlistener === undefined) return [];
  if (typeof evlistener === 'function') return unwrap ? [evlistener.listener || evlistener] : [evlistener];
  return unwrap ? unwrapListeners(evlistener) : arrayClone(evlistener, evlistener.length);
}

EventEmitter.prototype.listeners = function listeners(type) {
  return _listeners(this, type, true);
};

EventEmitter.prototype.rawListeners = function rawListeners(type) {
  return _listeners(this, type, false);
};

EventEmitter.listenerCount = function (emitter, type) {
  if (typeof emitter.listenerCount === 'function') {
    return emitter.listenerCount(type);
  } else {
    return listenerCount.call(emitter, type);
  }
};

EventEmitter.prototype.listenerCount = listenerCount;

function listenerCount(type) {
  var events = this._events;

  if (events !== undefined) {
    var evlistener = events[type];

    if (typeof evlistener === 'function') {
      return 1;
    } else if (evlistener !== undefined) {
      return evlistener.length;
    }
  }

  return 0;
}

EventEmitter.prototype.eventNames = function eventNames() {
  return this._eventsCount > 0 ? ReflectOwnKeys(this._events) : [];
};

function arrayClone(arr, n) {
  var copy = new Array(n);

  for (var i = 0; i < n; ++i) copy[i] = arr[i];

  return copy;
}

function spliceOne(list, index) {
  for (; index + 1 < list.length; index++) list[index] = list[index + 1];

  list.pop();
}

function unwrapListeners(arr) {
  var ret = new Array(arr.length);

  for (var i = 0; i < ret.length; ++i) {
    ret[i] = arr[i].listener || arr[i];
  }

  return ret;
}
},{}],"../node_modules/algoliasearch/src/IndexBrowser.js":[function(require,module,exports) {
'use strict'; // This is the object returned by the `index.browseAll()` method

module.exports = IndexBrowser;

var inherits = require('inherits');

var EventEmitter = require('events').EventEmitter;

function IndexBrowser() {}

inherits(IndexBrowser, EventEmitter);

IndexBrowser.prototype.stop = function () {
  this._stopped = true;

  this._clean();
};

IndexBrowser.prototype._end = function () {
  this.emit('end');

  this._clean();
};

IndexBrowser.prototype._error = function (err) {
  this.emit('error', err);

  this._clean();
};

IndexBrowser.prototype._result = function (content) {
  this.emit('result', content);
};

IndexBrowser.prototype._clean = function () {
  this.removeAllListeners('stop');
  this.removeAllListeners('end');
  this.removeAllListeners('error');
  this.removeAllListeners('result');
};
},{"inherits":"../node_modules/inherits/inherits_browser.js","events":"../../../../.nvm/versions/node/v10.15.3/lib/node_modules/parcel-bundler/node_modules/events/events.js"}],"../node_modules/algoliasearch/src/Index.js":[function(require,module,exports) {
var inherits = require('inherits');

var IndexCore = require('./IndexCore.js');

var deprecate = require('./deprecate.js');

var deprecatedMessage = require('./deprecatedMessage.js');

var exitPromise = require('./exitPromise.js');

var errors = require('./errors');

var deprecateForwardToSlaves = deprecate(function () {}, deprecatedMessage('forwardToSlaves', 'forwardToReplicas'));
module.exports = Index;

function Index() {
  IndexCore.apply(this, arguments);
}

inherits(Index, IndexCore);
/*
* Add an object in this index
*
* @param content contains the javascript object to add inside the index
* @param objectID (optional) an objectID you want to attribute to this object
* (if the attribute already exist the old object will be overwrite)
* @param callback (optional) the result callback called with two arguments:
*  error: null or Error('message')
*  content: the server answer that contains 3 elements: createAt, taskId and objectID
*/

Index.prototype.addObject = function (content, objectID, callback) {
  var indexObj = this;

  if (arguments.length === 1 || typeof objectID === 'function') {
    callback = objectID;
    objectID = undefined;
  }

  return this.as._jsonRequest({
    method: objectID !== undefined ? 'PUT' : // update or create
    'POST',
    // create (API generates an objectID)
    url: '/1/indexes/' + encodeURIComponent(indexObj.indexName) + ( // create
    objectID !== undefined ? '/' + encodeURIComponent(objectID) : ''),
    // update or create
    body: content,
    hostType: 'write',
    callback: callback
  });
};
/*
* Add several objects
*
* @param objects contains an array of objects to add
* @param callback (optional) the result callback called with two arguments:
*  error: null or Error('message')
*  content: the server answer that updateAt and taskID
*/


Index.prototype.addObjects = function (objects, callback) {
  var isArray = require('isarray');

  var usage = 'Usage: index.addObjects(arrayOfObjects[, callback])';

  if (!isArray(objects)) {
    throw new Error(usage);
  }

  var indexObj = this;
  var postObj = {
    requests: []
  };

  for (var i = 0; i < objects.length; ++i) {
    var request = {
      action: 'addObject',
      body: objects[i]
    };
    postObj.requests.push(request);
  }

  return this.as._jsonRequest({
    method: 'POST',
    url: '/1/indexes/' + encodeURIComponent(indexObj.indexName) + '/batch',
    body: postObj,
    hostType: 'write',
    callback: callback
  });
};
/*
* Update partially an object (only update attributes passed in argument)
*
* @param partialObject contains the javascript attributes to override, the
*  object must contains an objectID attribute
* @param createIfNotExists (optional) if false, avoid an automatic creation of the object
* @param callback (optional) the result callback called with two arguments:
*  error: null or Error('message')
*  content: the server answer that contains 3 elements: createAt, taskId and objectID
*/


Index.prototype.partialUpdateObject = function (partialObject, createIfNotExists, callback) {
  if (arguments.length === 1 || typeof createIfNotExists === 'function') {
    callback = createIfNotExists;
    createIfNotExists = undefined;
  }

  var indexObj = this;
  var url = '/1/indexes/' + encodeURIComponent(indexObj.indexName) + '/' + encodeURIComponent(partialObject.objectID) + '/partial';

  if (createIfNotExists === false) {
    url += '?createIfNotExists=false';
  }

  return this.as._jsonRequest({
    method: 'POST',
    url: url,
    body: partialObject,
    hostType: 'write',
    callback: callback
  });
};
/*
* Partially Override the content of several objects
*
* @param objects contains an array of objects to update (each object must contains a objectID attribute)
* @param callback (optional) the result callback called with two arguments:
*  error: null or Error('message')
*  content: the server answer that updateAt and taskID
*/


Index.prototype.partialUpdateObjects = function (objects, createIfNotExists, callback) {
  if (arguments.length === 1 || typeof createIfNotExists === 'function') {
    callback = createIfNotExists;
    createIfNotExists = true;
  }

  var isArray = require('isarray');

  var usage = 'Usage: index.partialUpdateObjects(arrayOfObjects[, callback])';

  if (!isArray(objects)) {
    throw new Error(usage);
  }

  var indexObj = this;
  var postObj = {
    requests: []
  };

  for (var i = 0; i < objects.length; ++i) {
    var request = {
      action: createIfNotExists === true ? 'partialUpdateObject' : 'partialUpdateObjectNoCreate',
      objectID: objects[i].objectID,
      body: objects[i]
    };
    postObj.requests.push(request);
  }

  return this.as._jsonRequest({
    method: 'POST',
    url: '/1/indexes/' + encodeURIComponent(indexObj.indexName) + '/batch',
    body: postObj,
    hostType: 'write',
    callback: callback
  });
};
/*
* Override the content of object
*
* @param object contains the javascript object to save, the object must contains an objectID attribute
* @param callback (optional) the result callback called with two arguments:
*  error: null or Error('message')
*  content: the server answer that updateAt and taskID
*/


Index.prototype.saveObject = function (object, callback) {
  var indexObj = this;
  return this.as._jsonRequest({
    method: 'PUT',
    url: '/1/indexes/' + encodeURIComponent(indexObj.indexName) + '/' + encodeURIComponent(object.objectID),
    body: object,
    hostType: 'write',
    callback: callback
  });
};
/*
* Override the content of several objects
*
* @param objects contains an array of objects to update (each object must contains a objectID attribute)
* @param callback (optional) the result callback called with two arguments:
*  error: null or Error('message')
*  content: the server answer that updateAt and taskID
*/


Index.prototype.saveObjects = function (objects, callback) {
  var isArray = require('isarray');

  var usage = 'Usage: index.saveObjects(arrayOfObjects[, callback])';

  if (!isArray(objects)) {
    throw new Error(usage);
  }

  var indexObj = this;
  var postObj = {
    requests: []
  };

  for (var i = 0; i < objects.length; ++i) {
    var request = {
      action: 'updateObject',
      objectID: objects[i].objectID,
      body: objects[i]
    };
    postObj.requests.push(request);
  }

  return this.as._jsonRequest({
    method: 'POST',
    url: '/1/indexes/' + encodeURIComponent(indexObj.indexName) + '/batch',
    body: postObj,
    hostType: 'write',
    callback: callback
  });
};
/*
* Delete an object from the index
*
* @param objectID the unique identifier of object to delete
* @param callback (optional) the result callback called with two arguments:
*  error: null or Error('message')
*  content: the server answer that contains 3 elements: createAt, taskId and objectID
*/


Index.prototype.deleteObject = function (objectID, callback) {
  if (typeof objectID === 'function' || typeof objectID !== 'string' && typeof objectID !== 'number') {
    var err = new errors.AlgoliaSearchError(objectID && typeof objectID !== 'function' ? 'ObjectID must be a string' : 'Cannot delete an object without an objectID');
    callback = objectID;

    if (typeof callback === 'function') {
      return callback(err);
    }

    return this.as._promise.reject(err);
  }

  var indexObj = this;
  return this.as._jsonRequest({
    method: 'DELETE',
    url: '/1/indexes/' + encodeURIComponent(indexObj.indexName) + '/' + encodeURIComponent(objectID),
    hostType: 'write',
    callback: callback
  });
};
/*
* Delete several objects from an index
*
* @param objectIDs contains an array of objectID to delete
* @param callback (optional) the result callback called with two arguments:
*  error: null or Error('message')
*  content: the server answer that contains 3 elements: createAt, taskId and objectID
*/


Index.prototype.deleteObjects = function (objectIDs, callback) {
  var isArray = require('isarray');

  var map = require('./map.js');

  var usage = 'Usage: index.deleteObjects(arrayOfObjectIDs[, callback])';

  if (!isArray(objectIDs)) {
    throw new Error(usage);
  }

  var indexObj = this;
  var postObj = {
    requests: map(objectIDs, function prepareRequest(objectID) {
      return {
        action: 'deleteObject',
        objectID: objectID,
        body: {
          objectID: objectID
        }
      };
    })
  };
  return this.as._jsonRequest({
    method: 'POST',
    url: '/1/indexes/' + encodeURIComponent(indexObj.indexName) + '/batch',
    body: postObj,
    hostType: 'write',
    callback: callback
  });
};
/*
* Delete all objects matching a query
*
* @param query the query string
* @param params the optional query parameters
* @param callback (optional) the result callback called with one argument
*  error: null or Error('message')
* @deprecated see index.deleteBy
*/


Index.prototype.deleteByQuery = deprecate(function (query, params, callback) {
  var clone = require('./clone.js');

  var map = require('./map.js');

  var indexObj = this;
  var client = indexObj.as;

  if (arguments.length === 1 || typeof params === 'function') {
    callback = params;
    params = {};
  } else {
    params = clone(params);
  }

  params.attributesToRetrieve = 'objectID';
  params.hitsPerPage = 1000;
  params.distinct = false; // when deleting, we should never use cache to get the
  // search results

  this.clearCache(); // there's a problem in how we use the promise chain,
  // see how waitTask is done

  var promise = this.search(query, params).then(stopOrDelete);

  function stopOrDelete(searchContent) {
    // stop here
    if (searchContent.nbHits === 0) {
      // return indexObj.as._request.resolve();
      return searchContent;
    } // continue and do a recursive call


    var objectIDs = map(searchContent.hits, function getObjectID(object) {
      return object.objectID;
    });
    return indexObj.deleteObjects(objectIDs).then(waitTask).then(doDeleteByQuery);
  }

  function waitTask(deleteObjectsContent) {
    return indexObj.waitTask(deleteObjectsContent.taskID);
  }

  function doDeleteByQuery() {
    return indexObj.deleteByQuery(query, params);
  }

  if (!callback) {
    return promise;
  }

  promise.then(success, failure);

  function success() {
    exitPromise(function exit() {
      callback(null);
    }, client._setTimeout || setTimeout);
  }

  function failure(err) {
    exitPromise(function exit() {
      callback(err);
    }, client._setTimeout || setTimeout);
  }
}, deprecatedMessage('index.deleteByQuery()', 'index.deleteBy()'));
/**
* Delete all objects matching a query
*
* the query parameters that can be used are:
* - filters (numeric, facet, tag)
* - geo
*
* you can not send an empty query or filters
*
* @param params the optional query parameters
* @param callback (optional) the result callback called with one argument
*  error: null or Error('message')
*/

Index.prototype.deleteBy = function (params, callback) {
  var indexObj = this;
  return this.as._jsonRequest({
    method: 'POST',
    url: '/1/indexes/' + encodeURIComponent(indexObj.indexName) + '/deleteByQuery',
    body: {
      params: indexObj.as._getSearchParams(params, '')
    },
    hostType: 'write',
    callback: callback
  });
};
/*
* Browse all content from an index using events. Basically this will do
* .browse() -> .browseFrom -> .browseFrom -> .. until all the results are returned
*
* @param {string} query - The full text query
* @param {Object} [queryParameters] - Any search query parameter
* @return {EventEmitter}
* @example
* var browser = index.browseAll('cool songs', {
*   tagFilters: 'public,comments',
*   hitsPerPage: 500
* });
*
* browser.on('result', function resultCallback(content) {
*   console.log(content.hits);
* });
*
* // if any error occurs, you get it
* browser.on('error', function(err) {
*   throw err;
* });
*
* // when you have browsed the whole index, you get this event
* browser.on('end', function() {
*   console.log('finished');
* });
*
* // at any point if you want to stop the browsing process, you can stop it manually
* // otherwise it will go on and on
* browser.stop();
*
* @see {@link https://www.algolia.com/doc/rest_api#Browse|Algolia REST API Documentation}
*/


Index.prototype.browseAll = function (query, queryParameters) {
  if (typeof query === 'object') {
    queryParameters = query;
    query = undefined;
  }

  var merge = require('./merge.js');

  var IndexBrowser = require('./IndexBrowser');

  var browser = new IndexBrowser();
  var client = this.as;
  var index = this;

  var params = client._getSearchParams(merge({}, queryParameters || {}, {
    query: query
  }), ''); // start browsing


  browseLoop();

  function browseLoop(cursor) {
    if (browser._stopped) {
      return;
    }

    var body;

    if (cursor !== undefined) {
      body = {
        cursor: cursor
      };
    } else {
      body = {
        params: params
      };
    }

    client._jsonRequest({
      method: 'POST',
      url: '/1/indexes/' + encodeURIComponent(index.indexName) + '/browse',
      hostType: 'read',
      body: body,
      callback: browseCallback
    });
  }

  function browseCallback(err, content) {
    if (browser._stopped) {
      return;
    }

    if (err) {
      browser._error(err);

      return;
    }

    browser._result(content); // no cursor means we are finished browsing


    if (content.cursor === undefined) {
      browser._end();

      return;
    }

    browseLoop(content.cursor);
  }

  return browser;
};
/*
* Get a Typeahead.js adapter
* @param searchParams contains an object with query parameters (see search for details)
*/


Index.prototype.ttAdapter = deprecate(function (params) {
  var self = this;
  return function ttAdapter(query, syncCb, asyncCb) {
    var cb;

    if (typeof asyncCb === 'function') {
      // typeahead 0.11
      cb = asyncCb;
    } else {
      // pre typeahead 0.11
      cb = syncCb;
    }

    self.search(query, params, function searchDone(err, content) {
      if (err) {
        cb(err);
        return;
      }

      cb(content.hits);
    });
  };
}, 'ttAdapter is not necessary anymore and will be removed in the next version,\n' + 'have a look at autocomplete.js (https://github.com/algolia/autocomplete.js)');
/*
* Wait the publication of a task on the server.
* All server task are asynchronous and you can check with this method that the task is published.
*
* @param taskID the id of the task returned by server
* @param callback the result callback with with two arguments:
*  error: null or Error('message')
*  content: the server answer that contains the list of results
*/

Index.prototype.waitTask = function (taskID, callback) {
  // wait minimum 100ms before retrying
  var baseDelay = 100; // wait maximum 5s before retrying

  var maxDelay = 5000;
  var loop = 0; // waitTask() must be handled differently from other methods,
  // it's a recursive method using a timeout

  var indexObj = this;
  var client = indexObj.as;
  var promise = retryLoop();

  function retryLoop() {
    return client._jsonRequest({
      method: 'GET',
      hostType: 'read',
      url: '/1/indexes/' + encodeURIComponent(indexObj.indexName) + '/task/' + taskID
    }).then(function success(content) {
      loop++;
      var delay = baseDelay * loop * loop;

      if (delay > maxDelay) {
        delay = maxDelay;
      }

      if (content.status !== 'published') {
        return client._promise.delay(delay).then(retryLoop);
      }

      return content;
    });
  }

  if (!callback) {
    return promise;
  }

  promise.then(successCb, failureCb);

  function successCb(content) {
    exitPromise(function exit() {
      callback(null, content);
    }, client._setTimeout || setTimeout);
  }

  function failureCb(err) {
    exitPromise(function exit() {
      callback(err);
    }, client._setTimeout || setTimeout);
  }
};
/*
* This function deletes the index content. Settings and index specific API keys are kept untouched.
*
* @param callback (optional) the result callback called with two arguments
*  error: null or Error('message')
*  content: the settings object or the error message if a failure occurred
*/


Index.prototype.clearIndex = function (callback) {
  var indexObj = this;
  return this.as._jsonRequest({
    method: 'POST',
    url: '/1/indexes/' + encodeURIComponent(indexObj.indexName) + '/clear',
    hostType: 'write',
    callback: callback
  });
};
/*
* Get settings of this index
*
* @param opts an object of options to add
* @param opts.advanced get more settings like nbShards (useful for Enterprise)
* @param callback (optional) the result callback called with two arguments
*  error: null or Error('message')
*  content: the settings object or the error message if a failure occurred
*/


Index.prototype.getSettings = function (opts, callback) {
  if (arguments.length === 1 && typeof opts === 'function') {
    callback = opts;
    opts = {};
  }

  opts = opts || {};
  var indexName = encodeURIComponent(this.indexName);
  return this.as._jsonRequest({
    method: 'GET',
    url: '/1/indexes/' + indexName + '/settings?getVersion=2' + (opts.advanced ? '&advanced=' + opts.advanced : ''),
    hostType: 'read',
    callback: callback
  });
};

Index.prototype.searchSynonyms = function (params, callback) {
  if (typeof params === 'function') {
    callback = params;
    params = {};
  } else if (params === undefined) {
    params = {};
  }

  return this.as._jsonRequest({
    method: 'POST',
    url: '/1/indexes/' + encodeURIComponent(this.indexName) + '/synonyms/search',
    body: params,
    hostType: 'read',
    callback: callback
  });
};

function exportData(method, _hitsPerPage, callback) {
  function search(page, _previous) {
    var options = {
      page: page || 0,
      hitsPerPage: _hitsPerPage || 100
    };
    var previous = _previous || [];
    return method(options).then(function (result) {
      var hits = result.hits;
      var nbHits = result.nbHits;
      var current = hits.map(function (s) {
        delete s._highlightResult;
        return s;
      });
      var synonyms = previous.concat(current);

      if (synonyms.length < nbHits) {
        return search(options.page + 1, synonyms);
      }

      return synonyms;
    });
  }

  return search().then(function (data) {
    if (typeof callback === 'function') {
      callback(data);
      return undefined;
    }

    return data;
  });
}
/**
 * Retrieve all the synonyms in an index
 * @param [number=100] hitsPerPage The amount of synonyms to retrieve per batch
 * @param [function] callback will be called after all synonyms are retrieved
 */


Index.prototype.exportSynonyms = function (hitsPerPage, callback) {
  return exportData(this.searchSynonyms.bind(this), hitsPerPage, callback);
};

Index.prototype.saveSynonym = function (synonym, opts, callback) {
  if (typeof opts === 'function') {
    callback = opts;
    opts = {};
  } else if (opts === undefined) {
    opts = {};
  }

  if (opts.forwardToSlaves !== undefined) deprecateForwardToSlaves();
  var forwardToReplicas = opts.forwardToSlaves || opts.forwardToReplicas ? 'true' : 'false';
  return this.as._jsonRequest({
    method: 'PUT',
    url: '/1/indexes/' + encodeURIComponent(this.indexName) + '/synonyms/' + encodeURIComponent(synonym.objectID) + '?forwardToReplicas=' + forwardToReplicas,
    body: synonym,
    hostType: 'write',
    callback: callback
  });
};

Index.prototype.getSynonym = function (objectID, callback) {
  return this.as._jsonRequest({
    method: 'GET',
    url: '/1/indexes/' + encodeURIComponent(this.indexName) + '/synonyms/' + encodeURIComponent(objectID),
    hostType: 'read',
    callback: callback
  });
};

Index.prototype.deleteSynonym = function (objectID, opts, callback) {
  if (typeof opts === 'function') {
    callback = opts;
    opts = {};
  } else if (opts === undefined) {
    opts = {};
  }

  if (opts.forwardToSlaves !== undefined) deprecateForwardToSlaves();
  var forwardToReplicas = opts.forwardToSlaves || opts.forwardToReplicas ? 'true' : 'false';
  return this.as._jsonRequest({
    method: 'DELETE',
    url: '/1/indexes/' + encodeURIComponent(this.indexName) + '/synonyms/' + encodeURIComponent(objectID) + '?forwardToReplicas=' + forwardToReplicas,
    hostType: 'write',
    callback: callback
  });
};

Index.prototype.clearSynonyms = function (opts, callback) {
  if (typeof opts === 'function') {
    callback = opts;
    opts = {};
  } else if (opts === undefined) {
    opts = {};
  }

  if (opts.forwardToSlaves !== undefined) deprecateForwardToSlaves();
  var forwardToReplicas = opts.forwardToSlaves || opts.forwardToReplicas ? 'true' : 'false';
  return this.as._jsonRequest({
    method: 'POST',
    url: '/1/indexes/' + encodeURIComponent(this.indexName) + '/synonyms/clear' + '?forwardToReplicas=' + forwardToReplicas,
    hostType: 'write',
    callback: callback
  });
};

Index.prototype.batchSynonyms = function (synonyms, opts, callback) {
  if (typeof opts === 'function') {
    callback = opts;
    opts = {};
  } else if (opts === undefined) {
    opts = {};
  }

  if (opts.forwardToSlaves !== undefined) deprecateForwardToSlaves();
  var forwardToReplicas = opts.forwardToSlaves || opts.forwardToReplicas ? 'true' : 'false';
  return this.as._jsonRequest({
    method: 'POST',
    url: '/1/indexes/' + encodeURIComponent(this.indexName) + '/synonyms/batch' + '?forwardToReplicas=' + forwardToReplicas + '&replaceExistingSynonyms=' + (opts.replaceExistingSynonyms ? 'true' : 'false'),
    hostType: 'write',
    body: synonyms,
    callback: callback
  });
};

Index.prototype.searchRules = function (params, callback) {
  if (typeof params === 'function') {
    callback = params;
    params = {};
  } else if (params === undefined) {
    params = {};
  }

  return this.as._jsonRequest({
    method: 'POST',
    url: '/1/indexes/' + encodeURIComponent(this.indexName) + '/rules/search',
    body: params,
    hostType: 'read',
    callback: callback
  });
};
/**
 * Retrieve all the query rules in an index
 * @param [number=100] hitsPerPage The amount of query rules to retrieve per batch
 * @param [function] callback will be called after all query rules are retrieved
 *  error: null or Error('message')
 */


Index.prototype.exportRules = function (hitsPerPage, callback) {
  return exportData(this.searchRules.bind(this), hitsPerPage, callback);
};

Index.prototype.saveRule = function (rule, opts, callback) {
  if (typeof opts === 'function') {
    callback = opts;
    opts = {};
  } else if (opts === undefined) {
    opts = {};
  }

  if (!rule.objectID) {
    throw new errors.AlgoliaSearchError('Missing or empty objectID field for rule');
  }

  var forwardToReplicas = opts.forwardToReplicas === true ? 'true' : 'false';
  return this.as._jsonRequest({
    method: 'PUT',
    url: '/1/indexes/' + encodeURIComponent(this.indexName) + '/rules/' + encodeURIComponent(rule.objectID) + '?forwardToReplicas=' + forwardToReplicas,
    body: rule,
    hostType: 'write',
    callback: callback
  });
};

Index.prototype.getRule = function (objectID, callback) {
  return this.as._jsonRequest({
    method: 'GET',
    url: '/1/indexes/' + encodeURIComponent(this.indexName) + '/rules/' + encodeURIComponent(objectID),
    hostType: 'read',
    callback: callback
  });
};

Index.prototype.deleteRule = function (objectID, opts, callback) {
  if (typeof opts === 'function') {
    callback = opts;
    opts = {};
  } else if (opts === undefined) {
    opts = {};
  }

  var forwardToReplicas = opts.forwardToReplicas === true ? 'true' : 'false';
  return this.as._jsonRequest({
    method: 'DELETE',
    url: '/1/indexes/' + encodeURIComponent(this.indexName) + '/rules/' + encodeURIComponent(objectID) + '?forwardToReplicas=' + forwardToReplicas,
    hostType: 'write',
    callback: callback
  });
};

Index.prototype.clearRules = function (opts, callback) {
  if (typeof opts === 'function') {
    callback = opts;
    opts = {};
  } else if (opts === undefined) {
    opts = {};
  }

  var forwardToReplicas = opts.forwardToReplicas === true ? 'true' : 'false';
  return this.as._jsonRequest({
    method: 'POST',
    url: '/1/indexes/' + encodeURIComponent(this.indexName) + '/rules/clear' + '?forwardToReplicas=' + forwardToReplicas,
    hostType: 'write',
    callback: callback
  });
};

Index.prototype.batchRules = function (rules, opts, callback) {
  if (typeof opts === 'function') {
    callback = opts;
    opts = {};
  } else if (opts === undefined) {
    opts = {};
  }

  var forwardToReplicas = opts.forwardToReplicas === true ? 'true' : 'false';
  return this.as._jsonRequest({
    method: 'POST',
    url: '/1/indexes/' + encodeURIComponent(this.indexName) + '/rules/batch' + '?forwardToReplicas=' + forwardToReplicas + '&clearExistingRules=' + (opts.clearExistingRules === true ? 'true' : 'false'),
    hostType: 'write',
    body: rules,
    callback: callback
  });
};
/*
* Set settings for this index
*
* @param settings the settings object that can contains :
* - minWordSizefor1Typo: (integer) the minimum number of characters to accept one typo (default = 3).
* - minWordSizefor2Typos: (integer) the minimum number of characters to accept two typos (default = 7).
* - hitsPerPage: (integer) the number of hits per page (default = 10).
* - attributesToRetrieve: (array of strings) default list of attributes to retrieve in objects.
*   If set to null, all attributes are retrieved.
* - attributesToHighlight: (array of strings) default list of attributes to highlight.
*   If set to null, all indexed attributes are highlighted.
* - attributesToSnippet**: (array of strings) default list of attributes to snippet alongside the number
* of words to return (syntax is attributeName:nbWords).
*   By default no snippet is computed. If set to null, no snippet is computed.
* - attributesToIndex: (array of strings) the list of fields you want to index.
*   If set to null, all textual and numerical attributes of your objects are indexed,
*   but you should update it to get optimal results.
*   This parameter has two important uses:
*     - Limit the attributes to index: For example if you store a binary image in base64,
*     you want to store it and be able to
*       retrieve it but you don't want to search in the base64 string.
*     - Control part of the ranking*: (see the ranking parameter for full explanation)
*     Matches in attributes at the beginning of
*       the list will be considered more important than matches in attributes further down the list.
*       In one attribute, matching text at the beginning of the attribute will be
*       considered more important than text after, you can disable
*       this behavior if you add your attribute inside `unordered(AttributeName)`,
*       for example attributesToIndex: ["title", "unordered(text)"].
* - attributesForFaceting: (array of strings) The list of fields you want to use for faceting.
*   All strings in the attribute selected for faceting are extracted and added as a facet.
*   If set to null, no attribute is used for faceting.
* - attributeForDistinct: (string) The attribute name used for the Distinct feature.
* This feature is similar to the SQL "distinct" keyword: when enabled
*   in query with the distinct=1 parameter, all hits containing a duplicate
*   value for this attribute are removed from results.
*   For example, if the chosen attribute is show_name and several hits have
*   the same value for show_name, then only the best one is kept and others are removed.
* - ranking: (array of strings) controls the way results are sorted.
*   We have six available criteria:
*    - typo: sort according to number of typos,
*    - geo: sort according to decreassing distance when performing a geo-location based search,
*    - proximity: sort according to the proximity of query words in hits,
*    - attribute: sort according to the order of attributes defined by attributesToIndex,
*    - exact:
*        - if the user query contains one word: sort objects having an attribute
*        that is exactly the query word before others.
*          For example if you search for the "V" TV show, you want to find it
*          with the "V" query and avoid to have all popular TV
*          show starting by the v letter before it.
*        - if the user query contains multiple words: sort according to the
*        number of words that matched exactly (and not as a prefix).
*    - custom: sort according to a user defined formula set in **customRanking** attribute.
*   The standard order is ["typo", "geo", "proximity", "attribute", "exact", "custom"]
* - customRanking: (array of strings) lets you specify part of the ranking.
*   The syntax of this condition is an array of strings containing attributes
*   prefixed by asc (ascending order) or desc (descending order) operator.
*   For example `"customRanking" => ["desc(population)", "asc(name)"]`
* - queryType: Select how the query words are interpreted, it can be one of the following value:
*   - prefixAll: all query words are interpreted as prefixes,
*   - prefixLast: only the last word is interpreted as a prefix (default behavior),
*   - prefixNone: no query word is interpreted as a prefix. This option is not recommended.
* - highlightPreTag: (string) Specify the string that is inserted before
* the highlighted parts in the query result (default to "<em>").
* - highlightPostTag: (string) Specify the string that is inserted after
* the highlighted parts in the query result (default to "</em>").
* - optionalWords: (array of strings) Specify a list of words that should
* be considered as optional when found in the query.
* @param callback (optional) the result callback called with two arguments
*  error: null or Error('message')
*  content: the server answer or the error message if a failure occurred
*/


Index.prototype.setSettings = function (settings, opts, callback) {
  if (arguments.length === 1 || typeof opts === 'function') {
    callback = opts;
    opts = {};
  }

  if (opts.forwardToSlaves !== undefined) deprecateForwardToSlaves();
  var forwardToReplicas = opts.forwardToSlaves || opts.forwardToReplicas ? 'true' : 'false';
  var indexObj = this;
  return this.as._jsonRequest({
    method: 'PUT',
    url: '/1/indexes/' + encodeURIComponent(indexObj.indexName) + '/settings?forwardToReplicas=' + forwardToReplicas,
    hostType: 'write',
    body: settings,
    callback: callback
  });
};
/*
* @deprecated see client.listApiKeys()
*/


Index.prototype.listUserKeys = deprecate(function (callback) {
  return this.listApiKeys(callback);
}, deprecatedMessage('index.listUserKeys()', 'client.listApiKeys()'));
/*
* List all existing API keys to this index
*
* @param callback the result callback called with two arguments
*  error: null or Error('message')
*  content: the server answer with API keys belonging to the index
*
* @deprecated see client.listApiKeys()
*/

Index.prototype.listApiKeys = deprecate(function (callback) {
  var indexObj = this;
  return this.as._jsonRequest({
    method: 'GET',
    url: '/1/indexes/' + encodeURIComponent(indexObj.indexName) + '/keys',
    hostType: 'read',
    callback: callback
  });
}, deprecatedMessage('index.listApiKeys()', 'client.listApiKeys()'));
/*
* @deprecated see client.getApiKey()
*/

Index.prototype.getUserKeyACL = deprecate(function (key, callback) {
  return this.getApiKey(key, callback);
}, deprecatedMessage('index.getUserKeyACL()', 'client.getApiKey()'));
/*
* Get an API key from this index
*
* @param key
* @param callback the result callback called with two arguments
*  error: null or Error('message')
*  content: the server answer with the right API key
*
* @deprecated see client.getApiKey()
*/

Index.prototype.getApiKey = deprecate(function (key, callback) {
  var indexObj = this;
  return this.as._jsonRequest({
    method: 'GET',
    url: '/1/indexes/' + encodeURIComponent(indexObj.indexName) + '/keys/' + key,
    hostType: 'read',
    callback: callback
  });
}, deprecatedMessage('index.getApiKey()', 'client.getApiKey()'));
/*
* @deprecated see client.deleteApiKey()
*/

Index.prototype.deleteUserKey = deprecate(function (key, callback) {
  return this.deleteApiKey(key, callback);
}, deprecatedMessage('index.deleteUserKey()', 'client.deleteApiKey()'));
/*
* Delete an existing API key associated to this index
*
* @param key
* @param callback the result callback called with two arguments
*  error: null or Error('message')
*  content: the server answer with the deletion date
*
* @deprecated see client.deleteApiKey()
*/

Index.prototype.deleteApiKey = deprecate(function (key, callback) {
  var indexObj = this;
  return this.as._jsonRequest({
    method: 'DELETE',
    url: '/1/indexes/' + encodeURIComponent(indexObj.indexName) + '/keys/' + key,
    hostType: 'write',
    callback: callback
  });
}, deprecatedMessage('index.deleteApiKey()', 'client.deleteApiKey()'));
/*
* @deprecated see client.addApiKey()
*/

Index.prototype.addUserKey = deprecate(function (acls, params, callback) {
  return this.addApiKey(acls, params, callback);
}, deprecatedMessage('index.addUserKey()', 'client.addApiKey()'));
/*
* Add a new API key to this index
*
* @param {string[]} acls - The list of ACL for this key. Defined by an array of strings that
*   can contains the following values:
*     - search: allow to search (https and http)
*     - addObject: allows to add/update an object in the index (https only)
*     - deleteObject : allows to delete an existing object (https only)
*     - deleteIndex : allows to delete index content (https only)
*     - settings : allows to get index settings (https only)
*     - editSettings : allows to change index settings (https only)
* @param {Object} [params] - Optionnal parameters to set for the key
* @param {number} params.validity - Number of seconds after which the key will
* be automatically removed (0 means no time limit for this key)
* @param {number} params.maxQueriesPerIPPerHour - Number of API calls allowed from an IP address per hour
* @param {number} params.maxHitsPerQuery - Number of hits this API key can retrieve in one call
* @param {string} params.description - A description for your key
* @param {string[]} params.referers - A list of authorized referers
* @param {Object} params.queryParameters - Force the key to use specific query parameters
* @param {Function} callback - The result callback called with two arguments
*   error: null or Error('message')
*   content: the server answer with the added API key
* @return {Promise|undefined} Returns a promise if no callback given
* @example
* index.addUserKey(['search'], {
*   validity: 300,
*   maxQueriesPerIPPerHour: 2000,
*   maxHitsPerQuery: 3,
*   description: 'Eat three fruits',
*   referers: ['*.algolia.com'],
*   queryParameters: {
*     tagFilters: ['public'],
*   }
* })
* @see {@link https://www.algolia.com/doc/rest_api#AddIndexKey|Algolia REST API Documentation}
*
* @deprecated see client.addApiKey()
*/

Index.prototype.addApiKey = deprecate(function (acls, params, callback) {
  var isArray = require('isarray');

  var usage = 'Usage: index.addApiKey(arrayOfAcls[, params, callback])';

  if (!isArray(acls)) {
    throw new Error(usage);
  }

  if (arguments.length === 1 || typeof params === 'function') {
    callback = params;
    params = null;
  }

  var postObj = {
    acl: acls
  };

  if (params) {
    postObj.validity = params.validity;
    postObj.maxQueriesPerIPPerHour = params.maxQueriesPerIPPerHour;
    postObj.maxHitsPerQuery = params.maxHitsPerQuery;
    postObj.description = params.description;

    if (params.queryParameters) {
      postObj.queryParameters = this.as._getSearchParams(params.queryParameters, '');
    }

    postObj.referers = params.referers;
  }

  return this.as._jsonRequest({
    method: 'POST',
    url: '/1/indexes/' + encodeURIComponent(this.indexName) + '/keys',
    body: postObj,
    hostType: 'write',
    callback: callback
  });
}, deprecatedMessage('index.addApiKey()', 'client.addApiKey()'));
/**
* @deprecated use client.addApiKey()
*/

Index.prototype.addUserKeyWithValidity = deprecate(function deprecatedAddUserKeyWithValidity(acls, params, callback) {
  return this.addApiKey(acls, params, callback);
}, deprecatedMessage('index.addUserKeyWithValidity()', 'client.addApiKey()'));
/*
* @deprecated see client.updateApiKey()
*/

Index.prototype.updateUserKey = deprecate(function (key, acls, params, callback) {
  return this.updateApiKey(key, acls, params, callback);
}, deprecatedMessage('index.updateUserKey()', 'client.updateApiKey()'));
/**
* Update an existing API key of this index
* @param {string} key - The key to update
* @param {string[]} acls - The list of ACL for this key. Defined by an array of strings that
*   can contains the following values:
*     - search: allow to search (https and http)
*     - addObject: allows to add/update an object in the index (https only)
*     - deleteObject : allows to delete an existing object (https only)
*     - deleteIndex : allows to delete index content (https only)
*     - settings : allows to get index settings (https only)
*     - editSettings : allows to change index settings (https only)
* @param {Object} [params] - Optionnal parameters to set for the key
* @param {number} params.validity - Number of seconds after which the key will
* be automatically removed (0 means no time limit for this key)
* @param {number} params.maxQueriesPerIPPerHour - Number of API calls allowed from an IP address per hour
* @param {number} params.maxHitsPerQuery - Number of hits this API key can retrieve in one call
* @param {string} params.description - A description for your key
* @param {string[]} params.referers - A list of authorized referers
* @param {Object} params.queryParameters - Force the key to use specific query parameters
* @param {Function} callback - The result callback called with two arguments
*   error: null or Error('message')
*   content: the server answer with user keys list
* @return {Promise|undefined} Returns a promise if no callback given
* @example
* index.updateApiKey('APIKEY', ['search'], {
*   validity: 300,
*   maxQueriesPerIPPerHour: 2000,
*   maxHitsPerQuery: 3,
*   description: 'Eat three fruits',
*   referers: ['*.algolia.com'],
*   queryParameters: {
*     tagFilters: ['public'],
*   }
* })
* @see {@link https://www.algolia.com/doc/rest_api#UpdateIndexKey|Algolia REST API Documentation}
*
* @deprecated see client.updateApiKey()
*/

Index.prototype.updateApiKey = deprecate(function (key, acls, params, callback) {
  var isArray = require('isarray');

  var usage = 'Usage: index.updateApiKey(key, arrayOfAcls[, params, callback])';

  if (!isArray(acls)) {
    throw new Error(usage);
  }

  if (arguments.length === 2 || typeof params === 'function') {
    callback = params;
    params = null;
  }

  var putObj = {
    acl: acls
  };

  if (params) {
    putObj.validity = params.validity;
    putObj.maxQueriesPerIPPerHour = params.maxQueriesPerIPPerHour;
    putObj.maxHitsPerQuery = params.maxHitsPerQuery;
    putObj.description = params.description;

    if (params.queryParameters) {
      putObj.queryParameters = this.as._getSearchParams(params.queryParameters, '');
    }

    putObj.referers = params.referers;
  }

  return this.as._jsonRequest({
    method: 'PUT',
    url: '/1/indexes/' + encodeURIComponent(this.indexName) + '/keys/' + key,
    body: putObj,
    hostType: 'write',
    callback: callback
  });
}, deprecatedMessage('index.updateApiKey()', 'client.updateApiKey()'));
},{"inherits":"../node_modules/inherits/inherits_browser.js","./IndexCore.js":"../node_modules/algoliasearch/src/IndexCore.js","./deprecate.js":"../node_modules/algoliasearch/src/deprecate.js","./deprecatedMessage.js":"../node_modules/algoliasearch/src/deprecatedMessage.js","./exitPromise.js":"../node_modules/algoliasearch/src/exitPromise.js","./errors":"../node_modules/algoliasearch/src/errors.js","isarray":"../node_modules/isarray/index.js","./map.js":"../node_modules/algoliasearch/src/map.js","./clone.js":"../node_modules/algoliasearch/src/clone.js","./merge.js":"../node_modules/algoliasearch/src/merge.js","./IndexBrowser":"../node_modules/algoliasearch/src/IndexBrowser.js"}],"../node_modules/ms/index.js":[function(require,module,exports) {
/**
 * Helpers.
 */

var s = 1000;
var m = s * 60;
var h = m * 60;
var d = h * 24;
var y = d * 365.25;

/**
 * Parse or format the given `val`.
 *
 * Options:
 *
 *  - `long` verbose formatting [false]
 *
 * @param {String|Number} val
 * @param {Object} [options]
 * @throws {Error} throw an error if val is not a non-empty string or a number
 * @return {String|Number}
 * @api public
 */

module.exports = function(val, options) {
  options = options || {};
  var type = typeof val;
  if (type === 'string' && val.length > 0) {
    return parse(val);
  } else if (type === 'number' && isNaN(val) === false) {
    return options.long ? fmtLong(val) : fmtShort(val);
  }
  throw new Error(
    'val is not a non-empty string or a valid number. val=' +
      JSON.stringify(val)
  );
};

/**
 * Parse the given `str` and return milliseconds.
 *
 * @param {String} str
 * @return {Number}
 * @api private
 */

function parse(str) {
  str = String(str);
  if (str.length > 100) {
    return;
  }
  var match = /^((?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|years?|yrs?|y)?$/i.exec(
    str
  );
  if (!match) {
    return;
  }
  var n = parseFloat(match[1]);
  var type = (match[2] || 'ms').toLowerCase();
  switch (type) {
    case 'years':
    case 'year':
    case 'yrs':
    case 'yr':
    case 'y':
      return n * y;
    case 'days':
    case 'day':
    case 'd':
      return n * d;
    case 'hours':
    case 'hour':
    case 'hrs':
    case 'hr':
    case 'h':
      return n * h;
    case 'minutes':
    case 'minute':
    case 'mins':
    case 'min':
    case 'm':
      return n * m;
    case 'seconds':
    case 'second':
    case 'secs':
    case 'sec':
    case 's':
      return n * s;
    case 'milliseconds':
    case 'millisecond':
    case 'msecs':
    case 'msec':
    case 'ms':
      return n;
    default:
      return undefined;
  }
}

/**
 * Short format for `ms`.
 *
 * @param {Number} ms
 * @return {String}
 * @api private
 */

function fmtShort(ms) {
  if (ms >= d) {
    return Math.round(ms / d) + 'd';
  }
  if (ms >= h) {
    return Math.round(ms / h) + 'h';
  }
  if (ms >= m) {
    return Math.round(ms / m) + 'm';
  }
  if (ms >= s) {
    return Math.round(ms / s) + 's';
  }
  return ms + 'ms';
}

/**
 * Long format for `ms`.
 *
 * @param {Number} ms
 * @return {String}
 * @api private
 */

function fmtLong(ms) {
  return plural(ms, d, 'day') ||
    plural(ms, h, 'hour') ||
    plural(ms, m, 'minute') ||
    plural(ms, s, 'second') ||
    ms + ' ms';
}

/**
 * Pluralization helper.
 */

function plural(ms, n, name) {
  if (ms < n) {
    return;
  }
  if (ms < n * 1.5) {
    return Math.floor(ms / n) + ' ' + name;
  }
  return Math.ceil(ms / n) + ' ' + name + 's';
}

},{}],"../node_modules/debug/src/debug.js":[function(require,module,exports) {

/**
 * This is the common logic for both the Node.js and web browser
 * implementations of `debug()`.
 *
 * Expose `debug()` as the module.
 */

exports = module.exports = createDebug.debug = createDebug['default'] = createDebug;
exports.coerce = coerce;
exports.disable = disable;
exports.enable = enable;
exports.enabled = enabled;
exports.humanize = require('ms');

/**
 * The currently active debug mode names, and names to skip.
 */

exports.names = [];
exports.skips = [];

/**
 * Map of special "%n" handling functions, for the debug "format" argument.
 *
 * Valid key names are a single, lower or upper-case letter, i.e. "n" and "N".
 */

exports.formatters = {};

/**
 * Previous log timestamp.
 */

var prevTime;

/**
 * Select a color.
 * @param {String} namespace
 * @return {Number}
 * @api private
 */

function selectColor(namespace) {
  var hash = 0, i;

  for (i in namespace) {
    hash  = ((hash << 5) - hash) + namespace.charCodeAt(i);
    hash |= 0; // Convert to 32bit integer
  }

  return exports.colors[Math.abs(hash) % exports.colors.length];
}

/**
 * Create a debugger with the given `namespace`.
 *
 * @param {String} namespace
 * @return {Function}
 * @api public
 */

function createDebug(namespace) {

  function debug() {
    // disabled?
    if (!debug.enabled) return;

    var self = debug;

    // set `diff` timestamp
    var curr = +new Date();
    var ms = curr - (prevTime || curr);
    self.diff = ms;
    self.prev = prevTime;
    self.curr = curr;
    prevTime = curr;

    // turn the `arguments` into a proper Array
    var args = new Array(arguments.length);
    for (var i = 0; i < args.length; i++) {
      args[i] = arguments[i];
    }

    args[0] = exports.coerce(args[0]);

    if ('string' !== typeof args[0]) {
      // anything else let's inspect with %O
      args.unshift('%O');
    }

    // apply any `formatters` transformations
    var index = 0;
    args[0] = args[0].replace(/%([a-zA-Z%])/g, function(match, format) {
      // if we encounter an escaped % then don't increase the array index
      if (match === '%%') return match;
      index++;
      var formatter = exports.formatters[format];
      if ('function' === typeof formatter) {
        var val = args[index];
        match = formatter.call(self, val);

        // now we need to remove `args[index]` since it's inlined in the `format`
        args.splice(index, 1);
        index--;
      }
      return match;
    });

    // apply env-specific formatting (colors, etc.)
    exports.formatArgs.call(self, args);

    var logFn = debug.log || exports.log || console.log.bind(console);
    logFn.apply(self, args);
  }

  debug.namespace = namespace;
  debug.enabled = exports.enabled(namespace);
  debug.useColors = exports.useColors();
  debug.color = selectColor(namespace);

  // env-specific initialization logic for debug instances
  if ('function' === typeof exports.init) {
    exports.init(debug);
  }

  return debug;
}

/**
 * Enables a debug mode by namespaces. This can include modes
 * separated by a colon and wildcards.
 *
 * @param {String} namespaces
 * @api public
 */

function enable(namespaces) {
  exports.save(namespaces);

  exports.names = [];
  exports.skips = [];

  var split = (typeof namespaces === 'string' ? namespaces : '').split(/[\s,]+/);
  var len = split.length;

  for (var i = 0; i < len; i++) {
    if (!split[i]) continue; // ignore empty strings
    namespaces = split[i].replace(/\*/g, '.*?');
    if (namespaces[0] === '-') {
      exports.skips.push(new RegExp('^' + namespaces.substr(1) + '$'));
    } else {
      exports.names.push(new RegExp('^' + namespaces + '$'));
    }
  }
}

/**
 * Disable debug output.
 *
 * @api public
 */

function disable() {
  exports.enable('');
}

/**
 * Returns true if the given mode name is enabled, false otherwise.
 *
 * @param {String} name
 * @return {Boolean}
 * @api public
 */

function enabled(name) {
  var i, len;
  for (i = 0, len = exports.skips.length; i < len; i++) {
    if (exports.skips[i].test(name)) {
      return false;
    }
  }
  for (i = 0, len = exports.names.length; i < len; i++) {
    if (exports.names[i].test(name)) {
      return true;
    }
  }
  return false;
}

/**
 * Coerce `val`.
 *
 * @param {Mixed} val
 * @return {Mixed}
 * @api private
 */

function coerce(val) {
  if (val instanceof Error) return val.stack || val.message;
  return val;
}

},{"ms":"../node_modules/ms/index.js"}],"../../../../.nvm/versions/node/v10.15.3/lib/node_modules/parcel-bundler/node_modules/process/browser.js":[function(require,module,exports) {

// shim for using process in browser
var process = module.exports = {}; // cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
  throw new Error('setTimeout has not been defined');
}

function defaultClearTimeout() {
  throw new Error('clearTimeout has not been defined');
}

(function () {
  try {
    if (typeof setTimeout === 'function') {
      cachedSetTimeout = setTimeout;
    } else {
      cachedSetTimeout = defaultSetTimout;
    }
  } catch (e) {
    cachedSetTimeout = defaultSetTimout;
  }

  try {
    if (typeof clearTimeout === 'function') {
      cachedClearTimeout = clearTimeout;
    } else {
      cachedClearTimeout = defaultClearTimeout;
    }
  } catch (e) {
    cachedClearTimeout = defaultClearTimeout;
  }
})();

function runTimeout(fun) {
  if (cachedSetTimeout === setTimeout) {
    //normal enviroments in sane situations
    return setTimeout(fun, 0);
  } // if setTimeout wasn't available but was latter defined


  if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
    cachedSetTimeout = setTimeout;
    return setTimeout(fun, 0);
  }

  try {
    // when when somebody has screwed with setTimeout but no I.E. maddness
    return cachedSetTimeout(fun, 0);
  } catch (e) {
    try {
      // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
      return cachedSetTimeout.call(null, fun, 0);
    } catch (e) {
      // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
      return cachedSetTimeout.call(this, fun, 0);
    }
  }
}

function runClearTimeout(marker) {
  if (cachedClearTimeout === clearTimeout) {
    //normal enviroments in sane situations
    return clearTimeout(marker);
  } // if clearTimeout wasn't available but was latter defined


  if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
    cachedClearTimeout = clearTimeout;
    return clearTimeout(marker);
  }

  try {
    // when when somebody has screwed with setTimeout but no I.E. maddness
    return cachedClearTimeout(marker);
  } catch (e) {
    try {
      // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
      return cachedClearTimeout.call(null, marker);
    } catch (e) {
      // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
      // Some versions of I.E. have different rules for clearTimeout vs setTimeout
      return cachedClearTimeout.call(this, marker);
    }
  }
}

var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
  if (!draining || !currentQueue) {
    return;
  }

  draining = false;

  if (currentQueue.length) {
    queue = currentQueue.concat(queue);
  } else {
    queueIndex = -1;
  }

  if (queue.length) {
    drainQueue();
  }
}

function drainQueue() {
  if (draining) {
    return;
  }

  var timeout = runTimeout(cleanUpNextTick);
  draining = true;
  var len = queue.length;

  while (len) {
    currentQueue = queue;
    queue = [];

    while (++queueIndex < len) {
      if (currentQueue) {
        currentQueue[queueIndex].run();
      }
    }

    queueIndex = -1;
    len = queue.length;
  }

  currentQueue = null;
  draining = false;
  runClearTimeout(timeout);
}

process.nextTick = function (fun) {
  var args = new Array(arguments.length - 1);

  if (arguments.length > 1) {
    for (var i = 1; i < arguments.length; i++) {
      args[i - 1] = arguments[i];
    }
  }

  queue.push(new Item(fun, args));

  if (queue.length === 1 && !draining) {
    runTimeout(drainQueue);
  }
}; // v8 likes predictible objects


function Item(fun, array) {
  this.fun = fun;
  this.array = array;
}

Item.prototype.run = function () {
  this.fun.apply(null, this.array);
};

process.title = 'browser';
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues

process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) {
  return [];
};

process.binding = function (name) {
  throw new Error('process.binding is not supported');
};

process.cwd = function () {
  return '/';
};

process.chdir = function (dir) {
  throw new Error('process.chdir is not supported');
};

process.umask = function () {
  return 0;
};
},{}],"../node_modules/debug/src/browser.js":[function(require,module,exports) {
var process = require("process");
/**
 * This is the web browser implementation of `debug()`.
 *
 * Expose `debug()` as the module.
 */
exports = module.exports = require('./debug');
exports.log = log;
exports.formatArgs = formatArgs;
exports.save = save;
exports.load = load;
exports.useColors = useColors;
exports.storage = 'undefined' != typeof chrome && 'undefined' != typeof chrome.storage ? chrome.storage.local : localstorage();
/**
 * Colors.
 */

exports.colors = ['lightseagreen', 'forestgreen', 'goldenrod', 'dodgerblue', 'darkorchid', 'crimson'];
/**
 * Currently only WebKit-based Web Inspectors, Firefox >= v31,
 * and the Firebug extension (any Firefox version) are known
 * to support "%c" CSS customizations.
 *
 * TODO: add a `localStorage` variable to explicitly enable/disable colors
 */

function useColors() {
  // NB: In an Electron preload script, document will be defined but not fully
  // initialized. Since we know we're in Chrome, we'll just detect this case
  // explicitly
  if (typeof window !== 'undefined' && window.process && window.process.type === 'renderer') {
    return true;
  } // is webkit? http://stackoverflow.com/a/16459606/376773
  // document is undefined in react-native: https://github.com/facebook/react-native/pull/1632


  return typeof document !== 'undefined' && document.documentElement && document.documentElement.style && document.documentElement.style.WebkitAppearance || // is firebug? http://stackoverflow.com/a/398120/376773
  typeof window !== 'undefined' && window.console && (window.console.firebug || window.console.exception && window.console.table) || // is firefox >= v31?
  // https://developer.mozilla.org/en-US/docs/Tools/Web_Console#Styling_messages
  typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/) && parseInt(RegExp.$1, 10) >= 31 || // double check webkit in userAgent just in case we are in a worker
  typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/);
}
/**
 * Map %j to `JSON.stringify()`, since no Web Inspectors do that by default.
 */


exports.formatters.j = function (v) {
  try {
    return JSON.stringify(v);
  } catch (err) {
    return '[UnexpectedJSONParseError]: ' + err.message;
  }
};
/**
 * Colorize log arguments if enabled.
 *
 * @api public
 */


function formatArgs(args) {
  var useColors = this.useColors;
  args[0] = (useColors ? '%c' : '') + this.namespace + (useColors ? ' %c' : ' ') + args[0] + (useColors ? '%c ' : ' ') + '+' + exports.humanize(this.diff);
  if (!useColors) return;
  var c = 'color: ' + this.color;
  args.splice(1, 0, c, 'color: inherit'); // the final "%c" is somewhat tricky, because there could be other
  // arguments passed either before or after the %c, so we need to
  // figure out the correct index to insert the CSS into

  var index = 0;
  var lastC = 0;
  args[0].replace(/%[a-zA-Z%]/g, function (match) {
    if ('%%' === match) return;
    index++;

    if ('%c' === match) {
      // we only are interested in the *last* %c
      // (the user may have provided their own)
      lastC = index;
    }
  });
  args.splice(lastC, 0, c);
}
/**
 * Invokes `console.log()` when available.
 * No-op when `console.log` is not a "function".
 *
 * @api public
 */


function log() {
  // this hackery is required for IE8/9, where
  // the `console.log` function doesn't have 'apply'
  return 'object' === typeof console && console.log && Function.prototype.apply.call(console.log, console, arguments);
}
/**
 * Save `namespaces`.
 *
 * @param {String} namespaces
 * @api private
 */


function save(namespaces) {
  try {
    if (null == namespaces) {
      exports.storage.removeItem('debug');
    } else {
      exports.storage.debug = namespaces;
    }
  } catch (e) {}
}
/**
 * Load `namespaces`.
 *
 * @return {String} returns the previously persisted debug modes
 * @api private
 */


function load() {
  var r;

  try {
    r = exports.storage.debug;
  } catch (e) {} // If debug isn't set in LS, and we're in Electron, try to load $DEBUG


  if (!r && typeof process !== 'undefined' && 'env' in process) {
    r = undefined;
  }

  return r;
}
/**
 * Enable namespaces listed in `localStorage.debug` initially.
 */


exports.enable(load());
/**
 * Localstorage attempts to return the localstorage.
 *
 * This is necessary because safari throws
 * when a user disables cookies/localstorage
 * and you attempt to access it.
 *
 * @return {LocalStorage}
 * @api private
 */

function localstorage() {
  try {
    return window.localStorage;
  } catch (e) {}
}
},{"./debug":"../node_modules/debug/src/debug.js","process":"../../../../.nvm/versions/node/v10.15.3/lib/node_modules/parcel-bundler/node_modules/process/browser.js"}],"../node_modules/algoliasearch/src/store.js":[function(require,module,exports) {
var global = arguments[3];
var debug = require('debug')('algoliasearch:src/hostIndexState.js');

var localStorageNamespace = 'algoliasearch-client-js';
var store;
var moduleStore = {
  state: {},
  set: function (key, data) {
    this.state[key] = data;
    return this.state[key];
  },
  get: function (key) {
    return this.state[key] || null;
  }
};
var localStorageStore = {
  set: function (key, data) {
    moduleStore.set(key, data); // always replicate localStorageStore to moduleStore in case of failure

    try {
      var namespace = JSON.parse(global.localStorage[localStorageNamespace]);
      namespace[key] = data;
      global.localStorage[localStorageNamespace] = JSON.stringify(namespace);
      return namespace[key];
    } catch (e) {
      return localStorageFailure(key, e);
    }
  },
  get: function (key) {
    try {
      return JSON.parse(global.localStorage[localStorageNamespace])[key] || null;
    } catch (e) {
      return localStorageFailure(key, e);
    }
  }
};

function localStorageFailure(key, e) {
  debug('localStorage failed with', e);
  cleanup();
  store = moduleStore;
  return store.get(key);
}

store = supportsLocalStorage() ? localStorageStore : moduleStore;
module.exports = {
  get: getOrSet,
  set: getOrSet,
  supportsLocalStorage: supportsLocalStorage
};

function getOrSet(key, data) {
  if (arguments.length === 1) {
    return store.get(key);
  }

  return store.set(key, data);
}

function supportsLocalStorage() {
  try {
    if ('localStorage' in global && global.localStorage !== null) {
      if (!global.localStorage[localStorageNamespace]) {
        // actual creation of the namespace
        global.localStorage.setItem(localStorageNamespace, JSON.stringify({}));
      }

      return true;
    }

    return false;
  } catch (_) {
    return false;
  }
} // In case of any error on localStorage, we clean our own namespace, this should handle
// quota errors when a lot of keys + data are used


function cleanup() {
  try {
    global.localStorage.removeItem(localStorageNamespace);
  } catch (_) {// nothing to do
  }
}
},{"debug":"../node_modules/debug/src/browser.js"}],"../node_modules/algoliasearch/src/AlgoliaSearchCore.js":[function(require,module,exports) {
module.exports = AlgoliaSearchCore;

var errors = require('./errors');

var exitPromise = require('./exitPromise.js');

var IndexCore = require('./IndexCore.js');

var store = require('./store.js'); // We will always put the API KEY in the JSON body in case of too long API KEY,
// to avoid query string being too long and failing in various conditions (our server limit, browser limit,
// proxies limit)


var MAX_API_KEY_LENGTH = 500;
var RESET_APP_DATA_TIMER = undefined && parseInt(undefined, 10) || 60 * 2 * 1000; // after 2 minutes reset to first host

/*
 * Algolia Search library initialization
 * https://www.algolia.com/
 *
 * @param {string} applicationID - Your applicationID, found in your dashboard
 * @param {string} apiKey - Your API key, found in your dashboard
 * @param {Object} [opts]
 * @param {number} [opts.timeout=2000] - The request timeout set in milliseconds,
 * another request will be issued after this timeout
 * @param {string} [opts.protocol='https:'] - The protocol used to query Algolia Search API.
 *                                        Set to 'http:' to force using http.
 * @param {Object|Array} [opts.hosts={
 *           read: [this.applicationID + '-dsn.algolia.net'].concat([
 *             this.applicationID + '-1.algolianet.com',
 *             this.applicationID + '-2.algolianet.com',
 *             this.applicationID + '-3.algolianet.com']
 *           ]),
 *           write: [this.applicationID + '.algolia.net'].concat([
 *             this.applicationID + '-1.algolianet.com',
 *             this.applicationID + '-2.algolianet.com',
 *             this.applicationID + '-3.algolianet.com']
 *           ]) - The hosts to use for Algolia Search API.
 *           If you provide them, you will less benefit from our HA implementation
 */

function AlgoliaSearchCore(applicationID, apiKey, opts) {
  var debug = require('debug')('algoliasearch');

  var clone = require('./clone.js');

  var isArray = require('isarray');

  var map = require('./map.js');

  var usage = 'Usage: algoliasearch(applicationID, apiKey, opts)';

  if (opts._allowEmptyCredentials !== true && !applicationID) {
    throw new errors.AlgoliaSearchError('Please provide an application ID. ' + usage);
  }

  if (opts._allowEmptyCredentials !== true && !apiKey) {
    throw new errors.AlgoliaSearchError('Please provide an API key. ' + usage);
  }

  this.applicationID = applicationID;
  this.apiKey = apiKey;
  this.hosts = {
    read: [],
    write: []
  };
  opts = opts || {};
  this._timeouts = opts.timeouts || {
    connect: 1 * 1000,
    // 500ms connect is GPRS latency
    read: 2 * 1000,
    write: 30 * 1000
  }; // backward compat, if opts.timeout is passed, we use it to configure all timeouts like before

  if (opts.timeout) {
    this._timeouts.connect = this._timeouts.read = this._timeouts.write = opts.timeout;
  }

  var protocol = opts.protocol || 'https:'; // while we advocate for colon-at-the-end values: 'http:' for `opts.protocol`
  // we also accept `http` and `https`. It's a common error.

  if (!/:$/.test(protocol)) {
    protocol = protocol + ':';
  }

  if (protocol !== 'http:' && protocol !== 'https:') {
    throw new errors.AlgoliaSearchError('protocol must be `http:` or `https:` (was `' + opts.protocol + '`)');
  }

  this._checkAppIdData();

  if (!opts.hosts) {
    var defaultHosts = map(this._shuffleResult, function (hostNumber) {
      return applicationID + '-' + hostNumber + '.algolianet.com';
    }); // no hosts given, compute defaults

    var mainSuffix = (opts.dsn === false ? '' : '-dsn') + '.algolia.net';
    this.hosts.read = [this.applicationID + mainSuffix].concat(defaultHosts);
    this.hosts.write = [this.applicationID + '.algolia.net'].concat(defaultHosts);
  } else if (isArray(opts.hosts)) {
    // when passing custom hosts, we need to have a different host index if the number
    // of write/read hosts are different.
    this.hosts.read = clone(opts.hosts);
    this.hosts.write = clone(opts.hosts);
  } else {
    this.hosts.read = clone(opts.hosts.read);
    this.hosts.write = clone(opts.hosts.write);
  } // add protocol and lowercase hosts


  this.hosts.read = map(this.hosts.read, prepareHost(protocol));
  this.hosts.write = map(this.hosts.write, prepareHost(protocol));
  this.extraHeaders = {}; // In some situations you might want to warm the cache

  this.cache = opts._cache || {};
  this._ua = opts._ua;
  this._useCache = opts._useCache === undefined || opts._cache ? true : opts._useCache;
  this._useRequestCache = this._useCache && opts._useRequestCache;
  this._useFallback = opts.useFallback === undefined ? true : opts.useFallback;
  this._setTimeout = opts._setTimeout;
  debug('init done, %j', this);
}
/*
 * Get the index object initialized
 *
 * @param indexName the name of index
 * @param callback the result callback with one argument (the Index instance)
 */


AlgoliaSearchCore.prototype.initIndex = function (indexName) {
  return new IndexCore(this, indexName);
};
/**
* Add an extra field to the HTTP request
*
* @param name the header field name
* @param value the header field value
*/


AlgoliaSearchCore.prototype.setExtraHeader = function (name, value) {
  this.extraHeaders[name.toLowerCase()] = value;
};
/**
* Get the value of an extra HTTP header
*
* @param name the header field name
*/


AlgoliaSearchCore.prototype.getExtraHeader = function (name) {
  return this.extraHeaders[name.toLowerCase()];
};
/**
* Remove an extra field from the HTTP request
*
* @param name the header field name
*/


AlgoliaSearchCore.prototype.unsetExtraHeader = function (name) {
  delete this.extraHeaders[name.toLowerCase()];
};
/**
* Augment sent x-algolia-agent with more data, each agent part
* is automatically separated from the others by a semicolon;
*
* @param algoliaAgent the agent to add
*/


AlgoliaSearchCore.prototype.addAlgoliaAgent = function (algoliaAgent) {
  var algoliaAgentWithDelimiter = '; ' + algoliaAgent;

  if (this._ua.indexOf(algoliaAgentWithDelimiter) === -1) {
    this._ua += algoliaAgentWithDelimiter;
  }
};
/*
 * Wrapper that try all hosts to maximize the quality of service
 */


AlgoliaSearchCore.prototype._jsonRequest = function (initialOpts) {
  this._checkAppIdData();

  var requestDebug = require('debug')('algoliasearch:' + initialOpts.url);

  var body;
  var cacheID;
  var additionalUA = initialOpts.additionalUA || '';
  var cache = initialOpts.cache;
  var client = this;
  var tries = 0;
  var usingFallback = false;
  var hasFallback = client._useFallback && client._request.fallback && initialOpts.fallback;
  var headers;

  if (this.apiKey.length > MAX_API_KEY_LENGTH && initialOpts.body !== undefined && (initialOpts.body.params !== undefined || // index.search()
  initialOpts.body.requests !== undefined) // client.search()
  ) {
      initialOpts.body.apiKey = this.apiKey;
      headers = this._computeRequestHeaders({
        additionalUA: additionalUA,
        withApiKey: false,
        headers: initialOpts.headers
      });
    } else {
    headers = this._computeRequestHeaders({
      additionalUA: additionalUA,
      headers: initialOpts.headers
    });
  }

  if (initialOpts.body !== undefined) {
    body = safeJSONStringify(initialOpts.body);
  }

  requestDebug('request start');
  var debugData = [];

  function doRequest(requester, reqOpts) {
    client._checkAppIdData();

    var startTime = new Date();

    if (client._useCache && !client._useRequestCache) {
      cacheID = initialOpts.url;
    } // as we sometime use POST requests to pass parameters (like query='aa'),
    // the cacheID must also include the body to be different between calls


    if (client._useCache && !client._useRequestCache && body) {
      cacheID += '_body_' + reqOpts.body;
    } // handle cache existence


    if (isCacheValidWithCurrentID(!client._useRequestCache, cache, cacheID)) {
      requestDebug('serving response from cache');
      var responseText = cache[cacheID]; // Cache response must match the type of the original one

      return client._promise.resolve({
        body: JSON.parse(responseText),
        responseText: responseText
      });
    } // if we reached max tries


    if (tries >= client.hosts[initialOpts.hostType].length) {
      if (!hasFallback || usingFallback) {
        requestDebug('could not get any response'); // then stop

        return client._promise.reject(new errors.AlgoliaSearchError('Cannot connect to the AlgoliaSearch API.' + ' Send an email to support@algolia.com to report and resolve the issue.' + ' Application id was: ' + client.applicationID, {
          debugData: debugData
        }));
      }

      requestDebug('switching to fallback'); // let's try the fallback starting from here

      tries = 0; // method, url and body are fallback dependent

      reqOpts.method = initialOpts.fallback.method;
      reqOpts.url = initialOpts.fallback.url;
      reqOpts.jsonBody = initialOpts.fallback.body;

      if (reqOpts.jsonBody) {
        reqOpts.body = safeJSONStringify(reqOpts.jsonBody);
      } // re-compute headers, they could be omitting the API KEY


      headers = client._computeRequestHeaders({
        additionalUA: additionalUA,
        headers: initialOpts.headers
      });
      reqOpts.timeouts = client._getTimeoutsForRequest(initialOpts.hostType);

      client._setHostIndexByType(0, initialOpts.hostType);

      usingFallback = true; // the current request is now using fallback

      return doRequest(client._request.fallback, reqOpts);
    }

    var currentHost = client._getHostByType(initialOpts.hostType);

    var url = currentHost + reqOpts.url;
    var options = {
      body: reqOpts.body,
      jsonBody: reqOpts.jsonBody,
      method: reqOpts.method,
      headers: headers,
      timeouts: reqOpts.timeouts,
      debug: requestDebug,
      forceAuthHeaders: reqOpts.forceAuthHeaders
    };
    requestDebug('method: %s, url: %s, headers: %j, timeouts: %d', options.method, url, options.headers, options.timeouts);

    if (requester === client._request.fallback) {
      requestDebug('using fallback');
    } // `requester` is any of this._request or this._request.fallback
    // thus it needs to be called using the client as context


    return requester.call(client, url, options).then(success, tryFallback);

    function success(httpResponse) {
      // compute the status of the response,
      //
      // When in browser mode, using XDR or JSONP, we have no statusCode available
      // So we rely on our API response `status` property.
      // But `waitTask` can set a `status` property which is not the statusCode (it's the task status)
      // So we check if there's a `message` along `status` and it means it's an error
      //
      // That's the only case where we have a response.status that's not the http statusCode
      var status = httpResponse && httpResponse.body && httpResponse.body.message && httpResponse.body.status || // this is important to check the request statusCode AFTER the body eventual
      // statusCode because some implementations (jQuery XDomainRequest transport) may
      // send statusCode 200 while we had an error
      httpResponse.statusCode || // When in browser mode, using XDR or JSONP
      // we default to success when no error (no response.status && response.message)
      // If there was a JSON.parse() error then body is null and it fails
      httpResponse && httpResponse.body && 200;
      requestDebug('received response: statusCode: %s, computed statusCode: %d, headers: %j', httpResponse.statusCode, status, httpResponse.headers);
      var httpResponseOk = Math.floor(status / 100) === 2;
      var endTime = new Date();
      debugData.push({
        currentHost: currentHost,
        headers: removeCredentials(headers),
        content: body || null,
        contentLength: body !== undefined ? body.length : null,
        method: reqOpts.method,
        timeouts: reqOpts.timeouts,
        url: reqOpts.url,
        startTime: startTime,
        endTime: endTime,
        duration: endTime - startTime,
        statusCode: status
      });

      if (httpResponseOk) {
        if (client._useCache && !client._useRequestCache && cache) {
          cache[cacheID] = httpResponse.responseText;
        }

        return {
          responseText: httpResponse.responseText,
          body: httpResponse.body
        };
      }

      var shouldRetry = Math.floor(status / 100) !== 4;

      if (shouldRetry) {
        tries += 1;
        return retryRequest();
      }

      requestDebug('unrecoverable error'); // no success and no retry => fail

      var unrecoverableError = new errors.AlgoliaSearchError(httpResponse.body && httpResponse.body.message, {
        debugData: debugData,
        statusCode: status
      });
      return client._promise.reject(unrecoverableError);
    }

    function tryFallback(err) {
      // error cases:
      //  While not in fallback mode:
      //    - CORS not supported
      //    - network error
      //  While in fallback mode:
      //    - timeout
      //    - network error
      //    - badly formatted JSONP (script loaded, did not call our callback)
      //  In both cases:
      //    - uncaught exception occurs (TypeError)
      requestDebug('error: %s, stack: %s', err.message, err.stack);
      var endTime = new Date();
      debugData.push({
        currentHost: currentHost,
        headers: removeCredentials(headers),
        content: body || null,
        contentLength: body !== undefined ? body.length : null,
        method: reqOpts.method,
        timeouts: reqOpts.timeouts,
        url: reqOpts.url,
        startTime: startTime,
        endTime: endTime,
        duration: endTime - startTime
      });

      if (!(err instanceof errors.AlgoliaSearchError)) {
        err = new errors.Unknown(err && err.message, err);
      }

      tries += 1; // stop the request implementation when:

      if ( // we did not generate this error,
      // it comes from a throw in some other piece of code
      err instanceof errors.Unknown || // server sent unparsable JSON
      err instanceof errors.UnparsableJSON || // max tries and already using fallback or no fallback
      tries >= client.hosts[initialOpts.hostType].length && (usingFallback || !hasFallback)) {
        // stop request implementation for this command
        err.debugData = debugData;
        return client._promise.reject(err);
      } // When a timeout occurred, retry by raising timeout


      if (err instanceof errors.RequestTimeout) {
        return retryRequestWithHigherTimeout();
      }

      return retryRequest();
    }

    function retryRequest() {
      requestDebug('retrying request');

      client._incrementHostIndex(initialOpts.hostType);

      return doRequest(requester, reqOpts);
    }

    function retryRequestWithHigherTimeout() {
      requestDebug('retrying request with higher timeout');

      client._incrementHostIndex(initialOpts.hostType);

      client._incrementTimeoutMultipler();

      reqOpts.timeouts = client._getTimeoutsForRequest(initialOpts.hostType);
      return doRequest(requester, reqOpts);
    }
  }

  function isCacheValidWithCurrentID(useRequestCache, currentCache, currentCacheID) {
    return client._useCache && useRequestCache && currentCache && currentCache[currentCacheID] !== undefined;
  }

  function interopCallbackReturn(request, callback) {
    if (isCacheValidWithCurrentID(client._useRequestCache, cache, cacheID)) {
      request.catch(function () {
        // Release the cache on error
        delete cache[cacheID];
      });
    }

    if (typeof initialOpts.callback === 'function') {
      // either we have a callback
      request.then(function okCb(content) {
        exitPromise(function () {
          initialOpts.callback(null, callback(content));
        }, client._setTimeout || setTimeout);
      }, function nookCb(err) {
        exitPromise(function () {
          initialOpts.callback(err);
        }, client._setTimeout || setTimeout);
      });
    } else {
      // either we are using promises
      return request.then(callback);
    }
  }

  if (client._useCache && client._useRequestCache) {
    cacheID = initialOpts.url;
  } // as we sometime use POST requests to pass parameters (like query='aa'),
  // the cacheID must also include the body to be different between calls


  if (client._useCache && client._useRequestCache && body) {
    cacheID += '_body_' + body;
  }

  if (isCacheValidWithCurrentID(client._useRequestCache, cache, cacheID)) {
    requestDebug('serving request from cache');
    var maybePromiseForCache = cache[cacheID]; // In case the cache is warmup with value that is not a promise

    var promiseForCache = typeof maybePromiseForCache.then !== 'function' ? client._promise.resolve({
      responseText: maybePromiseForCache
    }) : maybePromiseForCache;
    return interopCallbackReturn(promiseForCache, function (content) {
      // In case of the cache request, return the original value
      return JSON.parse(content.responseText);
    });
  }

  var request = doRequest(client._request, {
    url: initialOpts.url,
    method: initialOpts.method,
    body: body,
    jsonBody: initialOpts.body,
    timeouts: client._getTimeoutsForRequest(initialOpts.hostType),
    forceAuthHeaders: initialOpts.forceAuthHeaders
  });

  if (client._useCache && client._useRequestCache && cache) {
    cache[cacheID] = request;
  }

  return interopCallbackReturn(request, function (content) {
    // In case of the first request, return the JSON value
    return content.body;
  });
};
/*
* Transform search param object in query string
* @param {object} args arguments to add to the current query string
* @param {string} params current query string
* @return {string} the final query string
*/


AlgoliaSearchCore.prototype._getSearchParams = function (args, params) {
  if (args === undefined || args === null) {
    return params;
  }

  for (var key in args) {
    if (key !== null && args[key] !== undefined && args.hasOwnProperty(key)) {
      params += params === '' ? '' : '&';
      params += key + '=' + encodeURIComponent(Object.prototype.toString.call(args[key]) === '[object Array]' ? safeJSONStringify(args[key]) : args[key]);
    }
  }

  return params;
};
/**
 * Compute the headers for a request
 *
 * @param [string] options.additionalUA semi-colon separated string with other user agents to add
 * @param [boolean=true] options.withApiKey Send the api key as a header
 * @param [Object] options.headers Extra headers to send
 */


AlgoliaSearchCore.prototype._computeRequestHeaders = function (options) {
  var forEach = require('foreach');

  var ua = options.additionalUA ? this._ua + '; ' + options.additionalUA : this._ua;
  var requestHeaders = {
    'x-algolia-agent': ua,
    'x-algolia-application-id': this.applicationID
  }; // browser will inline headers in the url, node.js will use http headers
  // but in some situations, the API KEY will be too long (big secured API keys)
  // so if the request is a POST and the KEY is very long, we will be asked to not put
  // it into headers but in the JSON body

  if (options.withApiKey !== false) {
    requestHeaders['x-algolia-api-key'] = this.apiKey;
  }

  if (this.userToken) {
    requestHeaders['x-algolia-usertoken'] = this.userToken;
  }

  if (this.securityTags) {
    requestHeaders['x-algolia-tagfilters'] = this.securityTags;
  }

  forEach(this.extraHeaders, function addToRequestHeaders(value, key) {
    requestHeaders[key] = value;
  });

  if (options.headers) {
    forEach(options.headers, function addToRequestHeaders(value, key) {
      requestHeaders[key] = value;
    });
  }

  return requestHeaders;
};
/**
 * Search through multiple indices at the same time
 * @param  {Object[]}   queries  An array of queries you want to run.
 * @param {string} queries[].indexName The index name you want to target
 * @param {string} [queries[].query] The query to issue on this index. Can also be passed into `params`
 * @param {Object} queries[].params Any search param like hitsPerPage, ..
 * @param  {Function} callback Callback to be called
 * @return {Promise|undefined} Returns a promise if no callback given
 */


AlgoliaSearchCore.prototype.search = function (queries, opts, callback) {
  var isArray = require('isarray');

  var map = require('./map.js');

  var usage = 'Usage: client.search(arrayOfQueries[, callback])';

  if (!isArray(queries)) {
    throw new Error(usage);
  }

  if (typeof opts === 'function') {
    callback = opts;
    opts = {};
  } else if (opts === undefined) {
    opts = {};
  }

  var client = this;
  var postObj = {
    requests: map(queries, function prepareRequest(query) {
      var params = ''; // allow query.query
      // so we are mimicing the index.search(query, params) method
      // {indexName:, query:, params:}

      if (query.query !== undefined) {
        params += 'query=' + encodeURIComponent(query.query);
      }

      return {
        indexName: query.indexName,
        params: client._getSearchParams(query.params, params)
      };
    })
  };
  var JSONPParams = map(postObj.requests, function prepareJSONPParams(request, requestId) {
    return requestId + '=' + encodeURIComponent('/1/indexes/' + encodeURIComponent(request.indexName) + '?' + request.params);
  }).join('&');
  var url = '/1/indexes/*/queries';

  if (opts.strategy !== undefined) {
    postObj.strategy = opts.strategy;
  }

  return this._jsonRequest({
    cache: this.cache,
    method: 'POST',
    url: url,
    body: postObj,
    hostType: 'read',
    fallback: {
      method: 'GET',
      url: '/1/indexes/*',
      body: {
        params: JSONPParams
      }
    },
    callback: callback
  });
};
/**
* Search for facet values
* https://www.algolia.com/doc/rest-api/search#search-for-facet-values
* This is the top-level API for SFFV.
*
* @param {object[]} queries An array of queries to run.
* @param {string} queries[].indexName Index name, name of the index to search.
* @param {object} queries[].params Query parameters.
* @param {string} queries[].params.facetName Facet name, name of the attribute to search for values in.
* Must be declared as a facet
* @param {string} queries[].params.facetQuery Query for the facet search
* @param {string} [queries[].params.*] Any search parameter of Algolia,
* see https://www.algolia.com/doc/api-client/javascript/search#search-parameters
* Pagination is not supported. The page and hitsPerPage parameters will be ignored.
*/


AlgoliaSearchCore.prototype.searchForFacetValues = function (queries) {
  var isArray = require('isarray');

  var map = require('./map.js');

  var usage = 'Usage: client.searchForFacetValues([{indexName, params: {facetName, facetQuery, ...params}}, ...queries])'; // eslint-disable-line max-len

  if (!isArray(queries)) {
    throw new Error(usage);
  }

  var client = this;
  return client._promise.all(map(queries, function performQuery(query) {
    if (!query || query.indexName === undefined || query.params.facetName === undefined || query.params.facetQuery === undefined) {
      throw new Error(usage);
    }

    var clone = require('./clone.js');

    var omit = require('./omit.js');

    var indexName = query.indexName;
    var params = query.params;
    var facetName = params.facetName;
    var filteredParams = omit(clone(params), function (keyName) {
      return keyName === 'facetName';
    });

    var searchParameters = client._getSearchParams(filteredParams, '');

    return client._jsonRequest({
      cache: client.cache,
      method: 'POST',
      url: '/1/indexes/' + encodeURIComponent(indexName) + '/facets/' + encodeURIComponent(facetName) + '/query',
      hostType: 'read',
      body: {
        params: searchParameters
      }
    });
  }));
};
/**
 * Set the extra security tagFilters header
 * @param {string|array} tags The list of tags defining the current security filters
 */


AlgoliaSearchCore.prototype.setSecurityTags = function (tags) {
  if (Object.prototype.toString.call(tags) === '[object Array]') {
    var strTags = [];

    for (var i = 0; i < tags.length; ++i) {
      if (Object.prototype.toString.call(tags[i]) === '[object Array]') {
        var oredTags = [];

        for (var j = 0; j < tags[i].length; ++j) {
          oredTags.push(tags[i][j]);
        }

        strTags.push('(' + oredTags.join(',') + ')');
      } else {
        strTags.push(tags[i]);
      }
    }

    tags = strTags.join(',');
  }

  this.securityTags = tags;
};
/**
 * Set the extra user token header
 * @param {string} userToken The token identifying a uniq user (used to apply rate limits)
 */


AlgoliaSearchCore.prototype.setUserToken = function (userToken) {
  this.userToken = userToken;
};
/**
 * Clear all queries in client's cache
 * @return undefined
 */


AlgoliaSearchCore.prototype.clearCache = function () {
  this.cache = {};
};
/**
* Set the number of milliseconds a request can take before automatically being terminated.
* @deprecated
* @param {Number} milliseconds
*/


AlgoliaSearchCore.prototype.setRequestTimeout = function (milliseconds) {
  if (milliseconds) {
    this._timeouts.connect = this._timeouts.read = this._timeouts.write = milliseconds;
  }
};
/**
* Set the three different (connect, read, write) timeouts to be used when requesting
* @param {Object} timeouts
*/


AlgoliaSearchCore.prototype.setTimeouts = function (timeouts) {
  this._timeouts = timeouts;
};
/**
* Get the three different (connect, read, write) timeouts to be used when requesting
* @param {Object} timeouts
*/


AlgoliaSearchCore.prototype.getTimeouts = function () {
  return this._timeouts;
};

AlgoliaSearchCore.prototype._getAppIdData = function () {
  var data = store.get(this.applicationID);
  if (data !== null) this._cacheAppIdData(data);
  return data;
};

AlgoliaSearchCore.prototype._setAppIdData = function (data) {
  data.lastChange = new Date().getTime();

  this._cacheAppIdData(data);

  return store.set(this.applicationID, data);
};

AlgoliaSearchCore.prototype._checkAppIdData = function () {
  var data = this._getAppIdData();

  var now = new Date().getTime();

  if (data === null || now - data.lastChange > RESET_APP_DATA_TIMER) {
    return this._resetInitialAppIdData(data);
  }

  return data;
};

AlgoliaSearchCore.prototype._resetInitialAppIdData = function (data) {
  var newData = data || {};
  newData.hostIndexes = {
    read: 0,
    write: 0
  };
  newData.timeoutMultiplier = 1;
  newData.shuffleResult = newData.shuffleResult || shuffle([1, 2, 3]);
  return this._setAppIdData(newData);
};

AlgoliaSearchCore.prototype._cacheAppIdData = function (data) {
  this._hostIndexes = data.hostIndexes;
  this._timeoutMultiplier = data.timeoutMultiplier;
  this._shuffleResult = data.shuffleResult;
};

AlgoliaSearchCore.prototype._partialAppIdDataUpdate = function (newData) {
  var foreach = require('foreach');

  var currentData = this._getAppIdData();

  foreach(newData, function (value, key) {
    currentData[key] = value;
  });
  return this._setAppIdData(currentData);
};

AlgoliaSearchCore.prototype._getHostByType = function (hostType) {
  return this.hosts[hostType][this._getHostIndexByType(hostType)];
};

AlgoliaSearchCore.prototype._getTimeoutMultiplier = function () {
  return this._timeoutMultiplier;
};

AlgoliaSearchCore.prototype._getHostIndexByType = function (hostType) {
  return this._hostIndexes[hostType];
};

AlgoliaSearchCore.prototype._setHostIndexByType = function (hostIndex, hostType) {
  var clone = require('./clone');

  var newHostIndexes = clone(this._hostIndexes);
  newHostIndexes[hostType] = hostIndex;

  this._partialAppIdDataUpdate({
    hostIndexes: newHostIndexes
  });

  return hostIndex;
};

AlgoliaSearchCore.prototype._incrementHostIndex = function (hostType) {
  return this._setHostIndexByType((this._getHostIndexByType(hostType) + 1) % this.hosts[hostType].length, hostType);
};

AlgoliaSearchCore.prototype._incrementTimeoutMultipler = function () {
  var timeoutMultiplier = Math.max(this._timeoutMultiplier + 1, 4);
  return this._partialAppIdDataUpdate({
    timeoutMultiplier: timeoutMultiplier
  });
};

AlgoliaSearchCore.prototype._getTimeoutsForRequest = function (hostType) {
  return {
    connect: this._timeouts.connect * this._timeoutMultiplier,
    complete: this._timeouts[hostType] * this._timeoutMultiplier
  };
};

function prepareHost(protocol) {
  return function prepare(host) {
    return protocol + '//' + host.toLowerCase();
  };
} // Prototype.js < 1.7, a widely used library, defines a weird
// Array.prototype.toJSON function that will fail to stringify our content
// appropriately
// refs:
//   - https://groups.google.com/forum/#!topic/prototype-core/E-SAVvV_V9Q
//   - https://github.com/sstephenson/prototype/commit/038a2985a70593c1a86c230fadbdfe2e4898a48c
//   - http://stackoverflow.com/a/3148441/147079


function safeJSONStringify(obj) {
  /* eslint no-extend-native:0 */
  if (Array.prototype.toJSON === undefined) {
    return JSON.stringify(obj);
  }

  var toJSON = Array.prototype.toJSON;
  delete Array.prototype.toJSON;
  var out = JSON.stringify(obj);
  Array.prototype.toJSON = toJSON;
  return out;
}

function shuffle(array) {
  var currentIndex = array.length;
  var temporaryValue;
  var randomIndex; // While there remain elements to shuffle...

  while (currentIndex !== 0) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1; // And swap it with the current element.

    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

function removeCredentials(headers) {
  var newHeaders = {};

  for (var headerName in headers) {
    if (Object.prototype.hasOwnProperty.call(headers, headerName)) {
      var value;

      if (headerName === 'x-algolia-api-key' || headerName === 'x-algolia-application-id') {
        value = '**hidden for security purposes**';
      } else {
        value = headers[headerName];
      }

      newHeaders[headerName] = value;
    }
  }

  return newHeaders;
}
},{"./errors":"../node_modules/algoliasearch/src/errors.js","./exitPromise.js":"../node_modules/algoliasearch/src/exitPromise.js","./IndexCore.js":"../node_modules/algoliasearch/src/IndexCore.js","./store.js":"../node_modules/algoliasearch/src/store.js","debug":"../node_modules/debug/src/browser.js","./clone.js":"../node_modules/algoliasearch/src/clone.js","isarray":"../node_modules/isarray/index.js","./map.js":"../node_modules/algoliasearch/src/map.js","foreach":"../node_modules/foreach/index.js","./omit.js":"../node_modules/algoliasearch/src/omit.js","./clone":"../node_modules/algoliasearch/src/clone.js"}],"../node_modules/algoliasearch/src/createAnalyticsClient.js":[function(require,module,exports) {
module.exports = createAnalyticsClient;

var algoliasearch = require('../index.js');

function createAnalyticsClient(appId, apiKey, opts) {
  var analytics = {};
  opts = opts || {}; // there need to be 4 hosts, like on the client, since if requests fail,
  // the counter goes up by 1, so we need to have the same amount of hosts
  // 4 because: -dsn, -1, -2, -3
  // This is done because the APPID used for search will be the same for the analytics client created,
  // and since the state of available hosts is shared by APPID globally for the module, we had issues
  // where the hostIndex would be 1 while the array was only one entry (you got an empty host)

  opts.hosts = opts.hosts || ['analytics.algolia.com', 'analytics.algolia.com', 'analytics.algolia.com', 'analytics.algolia.com'];
  opts.protocol = opts.protocol || 'https:';
  analytics.as = algoliasearch(appId, apiKey, opts);

  analytics.getABTests = function (_params, callback) {
    var params = params || {};
    var offset = params.offset || 0;
    var limit = params.limit || 10;
    return this.as._jsonRequest({
      method: 'GET',
      url: '/2/abtests?offset=' + encodeURIComponent(offset) + '&limit=' + encodeURIComponent(limit),
      hostType: 'read',
      forceAuthHeaders: true,
      callback: callback
    });
  };

  analytics.getABTest = function (abTestID, callback) {
    return this.as._jsonRequest({
      method: 'GET',
      url: '/2/abtests/' + encodeURIComponent(abTestID),
      hostType: 'read',
      forceAuthHeaders: true,
      callback: callback
    });
  };

  analytics.addABTest = function (abTest, callback) {
    return this.as._jsonRequest({
      method: 'POST',
      url: '/2/abtests',
      body: abTest,
      hostType: 'read',
      forceAuthHeaders: true,
      callback: callback
    });
  };

  analytics.stopABTest = function (abTestID, callback) {
    return this.as._jsonRequest({
      method: 'POST',
      url: '/2/abtests/' + encodeURIComponent(abTestID) + '/stop',
      hostType: 'read',
      forceAuthHeaders: true,
      callback: callback
    });
  };

  analytics.deleteABTest = function (abTestID, callback) {
    return this.as._jsonRequest({
      method: 'DELETE',
      url: '/2/abtests/' + encodeURIComponent(abTestID),
      hostType: 'write',
      forceAuthHeaders: true,
      callback: callback
    });
  };

  analytics.waitTask = function (indexName, taskID, callback) {
    return this.as.initIndex(indexName).waitTask(taskID, callback);
  };

  return analytics;
}
},{"../index.js":"../node_modules/algoliasearch/src/browser/builds/algoliasearch.js"}],"../node_modules/algoliasearch/src/AlgoliaSearch.js":[function(require,module,exports) {
module.exports = AlgoliaSearch;

var Index = require('./Index.js');

var deprecate = require('./deprecate.js');

var deprecatedMessage = require('./deprecatedMessage.js');

var AlgoliaSearchCore = require('./AlgoliaSearchCore.js');

var inherits = require('inherits');

var errors = require('./errors');

function AlgoliaSearch() {
  AlgoliaSearchCore.apply(this, arguments);
}

inherits(AlgoliaSearch, AlgoliaSearchCore);
/*
 * Delete an index
 *
 * @param indexName the name of index to delete
 * @param callback the result callback called with two arguments
 *  error: null or Error('message')
 *  content: the server answer that contains the task ID
 */

AlgoliaSearch.prototype.deleteIndex = function (indexName, callback) {
  return this._jsonRequest({
    method: 'DELETE',
    url: '/1/indexes/' + encodeURIComponent(indexName),
    hostType: 'write',
    callback: callback
  });
};
/**
 * Move an existing index.
 * @param srcIndexName the name of index to copy.
 * @param dstIndexName the new index name that will contains a copy of
 * srcIndexName (destination will be overriten if it already exist).
 * @param callback the result callback called with two arguments
 *  error: null or Error('message')
 *  content: the server answer that contains the task ID
 */


AlgoliaSearch.prototype.moveIndex = function (srcIndexName, dstIndexName, callback) {
  var postObj = {
    operation: 'move',
    destination: dstIndexName
  };
  return this._jsonRequest({
    method: 'POST',
    url: '/1/indexes/' + encodeURIComponent(srcIndexName) + '/operation',
    body: postObj,
    hostType: 'write',
    callback: callback
  });
};
/**
 * Copy an existing index.
 * @param srcIndexName the name of index to copy.
 * @param dstIndexName the new index name that will contains a copy
 * of srcIndexName (destination will be overriten if it already exist).
 * @param scope an array of scopes to copy: ['settings', 'synonyms', 'rules']
 * @param callback the result callback called with two arguments
 *  error: null or Error('message')
 *  content: the server answer that contains the task ID
 */


AlgoliaSearch.prototype.copyIndex = function (srcIndexName, dstIndexName, scopeOrCallback, _callback) {
  var postObj = {
    operation: 'copy',
    destination: dstIndexName
  };
  var callback = _callback;

  if (typeof scopeOrCallback === 'function') {
    // oops, old behaviour of third argument being a function
    callback = scopeOrCallback;
  } else if (Array.isArray(scopeOrCallback) && scopeOrCallback.length > 0) {
    postObj.scope = scopeOrCallback;
  } else if (typeof scopeOrCallback !== 'undefined') {
    throw new Error('the scope given to `copyIndex` was not an array with settings, synonyms or rules');
  }

  return this._jsonRequest({
    method: 'POST',
    url: '/1/indexes/' + encodeURIComponent(srcIndexName) + '/operation',
    body: postObj,
    hostType: 'write',
    callback: callback
  });
};
/**
 * Return last log entries.
 * @param offset Specify the first entry to retrieve (0-based, 0 is the most recent log entry).
 * @param length Specify the maximum number of entries to retrieve starting
 * at offset. Maximum allowed value: 1000.
 * @param type Specify the maximum number of entries to retrieve starting
 * at offset. Maximum allowed value: 1000.
 * @param callback the result callback called with two arguments
 *  error: null or Error('message')
 *  content: the server answer that contains the task ID
 */


AlgoliaSearch.prototype.getLogs = function (offset, length, callback) {
  var clone = require('./clone.js');

  var params = {};

  if (typeof offset === 'object') {
    // getLogs(params)
    params = clone(offset);
    callback = length;
  } else if (arguments.length === 0 || typeof offset === 'function') {
    // getLogs([cb])
    callback = offset;
  } else if (arguments.length === 1 || typeof length === 'function') {
    // getLogs(1, [cb)]
    callback = length;
    params.offset = offset;
  } else {
    // getLogs(1, 2, [cb])
    params.offset = offset;
    params.length = length;
  }

  if (params.offset === undefined) params.offset = 0;
  if (params.length === undefined) params.length = 10;
  return this._jsonRequest({
    method: 'GET',
    url: '/1/logs?' + this._getSearchParams(params, ''),
    hostType: 'read',
    callback: callback
  });
};
/*
 * List all existing indexes (paginated)
 *
 * @param page The page to retrieve, starting at 0.
 * @param callback the result callback called with two arguments
 *  error: null or Error('message')
 *  content: the server answer with index list
 */


AlgoliaSearch.prototype.listIndexes = function (page, callback) {
  var params = '';

  if (page === undefined || typeof page === 'function') {
    callback = page;
  } else {
    params = '?page=' + page;
  }

  return this._jsonRequest({
    method: 'GET',
    url: '/1/indexes' + params,
    hostType: 'read',
    callback: callback
  });
};
/*
 * Get the index object initialized
 *
 * @param indexName the name of index
 * @param callback the result callback with one argument (the Index instance)
 */


AlgoliaSearch.prototype.initIndex = function (indexName) {
  return new Index(this, indexName);
};

AlgoliaSearch.prototype.initAnalytics = function (opts) {
  // the actual require must be inside the function, when put outside then you have a cyclic dependency
  // not well resolved that ends up making the main "./index.js" (main module, the agloliasearch function)
  // export an object instead of a function
  // Other workarounds:
  // - rewrite the lib in ES6, cyclic dependencies may be better supported
  // - move initAnalytics to a property on the main module (algoliasearch.initAnalytics),
  // same as places.
  // The current API was made mostly to mimic the one made in PHP
  var createAnalyticsClient = require('./createAnalyticsClient.js');

  return createAnalyticsClient(this.applicationID, this.apiKey, opts);
};
/*
 * @deprecated use client.listApiKeys
 */


AlgoliaSearch.prototype.listUserKeys = deprecate(function (callback) {
  return this.listApiKeys(callback);
}, deprecatedMessage('client.listUserKeys()', 'client.listApiKeys()'));
/*
 * List all existing api keys with their associated ACLs
 *
 * @param callback the result callback called with two arguments
 *  error: null or Error('message')
 *  content: the server answer with api keys list
 */

AlgoliaSearch.prototype.listApiKeys = function (callback) {
  return this._jsonRequest({
    method: 'GET',
    url: '/1/keys',
    hostType: 'read',
    callback: callback
  });
};
/*
 * @deprecated see client.getApiKey
 */


AlgoliaSearch.prototype.getUserKeyACL = deprecate(function (key, callback) {
  return this.getApiKey(key, callback);
}, deprecatedMessage('client.getUserKeyACL()', 'client.getApiKey()'));
/*
 * Get an API key
 *
 * @param key
 * @param callback the result callback called with two arguments
 *  error: null or Error('message')
 *  content: the server answer with the right API key
 */

AlgoliaSearch.prototype.getApiKey = function (key, callback) {
  return this._jsonRequest({
    method: 'GET',
    url: '/1/keys/' + key,
    hostType: 'read',
    callback: callback
  });
};
/*
 * @deprecated see client.deleteApiKey
 */


AlgoliaSearch.prototype.deleteUserKey = deprecate(function (key, callback) {
  return this.deleteApiKey(key, callback);
}, deprecatedMessage('client.deleteUserKey()', 'client.deleteApiKey()'));
/*
 * Delete an existing API key
 * @param key
 * @param callback the result callback called with two arguments
 *  error: null or Error('message')
 *  content: the server answer with the date of deletion
 */

AlgoliaSearch.prototype.deleteApiKey = function (key, callback) {
  return this._jsonRequest({
    method: 'DELETE',
    url: '/1/keys/' + key,
    hostType: 'write',
    callback: callback
  });
};
/**
 * Restore a deleted API key
 *
 * @param {String} key - The key to restore
 * @param {Function} callback - The result callback called with two arguments
 *   error: null or Error('message')
 *   content: the server answer with the restored API key
 * @return {Promise|undefined} Returns a promise if no callback given
 * @example
 * client.restoreApiKey('APIKEY')
 * @see {@link https://www.algolia.com/doc/rest-api/search/#restore-api-key|Algolia REST API Documentation}
 */


AlgoliaSearch.prototype.restoreApiKey = function (key, callback) {
  return this._jsonRequest({
    method: 'POST',
    url: '/1/keys/' + key + '/restore',
    hostType: 'write',
    callback: callback
  });
};
/*
 @deprecated see client.addApiKey
 */


AlgoliaSearch.prototype.addUserKey = deprecate(function (acls, params, callback) {
  return this.addApiKey(acls, params, callback);
}, deprecatedMessage('client.addUserKey()', 'client.addApiKey()'));
/*
 * Add a new global API key
 *
 * @param {string[]} acls - The list of ACL for this key. Defined by an array of strings that
 *   can contains the following values:
 *     - search: allow to search (https and http)
 *     - addObject: allows to add/update an object in the index (https only)
 *     - deleteObject : allows to delete an existing object (https only)
 *     - deleteIndex : allows to delete index content (https only)
 *     - settings : allows to get index settings (https only)
 *     - editSettings : allows to change index settings (https only)
 * @param {Object} [params] - Optionnal parameters to set for the key
 * @param {number} params.validity - Number of seconds after which the key will be automatically removed (0 means no time limit for this key)
 * @param {number} params.maxQueriesPerIPPerHour - Number of API calls allowed from an IP address per hour
 * @param {number} params.maxHitsPerQuery - Number of hits this API key can retrieve in one call
 * @param {string[]} params.indexes - Allowed targeted indexes for this key
 * @param {string} params.description - A description for your key
 * @param {string[]} params.referers - A list of authorized referers
 * @param {Object} params.queryParameters - Force the key to use specific query parameters
 * @param {Function} callback - The result callback called with two arguments
 *   error: null or Error('message')
 *   content: the server answer with the added API key
 * @return {Promise|undefined} Returns a promise if no callback given
 * @example
 * client.addApiKey(['search'], {
 *   validity: 300,
 *   maxQueriesPerIPPerHour: 2000,
 *   maxHitsPerQuery: 3,
 *   indexes: ['fruits'],
 *   description: 'Eat three fruits',
 *   referers: ['*.algolia.com'],
 *   queryParameters: {
 *     tagFilters: ['public'],
 *   }
 * })
 * @see {@link https://www.algolia.com/doc/rest_api#AddKey|Algolia REST API Documentation}
 */

AlgoliaSearch.prototype.addApiKey = function (acls, params, callback) {
  var isArray = require('isarray');

  var usage = 'Usage: client.addApiKey(arrayOfAcls[, params, callback])';

  if (!isArray(acls)) {
    throw new Error(usage);
  }

  if (arguments.length === 1 || typeof params === 'function') {
    callback = params;
    params = null;
  }

  var postObj = {
    acl: acls
  };

  if (params) {
    postObj.validity = params.validity;
    postObj.maxQueriesPerIPPerHour = params.maxQueriesPerIPPerHour;
    postObj.maxHitsPerQuery = params.maxHitsPerQuery;
    postObj.indexes = params.indexes;
    postObj.description = params.description;

    if (params.queryParameters) {
      postObj.queryParameters = this._getSearchParams(params.queryParameters, '');
    }

    postObj.referers = params.referers;
  }

  return this._jsonRequest({
    method: 'POST',
    url: '/1/keys',
    body: postObj,
    hostType: 'write',
    callback: callback
  });
};
/**
 * @deprecated Please use client.addApiKey()
 */


AlgoliaSearch.prototype.addUserKeyWithValidity = deprecate(function (acls, params, callback) {
  return this.addApiKey(acls, params, callback);
}, deprecatedMessage('client.addUserKeyWithValidity()', 'client.addApiKey()'));
/**
 * @deprecated Please use client.updateApiKey()
 */

AlgoliaSearch.prototype.updateUserKey = deprecate(function (key, acls, params, callback) {
  return this.updateApiKey(key, acls, params, callback);
}, deprecatedMessage('client.updateUserKey()', 'client.updateApiKey()'));
/**
 * Update an existing API key
 * @param {string} key - The key to update
 * @param {string[]} acls - The list of ACL for this key. Defined by an array of strings that
 *   can contains the following values:
 *     - search: allow to search (https and http)
 *     - addObject: allows to add/update an object in the index (https only)
 *     - deleteObject : allows to delete an existing object (https only)
 *     - deleteIndex : allows to delete index content (https only)
 *     - settings : allows to get index settings (https only)
 *     - editSettings : allows to change index settings (https only)
 * @param {Object} [params] - Optionnal parameters to set for the key
 * @param {number} params.validity - Number of seconds after which the key will be automatically removed (0 means no time limit for this key)
 * @param {number} params.maxQueriesPerIPPerHour - Number of API calls allowed from an IP address per hour
 * @param {number} params.maxHitsPerQuery - Number of hits this API key can retrieve in one call
 * @param {string[]} params.indexes - Allowed targeted indexes for this key
 * @param {string} params.description - A description for your key
 * @param {string[]} params.referers - A list of authorized referers
 * @param {Object} params.queryParameters - Force the key to use specific query parameters
 * @param {Function} callback - The result callback called with two arguments
 *   error: null or Error('message')
 *   content: the server answer with the modified API key
 * @return {Promise|undefined} Returns a promise if no callback given
 * @example
 * client.updateApiKey('APIKEY', ['search'], {
 *   validity: 300,
 *   maxQueriesPerIPPerHour: 2000,
 *   maxHitsPerQuery: 3,
 *   indexes: ['fruits'],
 *   description: 'Eat three fruits',
 *   referers: ['*.algolia.com'],
 *   queryParameters: {
 *     tagFilters: ['public'],
 *   }
 * })
 * @see {@link https://www.algolia.com/doc/rest_api#UpdateIndexKey|Algolia REST API Documentation}
 */

AlgoliaSearch.prototype.updateApiKey = function (key, acls, params, callback) {
  var isArray = require('isarray');

  var usage = 'Usage: client.updateApiKey(key, arrayOfAcls[, params, callback])';

  if (!isArray(acls)) {
    throw new Error(usage);
  }

  if (arguments.length === 2 || typeof params === 'function') {
    callback = params;
    params = null;
  }

  var putObj = {
    acl: acls
  };

  if (params) {
    putObj.validity = params.validity;
    putObj.maxQueriesPerIPPerHour = params.maxQueriesPerIPPerHour;
    putObj.maxHitsPerQuery = params.maxHitsPerQuery;
    putObj.indexes = params.indexes;
    putObj.description = params.description;

    if (params.queryParameters) {
      putObj.queryParameters = this._getSearchParams(params.queryParameters, '');
    }

    putObj.referers = params.referers;
  }

  return this._jsonRequest({
    method: 'PUT',
    url: '/1/keys/' + key,
    body: putObj,
    hostType: 'write',
    callback: callback
  });
};
/**
 * Initialize a new batch of search queries
 * @deprecated use client.search()
 */


AlgoliaSearch.prototype.startQueriesBatch = deprecate(function startQueriesBatchDeprecated() {
  this._batch = [];
}, deprecatedMessage('client.startQueriesBatch()', 'client.search()'));
/**
 * Add a search query in the batch
 * @deprecated use client.search()
 */

AlgoliaSearch.prototype.addQueryInBatch = deprecate(function addQueryInBatchDeprecated(indexName, query, args) {
  this._batch.push({
    indexName: indexName,
    query: query,
    params: args
  });
}, deprecatedMessage('client.addQueryInBatch()', 'client.search()'));
/**
 * Launch the batch of queries using XMLHttpRequest.
 * @deprecated use client.search()
 */

AlgoliaSearch.prototype.sendQueriesBatch = deprecate(function sendQueriesBatchDeprecated(callback) {
  return this.search(this._batch, callback);
}, deprecatedMessage('client.sendQueriesBatch()', 'client.search()'));
/**
 * Perform write operations across multiple indexes.
 *
 * To reduce the amount of time spent on network round trips,
 * you can create, update, or delete several objects in one call,
 * using the batch endpoint (all operations are done in the given order).
 *
 * Available actions:
 *   - addObject
 *   - updateObject
 *   - partialUpdateObject
 *   - partialUpdateObjectNoCreate
 *   - deleteObject
 *
 * https://www.algolia.com/doc/rest_api#Indexes
 * @param  {Object[]} operations An array of operations to perform
 * @return {Promise|undefined} Returns a promise if no callback given
 * @example
 * client.batch([{
 *   action: 'addObject',
 *   indexName: 'clients',
 *   body: {
 *     name: 'Bill'
 *   }
 * }, {
 *   action: 'udpateObject',
 *   indexName: 'fruits',
 *   body: {
 *     objectID: '29138',
 *     name: 'banana'
 *   }
 * }], cb)
 */

AlgoliaSearch.prototype.batch = function (operations, callback) {
  var isArray = require('isarray');

  var usage = 'Usage: client.batch(operations[, callback])';

  if (!isArray(operations)) {
    throw new Error(usage);
  }

  return this._jsonRequest({
    method: 'POST',
    url: '/1/indexes/*/batch',
    body: {
      requests: operations
    },
    hostType: 'write',
    callback: callback
  });
};
/**
 * Assign or Move a userID to a cluster
 *
 * @param {string} data.userID The userID to assign to a new cluster
 * @param {string} data.cluster The cluster to assign the user to
 * @return {Promise|undefined} Returns a promise if no callback given
 * @example
 * client.assignUserID({ cluster: 'c1-test', userID: 'some-user' });
 */


AlgoliaSearch.prototype.assignUserID = function (data, callback) {
  if (!data.userID || !data.cluster) {
    throw new errors.AlgoliaSearchError('You have to provide both a userID and cluster', data);
  }

  return this._jsonRequest({
    method: 'POST',
    url: '/1/clusters/mapping',
    hostType: 'write',
    body: {
      cluster: data.cluster
    },
    callback: callback,
    headers: {
      'x-algolia-user-id': data.userID
    }
  });
};
/**
 * Get the top userIDs
 *
 * (the callback is the second argument)
 *
 * @return {Promise|undefined} Returns a promise if no callback given
 * @example
 * client.getTopUserID();
 */


AlgoliaSearch.prototype.getTopUserID = function (callback) {
  return this._jsonRequest({
    method: 'GET',
    url: '/1/clusters/mapping/top',
    hostType: 'read',
    callback: callback
  });
};
/**
 * Get userID
 *
 * @param {string} data.userID The userID to get info about
 * @return {Promise|undefined} Returns a promise if no callback given
 * @example
 * client.getUserID({ userID: 'some-user' });
 */


AlgoliaSearch.prototype.getUserID = function (data, callback) {
  if (!data.userID) {
    throw new errors.AlgoliaSearchError('You have to provide a userID', {
      debugData: data
    });
  }

  return this._jsonRequest({
    method: 'GET',
    url: '/1/clusters/mapping/' + data.userID,
    hostType: 'read',
    callback: callback
  });
};
/**
 * List all the clusters
 *
 * (the callback is the second argument)
 *
 * @return {Promise|undefined} Returns a promise if no callback given
 * @example
 * client.listClusters();
 */


AlgoliaSearch.prototype.listClusters = function (callback) {
  return this._jsonRequest({
    method: 'GET',
    url: '/1/clusters',
    hostType: 'read',
    callback: callback
  });
};
/**
 * List the userIDs
 *
 * (the callback is the second argument)
 *
 * @param {string} data.hitsPerPage How many hits on every page
 * @param {string} data.page The page to retrieve
 * @return {Promise|undefined} Returns a promise if no callback given
 * @example
 * client.listClusters();
 * client.listClusters({ page: 3, hitsPerPage: 30});
 */


AlgoliaSearch.prototype.listUserIDs = function (data, callback) {
  return this._jsonRequest({
    method: 'GET',
    url: '/1/clusters/mapping',
    body: data,
    hostType: 'read',
    callback: callback
  });
};
/**
 * Remove an userID
 *
 * @param {string} data.userID The userID to assign to a new cluster
 * @return {Promise|undefined} Returns a promise if no callback given
 * @example
 * client.removeUserID({ userID: 'some-user' });
 */


AlgoliaSearch.prototype.removeUserID = function (data, callback) {
  if (!data.userID) {
    throw new errors.AlgoliaSearchError('You have to provide a userID', {
      debugData: data
    });
  }

  return this._jsonRequest({
    method: 'DELETE',
    url: '/1/clusters/mapping',
    hostType: 'write',
    callback: callback,
    headers: {
      'x-algolia-user-id': data.userID
    }
  });
};
/**
 * Search for userIDs
 *
 * @param {string} data.cluster The cluster to target
 * @param {string} data.query The query to execute
 * @param {string} data.hitsPerPage How many hits on every page
 * @param {string} data.page The page to retrieve
 * @return {Promise|undefined} Returns a promise if no callback given
 * @example
 * client.searchUserIDs({ cluster: 'c1-test', query: 'some-user' });
 * client.searchUserIDs({
 *   cluster: "c1-test",
 *   query: "some-user",
 *   page: 3,
 *   hitsPerPage: 2
 * });
 */


AlgoliaSearch.prototype.searchUserIDs = function (data, callback) {
  return this._jsonRequest({
    method: 'POST',
    url: '/1/clusters/mapping/search',
    body: data,
    hostType: 'read',
    callback: callback
  });
};
/**
 * Set strategy for personalization
 *
 * @param {Object} data
 * @param {Object} data.eventsScoring Associate a score to an event
 * @param {Object} data.eventsScoring.<eventName> The name of the event
 * @param {Number} data.eventsScoring.<eventName>.score The score to associate to <eventName>
 * @param {String} data.eventsScoring.<eventName>.type Either "click", "conversion" or "view"
 * @param {Object} data.facetsScoring Associate a score to a facet
 * @param {Object} data.facetsScoring.<facetName> The name of the facet
 * @param {Number} data.facetsScoring.<facetName>.score The score to associate to <facetName>
 * @return {Promise|undefined} Returns a promise if no callback given
 * @example
 * client.setPersonalizationStrategy({
 *   eventsScoring: {
 *      "Add to cart": { score: 50, type: "conversion" },
 *      Purchase: { score: 100, type: "conversion" }
 *   },
 *   facetsScoring: {
 *      brand: { score: 100 },
 *      categories: { score: 10 }
 *   }
 * });
 */


AlgoliaSearch.prototype.setPersonalizationStrategy = function (data, callback) {
  return this._jsonRequest({
    method: 'POST',
    url: '/1/recommendation/personalization/strategy',
    body: data,
    hostType: 'write',
    callback: callback
  });
};
/**
 * Get strategy for personalization
 *
 * @return {Promise|undefined} Returns a promise if no callback given
 * @example
 * client.getPersonalizationStrategy();
 */


AlgoliaSearch.prototype.getPersonalizationStrategy = function (callback) {
  return this._jsonRequest({
    method: 'GET',
    url: '/1/recommendation/personalization/strategy',
    hostType: 'read',
    callback: callback
  });
}; // environment specific methods


AlgoliaSearch.prototype.destroy = notImplemented;
AlgoliaSearch.prototype.enableRateLimitForward = notImplemented;
AlgoliaSearch.prototype.disableRateLimitForward = notImplemented;
AlgoliaSearch.prototype.useSecuredAPIKey = notImplemented;
AlgoliaSearch.prototype.disableSecuredAPIKey = notImplemented;
AlgoliaSearch.prototype.generateSecuredApiKey = notImplemented;

function notImplemented() {
  var message = 'Not implemented in this environment.\n' + 'If you feel this is a mistake, write to support@algolia.com';
  throw new errors.AlgoliaSearchError(message);
}
},{"./Index.js":"../node_modules/algoliasearch/src/Index.js","./deprecate.js":"../node_modules/algoliasearch/src/deprecate.js","./deprecatedMessage.js":"../node_modules/algoliasearch/src/deprecatedMessage.js","./AlgoliaSearchCore.js":"../node_modules/algoliasearch/src/AlgoliaSearchCore.js","inherits":"../node_modules/inherits/inherits_browser.js","./errors":"../node_modules/algoliasearch/src/errors.js","./clone.js":"../node_modules/algoliasearch/src/clone.js","./createAnalyticsClient.js":"../node_modules/algoliasearch/src/createAnalyticsClient.js","isarray":"../node_modules/isarray/index.js"}],"../node_modules/global/window.js":[function(require,module,exports) {
var global = arguments[3];
var win;

if (typeof window !== "undefined") {
    win = window;
} else if (typeof global !== "undefined") {
    win = global;
} else if (typeof self !== "undefined"){
    win = self;
} else {
    win = {};
}

module.exports = win;

},{}],"../node_modules/es6-promise/dist/es6-promise.js":[function(require,module,exports) {
var define;
var global = arguments[3];
var process = require("process");
/*!
 * @overview es6-promise - a tiny implementation of Promises/A+.
 * @copyright Copyright (c) 2014 Yehuda Katz, Tom Dale, Stefan Penner and contributors (Conversion to ES6 API by Jake Archibald)
 * @license   Licensed under MIT license
 *            See https://raw.githubusercontent.com/stefanpenner/es6-promise/master/LICENSE
 * @version   v4.2.6+9869a4bc
 */

(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.ES6Promise = factory());
}(this, (function () { 'use strict';

function objectOrFunction(x) {
  var type = typeof x;
  return x !== null && (type === 'object' || type === 'function');
}

function isFunction(x) {
  return typeof x === 'function';
}



var _isArray = void 0;
if (Array.isArray) {
  _isArray = Array.isArray;
} else {
  _isArray = function (x) {
    return Object.prototype.toString.call(x) === '[object Array]';
  };
}

var isArray = _isArray;

var len = 0;
var vertxNext = void 0;
var customSchedulerFn = void 0;

var asap = function asap(callback, arg) {
  queue[len] = callback;
  queue[len + 1] = arg;
  len += 2;
  if (len === 2) {
    // If len is 2, that means that we need to schedule an async flush.
    // If additional callbacks are queued before the queue is flushed, they
    // will be processed by this flush that we are scheduling.
    if (customSchedulerFn) {
      customSchedulerFn(flush);
    } else {
      scheduleFlush();
    }
  }
};

function setScheduler(scheduleFn) {
  customSchedulerFn = scheduleFn;
}

function setAsap(asapFn) {
  asap = asapFn;
}

var browserWindow = typeof window !== 'undefined' ? window : undefined;
var browserGlobal = browserWindow || {};
var BrowserMutationObserver = browserGlobal.MutationObserver || browserGlobal.WebKitMutationObserver;
var isNode = typeof self === 'undefined' && typeof process !== 'undefined' && {}.toString.call(process) === '[object process]';

// test for web worker but not in IE10
var isWorker = typeof Uint8ClampedArray !== 'undefined' && typeof importScripts !== 'undefined' && typeof MessageChannel !== 'undefined';

// node
function useNextTick() {
  // node version 0.10.x displays a deprecation warning when nextTick is used recursively
  // see https://github.com/cujojs/when/issues/410 for details
  return function () {
    return process.nextTick(flush);
  };
}

// vertx
function useVertxTimer() {
  if (typeof vertxNext !== 'undefined') {
    return function () {
      vertxNext(flush);
    };
  }

  return useSetTimeout();
}

function useMutationObserver() {
  var iterations = 0;
  var observer = new BrowserMutationObserver(flush);
  var node = document.createTextNode('');
  observer.observe(node, { characterData: true });

  return function () {
    node.data = iterations = ++iterations % 2;
  };
}

// web worker
function useMessageChannel() {
  var channel = new MessageChannel();
  channel.port1.onmessage = flush;
  return function () {
    return channel.port2.postMessage(0);
  };
}

function useSetTimeout() {
  // Store setTimeout reference so es6-promise will be unaffected by
  // other code modifying setTimeout (like sinon.useFakeTimers())
  var globalSetTimeout = setTimeout;
  return function () {
    return globalSetTimeout(flush, 1);
  };
}

var queue = new Array(1000);
function flush() {
  for (var i = 0; i < len; i += 2) {
    var callback = queue[i];
    var arg = queue[i + 1];

    callback(arg);

    queue[i] = undefined;
    queue[i + 1] = undefined;
  }

  len = 0;
}

function attemptVertx() {
  try {
    var vertx = Function('return this')().require('vertx');
    vertxNext = vertx.runOnLoop || vertx.runOnContext;
    return useVertxTimer();
  } catch (e) {
    return useSetTimeout();
  }
}

var scheduleFlush = void 0;
// Decide what async method to use to triggering processing of queued callbacks:
if (isNode) {
  scheduleFlush = useNextTick();
} else if (BrowserMutationObserver) {
  scheduleFlush = useMutationObserver();
} else if (isWorker) {
  scheduleFlush = useMessageChannel();
} else if (browserWindow === undefined && typeof require === 'function') {
  scheduleFlush = attemptVertx();
} else {
  scheduleFlush = useSetTimeout();
}

function then(onFulfillment, onRejection) {
  var parent = this;

  var child = new this.constructor(noop);

  if (child[PROMISE_ID] === undefined) {
    makePromise(child);
  }

  var _state = parent._state;


  if (_state) {
    var callback = arguments[_state - 1];
    asap(function () {
      return invokeCallback(_state, child, callback, parent._result);
    });
  } else {
    subscribe(parent, child, onFulfillment, onRejection);
  }

  return child;
}

/**
  `Promise.resolve` returns a promise that will become resolved with the
  passed `value`. It is shorthand for the following:

  ```javascript
  let promise = new Promise(function(resolve, reject){
    resolve(1);
  });

  promise.then(function(value){
    // value === 1
  });
  ```

  Instead of writing the above, your code now simply becomes the following:

  ```javascript
  let promise = Promise.resolve(1);

  promise.then(function(value){
    // value === 1
  });
  ```

  @method resolve
  @static
  @param {Any} value value that the returned promise will be resolved with
  Useful for tooling.
  @return {Promise} a promise that will become fulfilled with the given
  `value`
*/
function resolve$1(object) {
  /*jshint validthis:true */
  var Constructor = this;

  if (object && typeof object === 'object' && object.constructor === Constructor) {
    return object;
  }

  var promise = new Constructor(noop);
  resolve(promise, object);
  return promise;
}

var PROMISE_ID = Math.random().toString(36).substring(2);

function noop() {}

var PENDING = void 0;
var FULFILLED = 1;
var REJECTED = 2;

var TRY_CATCH_ERROR = { error: null };

function selfFulfillment() {
  return new TypeError("You cannot resolve a promise with itself");
}

function cannotReturnOwn() {
  return new TypeError('A promises callback cannot return that same promise.');
}

function getThen(promise) {
  try {
    return promise.then;
  } catch (error) {
    TRY_CATCH_ERROR.error = error;
    return TRY_CATCH_ERROR;
  }
}

function tryThen(then$$1, value, fulfillmentHandler, rejectionHandler) {
  try {
    then$$1.call(value, fulfillmentHandler, rejectionHandler);
  } catch (e) {
    return e;
  }
}

function handleForeignThenable(promise, thenable, then$$1) {
  asap(function (promise) {
    var sealed = false;
    var error = tryThen(then$$1, thenable, function (value) {
      if (sealed) {
        return;
      }
      sealed = true;
      if (thenable !== value) {
        resolve(promise, value);
      } else {
        fulfill(promise, value);
      }
    }, function (reason) {
      if (sealed) {
        return;
      }
      sealed = true;

      reject(promise, reason);
    }, 'Settle: ' + (promise._label || ' unknown promise'));

    if (!sealed && error) {
      sealed = true;
      reject(promise, error);
    }
  }, promise);
}

function handleOwnThenable(promise, thenable) {
  if (thenable._state === FULFILLED) {
    fulfill(promise, thenable._result);
  } else if (thenable._state === REJECTED) {
    reject(promise, thenable._result);
  } else {
    subscribe(thenable, undefined, function (value) {
      return resolve(promise, value);
    }, function (reason) {
      return reject(promise, reason);
    });
  }
}

function handleMaybeThenable(promise, maybeThenable, then$$1) {
  if (maybeThenable.constructor === promise.constructor && then$$1 === then && maybeThenable.constructor.resolve === resolve$1) {
    handleOwnThenable(promise, maybeThenable);
  } else {
    if (then$$1 === TRY_CATCH_ERROR) {
      reject(promise, TRY_CATCH_ERROR.error);
      TRY_CATCH_ERROR.error = null;
    } else if (then$$1 === undefined) {
      fulfill(promise, maybeThenable);
    } else if (isFunction(then$$1)) {
      handleForeignThenable(promise, maybeThenable, then$$1);
    } else {
      fulfill(promise, maybeThenable);
    }
  }
}

function resolve(promise, value) {
  if (promise === value) {
    reject(promise, selfFulfillment());
  } else if (objectOrFunction(value)) {
    handleMaybeThenable(promise, value, getThen(value));
  } else {
    fulfill(promise, value);
  }
}

function publishRejection(promise) {
  if (promise._onerror) {
    promise._onerror(promise._result);
  }

  publish(promise);
}

function fulfill(promise, value) {
  if (promise._state !== PENDING) {
    return;
  }

  promise._result = value;
  promise._state = FULFILLED;

  if (promise._subscribers.length !== 0) {
    asap(publish, promise);
  }
}

function reject(promise, reason) {
  if (promise._state !== PENDING) {
    return;
  }
  promise._state = REJECTED;
  promise._result = reason;

  asap(publishRejection, promise);
}

function subscribe(parent, child, onFulfillment, onRejection) {
  var _subscribers = parent._subscribers;
  var length = _subscribers.length;


  parent._onerror = null;

  _subscribers[length] = child;
  _subscribers[length + FULFILLED] = onFulfillment;
  _subscribers[length + REJECTED] = onRejection;

  if (length === 0 && parent._state) {
    asap(publish, parent);
  }
}

function publish(promise) {
  var subscribers = promise._subscribers;
  var settled = promise._state;

  if (subscribers.length === 0) {
    return;
  }

  var child = void 0,
      callback = void 0,
      detail = promise._result;

  for (var i = 0; i < subscribers.length; i += 3) {
    child = subscribers[i];
    callback = subscribers[i + settled];

    if (child) {
      invokeCallback(settled, child, callback, detail);
    } else {
      callback(detail);
    }
  }

  promise._subscribers.length = 0;
}

function tryCatch(callback, detail) {
  try {
    return callback(detail);
  } catch (e) {
    TRY_CATCH_ERROR.error = e;
    return TRY_CATCH_ERROR;
  }
}

function invokeCallback(settled, promise, callback, detail) {
  var hasCallback = isFunction(callback),
      value = void 0,
      error = void 0,
      succeeded = void 0,
      failed = void 0;

  if (hasCallback) {
    value = tryCatch(callback, detail);

    if (value === TRY_CATCH_ERROR) {
      failed = true;
      error = value.error;
      value.error = null;
    } else {
      succeeded = true;
    }

    if (promise === value) {
      reject(promise, cannotReturnOwn());
      return;
    }
  } else {
    value = detail;
    succeeded = true;
  }

  if (promise._state !== PENDING) {
    // noop
  } else if (hasCallback && succeeded) {
    resolve(promise, value);
  } else if (failed) {
    reject(promise, error);
  } else if (settled === FULFILLED) {
    fulfill(promise, value);
  } else if (settled === REJECTED) {
    reject(promise, value);
  }
}

function initializePromise(promise, resolver) {
  try {
    resolver(function resolvePromise(value) {
      resolve(promise, value);
    }, function rejectPromise(reason) {
      reject(promise, reason);
    });
  } catch (e) {
    reject(promise, e);
  }
}

var id = 0;
function nextId() {
  return id++;
}

function makePromise(promise) {
  promise[PROMISE_ID] = id++;
  promise._state = undefined;
  promise._result = undefined;
  promise._subscribers = [];
}

function validationError() {
  return new Error('Array Methods must be provided an Array');
}

var Enumerator = function () {
  function Enumerator(Constructor, input) {
    this._instanceConstructor = Constructor;
    this.promise = new Constructor(noop);

    if (!this.promise[PROMISE_ID]) {
      makePromise(this.promise);
    }

    if (isArray(input)) {
      this.length = input.length;
      this._remaining = input.length;

      this._result = new Array(this.length);

      if (this.length === 0) {
        fulfill(this.promise, this._result);
      } else {
        this.length = this.length || 0;
        this._enumerate(input);
        if (this._remaining === 0) {
          fulfill(this.promise, this._result);
        }
      }
    } else {
      reject(this.promise, validationError());
    }
  }

  Enumerator.prototype._enumerate = function _enumerate(input) {
    for (var i = 0; this._state === PENDING && i < input.length; i++) {
      this._eachEntry(input[i], i);
    }
  };

  Enumerator.prototype._eachEntry = function _eachEntry(entry, i) {
    var c = this._instanceConstructor;
    var resolve$$1 = c.resolve;


    if (resolve$$1 === resolve$1) {
      var _then = getThen(entry);

      if (_then === then && entry._state !== PENDING) {
        this._settledAt(entry._state, i, entry._result);
      } else if (typeof _then !== 'function') {
        this._remaining--;
        this._result[i] = entry;
      } else if (c === Promise$1) {
        var promise = new c(noop);
        handleMaybeThenable(promise, entry, _then);
        this._willSettleAt(promise, i);
      } else {
        this._willSettleAt(new c(function (resolve$$1) {
          return resolve$$1(entry);
        }), i);
      }
    } else {
      this._willSettleAt(resolve$$1(entry), i);
    }
  };

  Enumerator.prototype._settledAt = function _settledAt(state, i, value) {
    var promise = this.promise;


    if (promise._state === PENDING) {
      this._remaining--;

      if (state === REJECTED) {
        reject(promise, value);
      } else {
        this._result[i] = value;
      }
    }

    if (this._remaining === 0) {
      fulfill(promise, this._result);
    }
  };

  Enumerator.prototype._willSettleAt = function _willSettleAt(promise, i) {
    var enumerator = this;

    subscribe(promise, undefined, function (value) {
      return enumerator._settledAt(FULFILLED, i, value);
    }, function (reason) {
      return enumerator._settledAt(REJECTED, i, reason);
    });
  };

  return Enumerator;
}();

/**
  `Promise.all` accepts an array of promises, and returns a new promise which
  is fulfilled with an array of fulfillment values for the passed promises, or
  rejected with the reason of the first passed promise to be rejected. It casts all
  elements of the passed iterable to promises as it runs this algorithm.

  Example:

  ```javascript
  let promise1 = resolve(1);
  let promise2 = resolve(2);
  let promise3 = resolve(3);
  let promises = [ promise1, promise2, promise3 ];

  Promise.all(promises).then(function(array){
    // The array here would be [ 1, 2, 3 ];
  });
  ```

  If any of the `promises` given to `all` are rejected, the first promise
  that is rejected will be given as an argument to the returned promises's
  rejection handler. For example:

  Example:

  ```javascript
  let promise1 = resolve(1);
  let promise2 = reject(new Error("2"));
  let promise3 = reject(new Error("3"));
  let promises = [ promise1, promise2, promise3 ];

  Promise.all(promises).then(function(array){
    // Code here never runs because there are rejected promises!
  }, function(error) {
    // error.message === "2"
  });
  ```

  @method all
  @static
  @param {Array} entries array of promises
  @param {String} label optional string for labeling the promise.
  Useful for tooling.
  @return {Promise} promise that is fulfilled when all `promises` have been
  fulfilled, or rejected if any of them become rejected.
  @static
*/
function all(entries) {
  return new Enumerator(this, entries).promise;
}

/**
  `Promise.race` returns a new promise which is settled in the same way as the
  first passed promise to settle.

  Example:

  ```javascript
  let promise1 = new Promise(function(resolve, reject){
    setTimeout(function(){
      resolve('promise 1');
    }, 200);
  });

  let promise2 = new Promise(function(resolve, reject){
    setTimeout(function(){
      resolve('promise 2');
    }, 100);
  });

  Promise.race([promise1, promise2]).then(function(result){
    // result === 'promise 2' because it was resolved before promise1
    // was resolved.
  });
  ```

  `Promise.race` is deterministic in that only the state of the first
  settled promise matters. For example, even if other promises given to the
  `promises` array argument are resolved, but the first settled promise has
  become rejected before the other promises became fulfilled, the returned
  promise will become rejected:

  ```javascript
  let promise1 = new Promise(function(resolve, reject){
    setTimeout(function(){
      resolve('promise 1');
    }, 200);
  });

  let promise2 = new Promise(function(resolve, reject){
    setTimeout(function(){
      reject(new Error('promise 2'));
    }, 100);
  });

  Promise.race([promise1, promise2]).then(function(result){
    // Code here never runs
  }, function(reason){
    // reason.message === 'promise 2' because promise 2 became rejected before
    // promise 1 became fulfilled
  });
  ```

  An example real-world use case is implementing timeouts:

  ```javascript
  Promise.race([ajax('foo.json'), timeout(5000)])
  ```

  @method race
  @static
  @param {Array} promises array of promises to observe
  Useful for tooling.
  @return {Promise} a promise which settles in the same way as the first passed
  promise to settle.
*/
function race(entries) {
  /*jshint validthis:true */
  var Constructor = this;

  if (!isArray(entries)) {
    return new Constructor(function (_, reject) {
      return reject(new TypeError('You must pass an array to race.'));
    });
  } else {
    return new Constructor(function (resolve, reject) {
      var length = entries.length;
      for (var i = 0; i < length; i++) {
        Constructor.resolve(entries[i]).then(resolve, reject);
      }
    });
  }
}

/**
  `Promise.reject` returns a promise rejected with the passed `reason`.
  It is shorthand for the following:

  ```javascript
  let promise = new Promise(function(resolve, reject){
    reject(new Error('WHOOPS'));
  });

  promise.then(function(value){
    // Code here doesn't run because the promise is rejected!
  }, function(reason){
    // reason.message === 'WHOOPS'
  });
  ```

  Instead of writing the above, your code now simply becomes the following:

  ```javascript
  let promise = Promise.reject(new Error('WHOOPS'));

  promise.then(function(value){
    // Code here doesn't run because the promise is rejected!
  }, function(reason){
    // reason.message === 'WHOOPS'
  });
  ```

  @method reject
  @static
  @param {Any} reason value that the returned promise will be rejected with.
  Useful for tooling.
  @return {Promise} a promise rejected with the given `reason`.
*/
function reject$1(reason) {
  /*jshint validthis:true */
  var Constructor = this;
  var promise = new Constructor(noop);
  reject(promise, reason);
  return promise;
}

function needsResolver() {
  throw new TypeError('You must pass a resolver function as the first argument to the promise constructor');
}

function needsNew() {
  throw new TypeError("Failed to construct 'Promise': Please use the 'new' operator, this object constructor cannot be called as a function.");
}

/**
  Promise objects represent the eventual result of an asynchronous operation. The
  primary way of interacting with a promise is through its `then` method, which
  registers callbacks to receive either a promise's eventual value or the reason
  why the promise cannot be fulfilled.

  Terminology
  -----------

  - `promise` is an object or function with a `then` method whose behavior conforms to this specification.
  - `thenable` is an object or function that defines a `then` method.
  - `value` is any legal JavaScript value (including undefined, a thenable, or a promise).
  - `exception` is a value that is thrown using the throw statement.
  - `reason` is a value that indicates why a promise was rejected.
  - `settled` the final resting state of a promise, fulfilled or rejected.

  A promise can be in one of three states: pending, fulfilled, or rejected.

  Promises that are fulfilled have a fulfillment value and are in the fulfilled
  state.  Promises that are rejected have a rejection reason and are in the
  rejected state.  A fulfillment value is never a thenable.

  Promises can also be said to *resolve* a value.  If this value is also a
  promise, then the original promise's settled state will match the value's
  settled state.  So a promise that *resolves* a promise that rejects will
  itself reject, and a promise that *resolves* a promise that fulfills will
  itself fulfill.


  Basic Usage:
  ------------

  ```js
  let promise = new Promise(function(resolve, reject) {
    // on success
    resolve(value);

    // on failure
    reject(reason);
  });

  promise.then(function(value) {
    // on fulfillment
  }, function(reason) {
    // on rejection
  });
  ```

  Advanced Usage:
  ---------------

  Promises shine when abstracting away asynchronous interactions such as
  `XMLHttpRequest`s.

  ```js
  function getJSON(url) {
    return new Promise(function(resolve, reject){
      let xhr = new XMLHttpRequest();

      xhr.open('GET', url);
      xhr.onreadystatechange = handler;
      xhr.responseType = 'json';
      xhr.setRequestHeader('Accept', 'application/json');
      xhr.send();

      function handler() {
        if (this.readyState === this.DONE) {
          if (this.status === 200) {
            resolve(this.response);
          } else {
            reject(new Error('getJSON: `' + url + '` failed with status: [' + this.status + ']'));
          }
        }
      };
    });
  }

  getJSON('/posts.json').then(function(json) {
    // on fulfillment
  }, function(reason) {
    // on rejection
  });
  ```

  Unlike callbacks, promises are great composable primitives.

  ```js
  Promise.all([
    getJSON('/posts'),
    getJSON('/comments')
  ]).then(function(values){
    values[0] // => postsJSON
    values[1] // => commentsJSON

    return values;
  });
  ```

  @class Promise
  @param {Function} resolver
  Useful for tooling.
  @constructor
*/

var Promise$1 = function () {
  function Promise(resolver) {
    this[PROMISE_ID] = nextId();
    this._result = this._state = undefined;
    this._subscribers = [];

    if (noop !== resolver) {
      typeof resolver !== 'function' && needsResolver();
      this instanceof Promise ? initializePromise(this, resolver) : needsNew();
    }
  }

  /**
  The primary way of interacting with a promise is through its `then` method,
  which registers callbacks to receive either a promise's eventual value or the
  reason why the promise cannot be fulfilled.
   ```js
  findUser().then(function(user){
    // user is available
  }, function(reason){
    // user is unavailable, and you are given the reason why
  });
  ```
   Chaining
  --------
   The return value of `then` is itself a promise.  This second, 'downstream'
  promise is resolved with the return value of the first promise's fulfillment
  or rejection handler, or rejected if the handler throws an exception.
   ```js
  findUser().then(function (user) {
    return user.name;
  }, function (reason) {
    return 'default name';
  }).then(function (userName) {
    // If `findUser` fulfilled, `userName` will be the user's name, otherwise it
    // will be `'default name'`
  });
   findUser().then(function (user) {
    throw new Error('Found user, but still unhappy');
  }, function (reason) {
    throw new Error('`findUser` rejected and we're unhappy');
  }).then(function (value) {
    // never reached
  }, function (reason) {
    // if `findUser` fulfilled, `reason` will be 'Found user, but still unhappy'.
    // If `findUser` rejected, `reason` will be '`findUser` rejected and we're unhappy'.
  });
  ```
  If the downstream promise does not specify a rejection handler, rejection reasons will be propagated further downstream.
   ```js
  findUser().then(function (user) {
    throw new PedagogicalException('Upstream error');
  }).then(function (value) {
    // never reached
  }).then(function (value) {
    // never reached
  }, function (reason) {
    // The `PedgagocialException` is propagated all the way down to here
  });
  ```
   Assimilation
  ------------
   Sometimes the value you want to propagate to a downstream promise can only be
  retrieved asynchronously. This can be achieved by returning a promise in the
  fulfillment or rejection handler. The downstream promise will then be pending
  until the returned promise is settled. This is called *assimilation*.
   ```js
  findUser().then(function (user) {
    return findCommentsByAuthor(user);
  }).then(function (comments) {
    // The user's comments are now available
  });
  ```
   If the assimliated promise rejects, then the downstream promise will also reject.
   ```js
  findUser().then(function (user) {
    return findCommentsByAuthor(user);
  }).then(function (comments) {
    // If `findCommentsByAuthor` fulfills, we'll have the value here
  }, function (reason) {
    // If `findCommentsByAuthor` rejects, we'll have the reason here
  });
  ```
   Simple Example
  --------------
   Synchronous Example
   ```javascript
  let result;
   try {
    result = findResult();
    // success
  } catch(reason) {
    // failure
  }
  ```
   Errback Example
   ```js
  findResult(function(result, err){
    if (err) {
      // failure
    } else {
      // success
    }
  });
  ```
   Promise Example;
   ```javascript
  findResult().then(function(result){
    // success
  }, function(reason){
    // failure
  });
  ```
   Advanced Example
  --------------
   Synchronous Example
   ```javascript
  let author, books;
   try {
    author = findAuthor();
    books  = findBooksByAuthor(author);
    // success
  } catch(reason) {
    // failure
  }
  ```
   Errback Example
   ```js
   function foundBooks(books) {
   }
   function failure(reason) {
   }
   findAuthor(function(author, err){
    if (err) {
      failure(err);
      // failure
    } else {
      try {
        findBoooksByAuthor(author, function(books, err) {
          if (err) {
            failure(err);
          } else {
            try {
              foundBooks(books);
            } catch(reason) {
              failure(reason);
            }
          }
        });
      } catch(error) {
        failure(err);
      }
      // success
    }
  });
  ```
   Promise Example;
   ```javascript
  findAuthor().
    then(findBooksByAuthor).
    then(function(books){
      // found books
  }).catch(function(reason){
    // something went wrong
  });
  ```
   @method then
  @param {Function} onFulfilled
  @param {Function} onRejected
  Useful for tooling.
  @return {Promise}
  */

  /**
  `catch` is simply sugar for `then(undefined, onRejection)` which makes it the same
  as the catch block of a try/catch statement.
  ```js
  function findAuthor(){
  throw new Error('couldn't find that author');
  }
  // synchronous
  try {
  findAuthor();
  } catch(reason) {
  // something went wrong
  }
  // async with promises
  findAuthor().catch(function(reason){
  // something went wrong
  });
  ```
  @method catch
  @param {Function} onRejection
  Useful for tooling.
  @return {Promise}
  */


  Promise.prototype.catch = function _catch(onRejection) {
    return this.then(null, onRejection);
  };

  /**
    `finally` will be invoked regardless of the promise's fate just as native
    try/catch/finally behaves
  
    Synchronous example:
  
    ```js
    findAuthor() {
      if (Math.random() > 0.5) {
        throw new Error();
      }
      return new Author();
    }
  
    try {
      return findAuthor(); // succeed or fail
    } catch(error) {
      return findOtherAuther();
    } finally {
      // always runs
      // doesn't affect the return value
    }
    ```
  
    Asynchronous example:
  
    ```js
    findAuthor().catch(function(reason){
      return findOtherAuther();
    }).finally(function(){
      // author was either found, or not
    });
    ```
  
    @method finally
    @param {Function} callback
    @return {Promise}
  */


  Promise.prototype.finally = function _finally(callback) {
    var promise = this;
    var constructor = promise.constructor;

    if (isFunction(callback)) {
      return promise.then(function (value) {
        return constructor.resolve(callback()).then(function () {
          return value;
        });
      }, function (reason) {
        return constructor.resolve(callback()).then(function () {
          throw reason;
        });
      });
    }

    return promise.then(callback, callback);
  };

  return Promise;
}();

Promise$1.prototype.then = then;
Promise$1.all = all;
Promise$1.race = race;
Promise$1.resolve = resolve$1;
Promise$1.reject = reject$1;
Promise$1._setScheduler = setScheduler;
Promise$1._setAsap = setAsap;
Promise$1._asap = asap;

/*global self*/
function polyfill() {
  var local = void 0;

  if (typeof global !== 'undefined') {
    local = global;
  } else if (typeof self !== 'undefined') {
    local = self;
  } else {
    try {
      local = Function('return this')();
    } catch (e) {
      throw new Error('polyfill failed because global object is unavailable in this environment');
    }
  }

  var P = local.Promise;

  if (P) {
    var promiseToString = null;
    try {
      promiseToString = Object.prototype.toString.call(P.resolve());
    } catch (e) {
      // silently ignored
    }

    if (promiseToString === '[object Promise]' && !P.cast) {
      return;
    }
  }

  local.Promise = Promise$1;
}

// Strange compat..
Promise$1.polyfill = polyfill;
Promise$1.Promise = Promise$1;

return Promise$1;

})));





},{"process":"../../../../.nvm/versions/node/v10.15.3/lib/node_modules/parcel-bundler/node_modules/process/browser.js"}],"../node_modules/querystring-es3/encode.js":[function(require,module,exports) {
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.
'use strict';

var stringifyPrimitive = function (v) {
  switch (typeof v) {
    case 'string':
      return v;

    case 'boolean':
      return v ? 'true' : 'false';

    case 'number':
      return isFinite(v) ? v : '';

    default:
      return '';
  }
};

module.exports = function (obj, sep, eq, name) {
  sep = sep || '&';
  eq = eq || '=';

  if (obj === null) {
    obj = undefined;
  }

  if (typeof obj === 'object') {
    return map(objectKeys(obj), function (k) {
      var ks = encodeURIComponent(stringifyPrimitive(k)) + eq;

      if (isArray(obj[k])) {
        return map(obj[k], function (v) {
          return ks + encodeURIComponent(stringifyPrimitive(v));
        }).join(sep);
      } else {
        return ks + encodeURIComponent(stringifyPrimitive(obj[k]));
      }
    }).join(sep);
  }

  if (!name) return '';
  return encodeURIComponent(stringifyPrimitive(name)) + eq + encodeURIComponent(stringifyPrimitive(obj));
};

var isArray = Array.isArray || function (xs) {
  return Object.prototype.toString.call(xs) === '[object Array]';
};

function map(xs, f) {
  if (xs.map) return xs.map(f);
  var res = [];

  for (var i = 0; i < xs.length; i++) {
    res.push(f(xs[i], i));
  }

  return res;
}

var objectKeys = Object.keys || function (obj) {
  var res = [];

  for (var key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) res.push(key);
  }

  return res;
};
},{}],"../node_modules/algoliasearch/src/browser/inline-headers.js":[function(require,module,exports) {
'use strict';

module.exports = inlineHeaders;

var encode = require('querystring-es3/encode');

function inlineHeaders(url, headers) {
  if (/\?/.test(url)) {
    url += '&';
  } else {
    url += '?';
  }

  return url + encode(headers);
}
},{"querystring-es3/encode":"../node_modules/querystring-es3/encode.js"}],"../node_modules/algoliasearch/src/browser/jsonp-request.js":[function(require,module,exports) {
'use strict';

module.exports = jsonpRequest;

var errors = require('../errors');

var JSONPCounter = 0;

function jsonpRequest(url, opts, cb) {
  if (opts.method !== 'GET') {
    cb(new Error('Method ' + opts.method + ' ' + url + ' is not supported by JSONP.'));
    return;
  }

  opts.debug('JSONP: start');
  var cbCalled = false;
  var timedOut = false;
  JSONPCounter += 1;
  var head = document.getElementsByTagName('head')[0];
  var script = document.createElement('script');
  var cbName = 'algoliaJSONP_' + JSONPCounter;
  var done = false;

  window[cbName] = function (data) {
    removeGlobals();

    if (timedOut) {
      opts.debug('JSONP: Late answer, ignoring');
      return;
    }

    cbCalled = true;
    clean();
    cb(null, {
      body: data,
      responseText: JSON.stringify(data)
      /* ,
      // We do not send the statusCode, there's no statusCode in JSONP, it will be
      // computed using data.status && data.message like with XDR
      statusCode*/

    });
  }; // add callback by hand


  url += '&callback=' + cbName; // add body params manually

  if (opts.jsonBody && opts.jsonBody.params) {
    url += '&' + opts.jsonBody.params;
  }

  var ontimeout = setTimeout(timeout, opts.timeouts.complete); // script onreadystatechange needed only for
  // <= IE8
  // https://github.com/angular/angular.js/issues/4523

  script.onreadystatechange = readystatechange;
  script.onload = success;
  script.onerror = error;
  script.async = true;
  script.defer = true;
  script.src = url;
  head.appendChild(script);

  function success() {
    opts.debug('JSONP: success');

    if (done || timedOut) {
      return;
    }

    done = true; // script loaded but did not call the fn => script loading error

    if (!cbCalled) {
      opts.debug('JSONP: Fail. Script loaded but did not call the callback');
      clean();
      cb(new errors.JSONPScriptFail());
    }
  }

  function readystatechange() {
    if (this.readyState === 'loaded' || this.readyState === 'complete') {
      success();
    }
  }

  function clean() {
    clearTimeout(ontimeout);
    script.onload = null;
    script.onreadystatechange = null;
    script.onerror = null;
    head.removeChild(script);
  }

  function removeGlobals() {
    try {
      delete window[cbName];
      delete window[cbName + '_loaded'];
    } catch (e) {
      window[cbName] = window[cbName + '_loaded'] = undefined;
    }
  }

  function timeout() {
    opts.debug('JSONP: Script timeout');
    timedOut = true;
    clean();
    cb(new errors.RequestTimeout());
  }

  function error() {
    opts.debug('JSONP: Script error');

    if (done || timedOut) {
      return;
    }

    clean();
    cb(new errors.JSONPScriptError());
  }
}
},{"../errors":"../node_modules/algoliasearch/src/errors.js"}],"../node_modules/querystring-es3/decode.js":[function(require,module,exports) {
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.
'use strict'; // If obj.hasOwnProperty has been overridden, then calling
// obj.hasOwnProperty(prop) will break.
// See: https://github.com/joyent/node/issues/1707

function hasOwnProperty(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

module.exports = function (qs, sep, eq, options) {
  sep = sep || '&';
  eq = eq || '=';
  var obj = {};

  if (typeof qs !== 'string' || qs.length === 0) {
    return obj;
  }

  var regexp = /\+/g;
  qs = qs.split(sep);
  var maxKeys = 1000;

  if (options && typeof options.maxKeys === 'number') {
    maxKeys = options.maxKeys;
  }

  var len = qs.length; // maxKeys <= 0 means that we should not limit keys count

  if (maxKeys > 0 && len > maxKeys) {
    len = maxKeys;
  }

  for (var i = 0; i < len; ++i) {
    var x = qs[i].replace(regexp, '%20'),
        idx = x.indexOf(eq),
        kstr,
        vstr,
        k,
        v;

    if (idx >= 0) {
      kstr = x.substr(0, idx);
      vstr = x.substr(idx + 1);
    } else {
      kstr = x;
      vstr = '';
    }

    k = decodeURIComponent(kstr);
    v = decodeURIComponent(vstr);

    if (!hasOwnProperty(obj, k)) {
      obj[k] = v;
    } else if (isArray(obj[k])) {
      obj[k].push(v);
    } else {
      obj[k] = [obj[k], v];
    }
  }

  return obj;
};

var isArray = Array.isArray || function (xs) {
  return Object.prototype.toString.call(xs) === '[object Array]';
};
},{}],"../node_modules/querystring-es3/index.js":[function(require,module,exports) {
'use strict';

exports.decode = exports.parse = require('./decode');
exports.encode = exports.stringify = require('./encode');
},{"./decode":"../node_modules/querystring-es3/decode.js","./encode":"../node_modules/querystring-es3/encode.js"}],"../node_modules/algoliasearch/src/places.js":[function(require,module,exports) {
module.exports = createPlacesClient;

var qs3 = require('querystring-es3');

var buildSearchMethod = require('./buildSearchMethod.js');

function createPlacesClient(algoliasearch) {
  return function places(appID, apiKey, opts) {
    var cloneDeep = require('./clone.js');

    opts = opts && cloneDeep(opts) || {};
    opts.hosts = opts.hosts || ['places-dsn.algolia.net', 'places-1.algolianet.com', 'places-2.algolianet.com', 'places-3.algolianet.com']; // allow initPlaces() no arguments => community rate limited

    if (arguments.length === 0 || typeof appID === 'object' || appID === undefined) {
      appID = '';
      apiKey = '';
      opts._allowEmptyCredentials = true;
    }

    var client = algoliasearch(appID, apiKey, opts);
    var index = client.initIndex('places');
    index.search = buildSearchMethod('query', '/1/places/query');

    index.reverse = function (options, callback) {
      var encoded = qs3.encode(options);
      return this.as._jsonRequest({
        method: 'GET',
        url: '/1/places/reverse?' + encoded,
        hostType: 'read',
        callback: callback
      });
    };

    index.getObject = function (objectID, callback) {
      return this.as._jsonRequest({
        method: 'GET',
        url: '/1/places/' + encodeURIComponent(objectID),
        hostType: 'read',
        callback: callback
      });
    };

    return index;
  };
}
},{"querystring-es3":"../node_modules/querystring-es3/index.js","./buildSearchMethod.js":"../node_modules/algoliasearch/src/buildSearchMethod.js","./clone.js":"../node_modules/algoliasearch/src/clone.js"}],"../node_modules/algoliasearch/src/version.js":[function(require,module,exports) {
'use strict';

module.exports = '3.33.0';
},{}],"../node_modules/algoliasearch/src/browser/createAlgoliasearch.js":[function(require,module,exports) {

'use strict';

var global = require('global');

var Promise = global.Promise || require('es6-promise').Promise; // This is the standalone browser build entry point
// Browser implementation of the Algolia Search JavaScript client,
// using XMLHttpRequest, XDomainRequest and JSONP as fallback


module.exports = function createAlgoliasearch(AlgoliaSearch, uaSuffix) {
  var inherits = require('inherits');

  var errors = require('../errors');

  var inlineHeaders = require('./inline-headers');

  var jsonpRequest = require('./jsonp-request');

  var places = require('../places.js');

  uaSuffix = uaSuffix || '';

  if ("development" === 'debug') {
    require('debug').enable('algoliasearch*');
  }

  function algoliasearch(applicationID, apiKey, opts) {
    var cloneDeep = require('../clone.js');

    opts = cloneDeep(opts || {});
    opts._ua = opts._ua || algoliasearch.ua;
    return new AlgoliaSearchBrowser(applicationID, apiKey, opts);
  }

  algoliasearch.version = require('../version.js');
  algoliasearch.ua = 'Algolia for JavaScript (' + algoliasearch.version + '); ' + uaSuffix;
  algoliasearch.initPlaces = places(algoliasearch); // we expose into window no matter how we are used, this will allow
  // us to easily debug any website running algolia

  global.__algolia = {
    debug: require('debug'),
    algoliasearch: algoliasearch
  };
  var support = {
    hasXMLHttpRequest: 'XMLHttpRequest' in global,
    hasXDomainRequest: 'XDomainRequest' in global
  };

  if (support.hasXMLHttpRequest) {
    support.cors = 'withCredentials' in new XMLHttpRequest();
  }

  function AlgoliaSearchBrowser() {
    // call AlgoliaSearch constructor
    AlgoliaSearch.apply(this, arguments);
  }

  inherits(AlgoliaSearchBrowser, AlgoliaSearch);

  AlgoliaSearchBrowser.prototype._request = function request(url, opts) {
    return new Promise(function wrapRequest(resolve, reject) {
      // no cors or XDomainRequest, no request
      if (!support.cors && !support.hasXDomainRequest) {
        // very old browser, not supported
        reject(new errors.Network('CORS not supported'));
        return;
      }

      url = inlineHeaders(url, opts.headers);
      var body = opts.body;
      var req = support.cors ? new XMLHttpRequest() : new XDomainRequest();
      var reqTimeout;
      var timedOut;
      var connected = false;
      reqTimeout = setTimeout(onTimeout, opts.timeouts.connect); // we set an empty onprogress listener
      // so that XDomainRequest on IE9 is not aborted
      // refs:
      //  - https://github.com/algolia/algoliasearch-client-js/issues/76
      //  - https://social.msdn.microsoft.com/Forums/ie/en-US/30ef3add-767c-4436-b8a9-f1ca19b4812e/ie9-rtm-xdomainrequest-issued-requests-may-abort-if-all-event-handlers-not-specified?forum=iewebdevelopment

      req.onprogress = onProgress;
      if ('onreadystatechange' in req) req.onreadystatechange = onReadyStateChange;
      req.onload = onLoad;
      req.onerror = onError; // do not rely on default XHR async flag, as some analytics code like hotjar
      // breaks it and set it to false by default

      if (req instanceof XMLHttpRequest) {
        req.open(opts.method, url, true); // The Analytics API never accepts Auth headers as query string
        // this option exists specifically for them.

        if (opts.forceAuthHeaders) {
          req.setRequestHeader('x-algolia-application-id', opts.headers['x-algolia-application-id']);
          req.setRequestHeader('x-algolia-api-key', opts.headers['x-algolia-api-key']);
        }
      } else {
        req.open(opts.method, url);
      } // headers are meant to be sent after open


      if (support.cors) {
        if (body) {
          if (opts.method === 'POST') {
            // https://developer.mozilla.org/en-US/docs/Web/HTTP/Access_control_CORS#Simple_requests
            req.setRequestHeader('content-type', 'application/x-www-form-urlencoded');
          } else {
            req.setRequestHeader('content-type', 'application/json');
          }
        }

        req.setRequestHeader('accept', 'application/json');
      }

      if (body) {
        req.send(body);
      } else {
        req.send();
      } // event object not received in IE8, at least
      // but we do not use it, still important to note


      function onLoad()
      /* event */
      {
        // When browser does not supports req.timeout, we can
        // have both a load and timeout event, since handled by a dumb setTimeout
        if (timedOut) {
          return;
        }

        clearTimeout(reqTimeout);
        var out;

        try {
          out = {
            body: JSON.parse(req.responseText),
            responseText: req.responseText,
            statusCode: req.status,
            // XDomainRequest does not have any response headers
            headers: req.getAllResponseHeaders && req.getAllResponseHeaders() || {}
          };
        } catch (e) {
          out = new errors.UnparsableJSON({
            more: req.responseText
          });
        }

        if (out instanceof errors.UnparsableJSON) {
          reject(out);
        } else {
          resolve(out);
        }
      }

      function onError(event) {
        if (timedOut) {
          return;
        }

        clearTimeout(reqTimeout); // error event is trigerred both with XDR/XHR on:
        //   - DNS error
        //   - unallowed cross domain request

        reject(new errors.Network({
          more: event
        }));
      }

      function onTimeout() {
        timedOut = true;
        req.abort();
        reject(new errors.RequestTimeout());
      }

      function onConnect() {
        connected = true;
        clearTimeout(reqTimeout);
        reqTimeout = setTimeout(onTimeout, opts.timeouts.complete);
      }

      function onProgress() {
        if (!connected) onConnect();
      }

      function onReadyStateChange() {
        if (!connected && req.readyState > 1) onConnect();
      }
    });
  };

  AlgoliaSearchBrowser.prototype._request.fallback = function requestFallback(url, opts) {
    url = inlineHeaders(url, opts.headers);
    return new Promise(function wrapJsonpRequest(resolve, reject) {
      jsonpRequest(url, opts, function jsonpRequestDone(err, content) {
        if (err) {
          reject(err);
          return;
        }

        resolve(content);
      });
    });
  };

  AlgoliaSearchBrowser.prototype._promise = {
    reject: function rejectPromise(val) {
      return Promise.reject(val);
    },
    resolve: function resolvePromise(val) {
      return Promise.resolve(val);
    },
    delay: function delayPromise(ms) {
      return new Promise(function resolveOnTimeout(resolve
      /* , reject*/
      ) {
        setTimeout(resolve, ms);
      });
    },
    all: function all(promises) {
      return Promise.all(promises);
    }
  };
  return algoliasearch;
};
},{"global":"../node_modules/global/window.js","es6-promise":"../node_modules/es6-promise/dist/es6-promise.js","inherits":"../node_modules/inherits/inherits_browser.js","../errors":"../node_modules/algoliasearch/src/errors.js","./inline-headers":"../node_modules/algoliasearch/src/browser/inline-headers.js","./jsonp-request":"../node_modules/algoliasearch/src/browser/jsonp-request.js","../places.js":"../node_modules/algoliasearch/src/places.js","../clone.js":"../node_modules/algoliasearch/src/clone.js","../version.js":"../node_modules/algoliasearch/src/version.js","debug":"../node_modules/debug/src/browser.js"}],"../node_modules/algoliasearch/src/browser/builds/algoliasearch.js":[function(require,module,exports) {
'use strict';

var AlgoliaSearch = require('../../AlgoliaSearch.js');

var createAlgoliasearch = require('../createAlgoliasearch.js');

module.exports = createAlgoliasearch(AlgoliaSearch, 'Browser');
},{"../../AlgoliaSearch.js":"../node_modules/algoliasearch/src/AlgoliaSearch.js","../createAlgoliasearch.js":"../node_modules/algoliasearch/src/browser/createAlgoliasearch.js"}],"../node_modules/deepmerge/dist/umd.js":[function(require,module,exports) {
var define;
var global = arguments[3];
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() : typeof define === 'function' && define.amd ? define(factory) : global.deepmerge = factory();
})(this, function () {
  'use strict';

  var isMergeableObject = function isMergeableObject(value) {
    return isNonNullObject(value) && !isSpecial(value);
  };

  function isNonNullObject(value) {
    return !!value && typeof value === 'object';
  }

  function isSpecial(value) {
    var stringValue = Object.prototype.toString.call(value);
    return stringValue === '[object RegExp]' || stringValue === '[object Date]' || isReactElement(value);
  } // see https://github.com/facebook/react/blob/b5ac963fb791d1298e7f396236383bc955f916c1/src/isomorphic/classic/element/ReactElement.js#L21-L25


  var canUseSymbol = typeof Symbol === 'function' && Symbol.for;
  var REACT_ELEMENT_TYPE = canUseSymbol ? Symbol.for('react.element') : 0xeac7;

  function isReactElement(value) {
    return value.$$typeof === REACT_ELEMENT_TYPE;
  }

  function emptyTarget(val) {
    return Array.isArray(val) ? [] : {};
  }

  function cloneUnlessOtherwiseSpecified(value, options) {
    return options.clone !== false && options.isMergeableObject(value) ? deepmerge(emptyTarget(value), value, options) : value;
  }

  function defaultArrayMerge(target, source, options) {
    return target.concat(source).map(function (element) {
      return cloneUnlessOtherwiseSpecified(element, options);
    });
  }

  function getMergeFunction(key, options) {
    if (!options.customMerge) {
      return deepmerge;
    }

    var customMerge = options.customMerge(key);
    return typeof customMerge === 'function' ? customMerge : deepmerge;
  }

  function mergeObject(target, source, options) {
    var destination = {};

    if (options.isMergeableObject(target)) {
      Object.keys(target).forEach(function (key) {
        destination[key] = cloneUnlessOtherwiseSpecified(target[key], options);
      });
    }

    Object.keys(source).forEach(function (key) {
      if (!options.isMergeableObject(source[key]) || !target[key]) {
        destination[key] = cloneUnlessOtherwiseSpecified(source[key], options);
      } else {
        destination[key] = getMergeFunction(key, options)(target[key], source[key], options);
      }
    });
    return destination;
  }

  function deepmerge(target, source, options) {
    options = options || {};
    options.arrayMerge = options.arrayMerge || defaultArrayMerge;
    options.isMergeableObject = options.isMergeableObject || isMergeableObject;
    var sourceIsArray = Array.isArray(source);
    var targetIsArray = Array.isArray(target);
    var sourceAndTargetTypesMatch = sourceIsArray === targetIsArray;

    if (!sourceAndTargetTypesMatch) {
      return cloneUnlessOtherwiseSpecified(source, options);
    } else if (sourceIsArray) {
      return options.arrayMerge(target, source, options);
    } else {
      return mergeObject(target, source, options);
    }
  }

  deepmerge.all = function deepmergeAll(array, options) {
    if (!Array.isArray(array)) {
      throw new Error('first argument should be an array');
    }

    return array.reduce(function (prev, next) {
      return deepmerge(prev, next, options);
    }, {});
  };

  var deepmerge_1 = deepmerge;
  return deepmerge_1;
});
},{}],"utils.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isString = isString;
exports.isNumber = isNumber;
exports.isArray = isArray;
exports.isFunction = isFunction;
exports.isObject = isObject;

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

/**
 * Check if value is a string
 *
 * @param {*} value
 */
function isString(value) {
  return typeof value === 'string' || value instanceof String;
}
/**
 * Check if value is a number
 *
 * @param {*} value
 */


function isNumber(value) {
  return typeof value === 'number' && isFinite(value);
}
/**
 * Check if value is an array
 *
 * @param {*} value
 */


function isArray(value) {
  return Array.isArray(value);
}
/**
 * Check if value is a function
 *
 * @param {*} value
 */


function isFunction(value) {
  return typeof value === 'function';
}
/**
 * Check if value is an object
 *
 * @param {*} value
 */


function isObject(value) {
  return value && _typeof(value) === 'object' && value.constructor === Object;
}
},{}],"component.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.init = init;
exports.update = update;

var _utils = require("./utils");

var NO_DATA_TEXT = '';
var options;

function renderBase() {
  var defaultValue = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
  var html = options.templates.base(defaultValue, options);
  var el = Docsify.dom.create('div', html);
  var aside = Docsify.dom.find('aside');
  Docsify.dom.toggleClass(el, 'search');
  Docsify.dom.before(aside, el);
}

function renderResponse(response) {
  var _options = options,
      algolia = _options.algolia;
  var _options$templates = options.templates,
      resultSet = _options$templates.resultSet,
      resultItem = _options$templates.resultItem;

  if (algolia.multi) {
    var results = response.results;
    return results.map(function (results) {
      return resultSet(results, response, options);
    }).join('');
  } else {
    var hits = response.hits;
    return hits.map(function (result) {
      return resultItem(result, response, options);
    }).join('');
  }
}

function doSearch(value) {
  var clearInput = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
  var $search = Docsify.dom.find('div.search');
  var $input = Docsify.dom.find($search, 'input');
  var $panel = Docsify.dom.find($search, '.results-panel');
  var $clearBtn = Docsify.dom.find($search, '.clear-button');
  var $sidebarNav = Docsify.dom.find('.sidebar-nav');
  var $appName = Docsify.dom.find('.app-name');
  var query;

  if (!value) {
    $panel.classList.remove('show');
    $clearBtn.classList.remove('show');
    $panel.innerHTML = '';

    if (options.hideOtherSidebarContent) {
      $sidebarNav.classList.remove('hide');
      $appName.classList.remove('hide');
    }

    if (clearInput) {
      $input.value = '';
    }

    return;
  }

  var _options2 = options,
      algolia = _options2.algolia;
  var searchClient = algolia.multi ? algolia.client : algolia.indexMap[algolia.currentIndex(algolia.indexMap)];

  if (!(0, _utils.isArray)(algolia.indexes)) {
    console.error('Algolia Search Plugin: When multi search is enabled, you must provided more than one index');
    return;
  }

  if (algolia.multi) {
    query = algolia.indexes.map(function (_ref) {
      var index = _ref.index;
      return {
        indexName: index,
        query: value
      };
    });
  } else {
    query = value;
  }

  searchClient.search(query).then(renderResponse).then(function (html) {
    $panel.classList.add('show');
    $clearBtn.classList.add('show');
    $panel.innerHTML = html || '<p class="empty">No Results</p>';

    if (options.hideOtherSidebarContent) {
      $sidebarNav.classList.add('hide');
      $appName.classList.add('hide');
    }
  });
}

function bindEvents(indexMap) {
  var $search = Docsify.dom.find('div.search');
  var $input = Docsify.dom.find($search, 'input');
  var $inputWrap = Docsify.dom.find($search, '.input-wrap');
  var timeId; // Prevent to Fold sidebar

  Docsify.dom.on($search, 'click', function (e) {
    return e.target.tagName !== 'A' && e.stopPropagation();
  });
  Docsify.dom.on($input, 'input', function (e) {
    clearTimeout(timeId), timeId = setTimeout(function () {
      return doSearch(e.target.value.trim(), indexMap);
    }, 100);
  });
  Docsify.dom.on($inputWrap, 'click', function (e) {
    // Click input outside
    if (e.target.tagName !== 'INPUT') {
      $input.value = '';
      doSearch();
    }
  });

  window.DocsifyAlgoliaSearchPlugin.clearResults = function () {
    var clearResults = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
    doSearch(null, clearResults);
  };
}

function updatePlaceholder(text, path) {
  var $input = Docsify.dom.getNode('.search input[type="search"]');

  if (!$input) {
    return;
  }

  if ((0, _utils.isString)(text)) {
    $input.placeholder = text;
  } else {
    var match = Object.keys(text).filter(function (key) {
      return path.indexOf(key) > -1;
    })[0];
    $input.placeholder = text[match];
  }
}

function updateNoData(text, path) {
  if ((0, _utils.isString)(text)) {
    NO_DATA_TEXT = text;
  } else {
    var match = Object.keys(text).filter(function (key) {
      return path.indexOf(key) > -1;
    })[0];
    NO_DATA_TEXT = text[match];
  }
}

function updateOptions(opts) {
  options = opts;
}

function init(opts, vm) {
  var keywords = vm.router.parse().query.s;
  updateOptions(opts);
  Docsify.dom.style(options.templates.style(options));
  renderBase(keywords);
  bindEvents();
  keywords && setTimeout(function () {
    return doSearch(keywords);
  }, 500);
}

function update(opts, vm) {
  updateOptions(opts);
  updatePlaceholder(opts.placeholder, vm.route.path);
  updateNoData(opts.noData, vm.route.path);
}
},{"./utils":"utils.js"}],"render.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _utils = require("./utils");

var base = function base() {
  var defaultValue = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
  var options = arguments.length > 1 ? arguments[1] : undefined;
  return "\n    <div class=\"input-wrap\">\n        <input type=\"search\" value=\"".concat(defaultValue, "\" />\n        <div class=\"clear-button\">\n            <svg width=\"26\" height=\"24\">\n                <circle cx=\"12\" cy=\"12\" r=\"11\" fill=\"#ccc\" />\n                <path stroke=\"white\" stroke-width=\"2\" d=\"M8.25,8.25,15.75,15.75\" />\n                <path stroke=\"white\" stroke-width=\"2\"d=\"M8.25,15.75,15.75,8.25\" />\n            </svg>\n        </div>\n    </div>\n    <div class=\"results-panel\"></div>\n    </div>\n");
};

var style = function style(options) {
  return "\n    .sidebar {\n        --search-link-hover-color: #fff;\n        padding-top: 0;\n    }\n\n    .search {\n        margin-bottom: 20px;\n        padding: 6px;\n        border-bottom: 1px solid #eee;\n    }\n\n    .search .input-wrap {\n        display: flex;\n        align-items: center;\n    }\n\n    .search .results-panel {\n        display: none;\n    }\n\n    .search .results-panel.show {\n        display: block;\n    }\n\n    .search a:hover {\n        color: var(--search-link-hover-color);\n    }\n\n    .search input {\n        outline: none;\n        border: none;\n        width: 100%;\n        padding: 0 7px;\n        line-height: 36px;\n        font-size: 14px;\n    }\n\n    .search input::-webkit-search-decoration,\n    .search input::-webkit-search-cancel-button,\n    .search input {\n        -webkit-appearance: none;\n        -moz-appearance: none;\n        appearance: none;\n    }\n    .search .clear-button {\n        width: 36px;\n        text-align: right;\n        display: none;\n    }\n\n    .search .clear-button.show {\n        display: block;\n    }\n\n    .search .clear-button svg {\n        transform: scale(.5);\n    }\n\n    .search h2 {\n        font-size: 17px;\n        margin: 10px 0;\n    }\n\n    .search a {\n        text-decoration: none;\n        color: inherit;\n    }\n\n    .search .matching-post {\n        border-bottom: 1px solid #eee;\n    }\n\n    .search .matching-post:last-child {\n        border-bottom: 0;\n    }\n\n    .search p {\n        font-size: 14px;\n        overflow: hidden;\n        text-overflow: ellipsis;\n        display: -webkit-box;\n        -webkit-line-clamp: 2;\n        -webkit-box-orient: vertical;\n    }\n\n    .search p.empty {\n        text-align: center;\n    }\n\n    .app-name.hide, .sidebar-nav.hide {\n        display: none;\n    }\n";
};

var resultItem = function resultItem(result) {
  var title = result._highlightResult.title;
  var body = result._snippetResult.body;
  return "\n        <div class=\"matching-post\">\n            <a href=\"".concat(result.slug, "\">\n                <h2>").concat(title.value, "</h2>\n                <p>").concat(body.value, "</p>\n            </a>\n        </div>\n    ");
};

var resultSet = function resultSet(set, response, options) {
  var hits = set.hits,
      index = set.index;
  var noData = options.noData,
      templates = options.templates,
      multi = options.algolia.multi;
  var innerHTML = "<p>".concat(noData, "</p>");
  var label = index;

  if (hits.length) {
    innerHTML = hits.map(function (result) {
      return templates.resultItem(result, response, options);
    }).join('');
  }

  if ((0, _utils.isObject)(multi)) {
    label = multi[index];
  }

  return "\n        <div class=\"matching-set\">\n            <h2 class=\"matching-set-heading\">".concat(label, "</h2>\n            ").concat(innerHTML, "\n        </div>\n    ");
};

var _default = {
  base: base,
  style: style,
  resultItem: resultItem,
  resultSet: resultSet
};
exports.default = _default;
},{"./utils":"utils.js"}],"index.js":[function(require,module,exports) {
"use strict";

var _algoliasearch = _interopRequireDefault(require("algoliasearch"));

var _deepmerge = _interopRequireDefault(require("deepmerge"));

var _component = require("./component");

var _utils = require("./utils");

var _render = _interopRequireDefault(require("./render"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var DEFAULT_CONFIG = {
  placeholder: 'Type to search',
  noData: 'No Results!',
  hideOtherSidebarContent: false,
  namespace: undefined,
  templates: {
    base: _render.default.base,
    style: _render.default.style,
    resultItem: _render.default.resultItem,
    resultSet: _render.default.resultSet
  },
  algolia: {
    multi: undefined,
    token: undefined,
    appId: undefined,
    indexes: undefined,
    defaultIndex: undefined,
    indexMap: {},
    currentIndex: function currentIndex() {
      return this.defaultIndex;
    }
  }
};
var CONFIG;

var install = function install(hook, vm) {
  var opts = vm.config.search; // Merge user options with default

  if ((0, _utils.isObject)(opts)) {
    CONFIG = (0, _deepmerge.default)(DEFAULT_CONFIG, opts);
  } else {
    CONFIG = DEFAUlT_CONFIG;
  } // Set up algolia client


  CONFIG.algolia.client = (0, _algoliasearch.default)(CONFIG.algolia.appId, CONFIG.algolia.token); // Create search client and configure indexes if necessary

  if ((0, _utils.isArray)(CONFIG.algolia.indexes)) {
    CONFIG.algolia.indexes.forEach(function (index) {
      if ((0, _utils.isObject)(index)) {
        var client = CONFIG.algolia.client.initIndex(index.index);
        client.setSettings(index.settings);
        CONFIG.algolia.indexMap[index.index] = client;
      } else {
        var _client = CONFIG.algolia.client.initIndex(index);

        CONFIG.algolia.indexMap[index] = _client;
      }
    });
  } else if ((0, _utils.isObject)(CONFIG.algolia.indexes)) {
    var index = CONFIG.algolia.indexes;
    var client = CONFIG.algolia.client.initIndex(index.index);
    client.setSettings(index.settings);
    CONFIG.algolia.indexMap[index.index] = client;
  } else if ((0, _utils.isString)(CONFIG.algolia.indexes)) {
    var _index = CONFIG.algolia.indexes;

    var _client2 = CONFIG.algolia.client.initIndex(_index);

    CONFIG.algolia.indexMap[_index] = _client2;
  } else {
    console.error('Invalid configuration');
    return;
  }

  hook.mounted(function () {
    (0, _component.init)(CONFIG, vm);
  });
  hook.doneEach(function () {
    (0, _component.update)(CONFIG, vm);
  });
  window.DocsifyAlgoliaSearchPlugin = {
    config: CONFIG
  };
};

$docsify.plugins = [].concat(install, $docsify.plugins);
},{"algoliasearch":"../node_modules/algoliasearch/src/browser/builds/algoliasearch.js","deepmerge":"../node_modules/deepmerge/dist/umd.js","./component":"component.js","./utils":"utils.js","./render":"render.js"}],"../../../../.nvm/versions/node/v10.15.3/lib/node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
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
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "61115" + '/');

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
      } else {
        window.location.reload();
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
},{}]},{},["../../../../.nvm/versions/node/v10.15.3/lib/node_modules/parcel-bundler/src/builtins/hmr-runtime.js","index.js"], null)
//# sourceMappingURL=/index.js.map