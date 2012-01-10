// ## Tanchor - A URL parsing utility
//
// [http://draeton.github.com/tanchor](http://draeton.github.com/tanchor)
//
// Copyright 2012, Matthew Cobbs
// MIT licensed
//
// ### Usage:
//
//     var a = new Anchor("http://www.example.com?fruit=banana&pie=apple#page=1");
//     a.href;   // "http://www.example.com?fruit=banana&pie=apple#page=1";
//     a.search; // "?fruit=banana&pie=apple"
//     a.hash;   // "#page=1"
//
//     a.getSearchVars(); // {"fruit": "banana", "pie": "apple"}
//     a.getHashVars();   // {"page": "1"}
//
//     a.setSearchVars({fruit: "pear", type: "test"});
//     a.href; // "http://www.example.com/?fruit=pear&pie=apple&type=test#page=1"
//
//     a.setHashVars({page: 2});
//     a.href; // "http://www.example.com/?fruit=pear&pie=apple&type=test#page=2"
//
//     a.setSearchVar("type", "live");
//     a.href; // "http://www.example.com/?fruit=pear&pie=apple&type=live#page=2"
//
//     a.setHashVar("page", 3);
//     a.href; // "http://www.example.com/?fruit=pear&pie=apple&type=live#page=3"
//
//     a.delSearchVar("type");
//     a.href; // "http://www.example.com/?fruit=pear&pie=apple#page=3"
//
//     a.delHashVar("page");
//     a.href; // "http://www.example.com/?fruit=pear&pie=apple#"
//
var Tanchor = (function (window, document, undefined) {

  "use strict";

  var anchor = document.createElement("a");

  // **type check**
  var isObject = function (o) {
    return typeof o === "object" && o !== null;
  };

  var isArray = function (o) {
    return Object.prototype.toString.call(o) === "[object Array]";
  };

  // **object extend**
  var extend = function (o, o2) {
    var i;

    for (i in o2) {
      if (o2.hasOwnProperty(i)) {
        o[i] = o2[i];
      }
    }

    return o;
  };

  // **append a key-value pair to an object**
  var append = function (o, key, val) {
    if (isObject(o) && o.hasOwnProperty(key)) {
      if (isArray(o[key])) {
        o[key].push(val);
      } else {
        o[key] = [o[key], val];
      }
    } else {
      o[key] = val;
    }
  };

  // **turn a key value pair into a string**
  var stringify = function (key, val) {
    var s = "", i, l;

    if (isArray(val)) {
      for (i = 0, l = val.length; i < l; i++) {
        s += "&" + key + "=" + val[i];
      }
    } else {
      s += "&" + key + "=" + val;
    }

    return s;
  };

  // **update the value of a key**
  var update = function (o, key, val) {
    if (isObject(o)) {
      if (val === undefined) {
        delete o[key];
      } else {
        o[key] = val;
      }
    }
  };

  // **turn a search or hash into an object**
  var toObject = function (s) {
    var list = s && s.split("&") || [],
        o = {}, i, l, pair;

    for (i = 0, l = list.length; i < l; i++) {
      pair = list[i].split("=");
      append(o, pair[0], pair[1]);
    }

    return o;
  };

  // **turn an object into a str for search or hash**
  var toString = function (o) {
    var s = "", i;

    for (i in o) {
      if (o.hasOwnProperty(i)) {
        s += stringify(i, o[i]);
      }
    }

    return s.replace(/^\&/, "");
  };

  // **cache**
  var cache = {};

  // **get search and hash vars**
  var getUrlVars = function (type) {
    var vars;

    if (cache.hasOwnProperty(this.href)) {
      vars = cache[this.href];
    } else {
      vars = {
        search: toObject(this.search.replace(/^\?/, "")),
        hash: toObject(this.hash.replace(/^\#/, ""))
      };
    }

    cache[this.href] = vars;
    return type ? vars[type] : vars;
  };

  // **set search and hash vars**
  var setUrlVars = function (type, map) {
    var vars = getUrlVars.call(this, type),
        i;

    for (i in map) {
      if (map.hasOwnProperty(i)) {
        update(vars, i, map[i]);
      }
    }

    return toString(vars);
  };

  // ## Public Interface
  var methods = {

    // ### getSearchVars
    //
    // returns a key-value object with the parameters in the URL search
    getSearchVars: function () {
      return getUrlVars.call(this, "search");
    },

    // ### getHashVars
    //
    // returns a key-value object with the parameters in the URL hash
    getHashVars: function () {
      return getUrlVars.call(this, "hash");
    },

    // ### setSearchVars
    //
    // sets parameters using a key-value object in the URL search; returns this
    setSearchVars: function (map) {
      this.search = setUrlVars.call(this, "search", map);
      return this;
    },

    // ### setSearchVar
    //
    // sets the key parameter to val in the URL search; returns this
    setSearchVar: function (key, val) {
      var o = {};
      o[key] = val;
      return this.setSearchVars(o);
    },

    // ### setHashVars
    //
    // sets parameters using a key-value object in the URL hash; returns this
    setHashVars: function (map) {
      this.hash = setUrlVars.call(this, "hash", map);
      return this;
    },

    // ### setHashVar
    //
    // sets the key parameter to val in the URL hash; returns this
    setHashVar: function (key, val) {
      var o = {};
      o[key] = val;
      return this.setHashVars(o);
    },

    // ### delSearchVar
    //
    // deletes the key parameter from the URL search; returns this
    delSearchVar: function (key) {
      return this.setSearchVar(key);
    },

    // ### delHashVar
    //
    // deletes the key parameter from the URL hash; returns this
    delHashVar: function (key) {
      return this.setHashVar(key);
    }

  };

  // **constructor and prototype**
  var Anchor = function (href) {
    this.href = href;
  };

  Anchor.prototype = extend(anchor, methods);

  // **return factory**
  return function (href) {
    return new Anchor(href);
  };

})(window, document);