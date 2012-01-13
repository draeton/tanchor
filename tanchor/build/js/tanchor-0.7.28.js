// ## Tanchor - A URL parsing utility
//
// [http://draeton.github.com/tanchor](http://draeton.github.com/tanchor)
//
// Copyright 2012, Matthew Cobbs
// MIT licensed
/*global*/
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
    var args = Array.prototype.slice.call(arguments, 2), i;

    for (i in o2) {
      if (o2.hasOwnProperty(i)) {
        o[i] = o2[i];
      }
    }

    if (args.length) {
      args.unshift(o);
      extend.apply(this, args);
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
  var stringify = function (key, val, eq, sep) {
    var s = "", i, l;

    if (isArray(val)) {
      for (i = 0, l = val.length; i < l; i++) {
        s += sep + key + eq + val[i];
      }
    } else {
      s += sep + key + eq + val;
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

  // ## Private Methods
  var privateMethods = {
    // ### toObject_
    //
    // turn a search or hash into an object
    toObject_: function (type) {
      var str, eq, sep, list,  map, i, l, pair;

      if (type === "search") {
        str = this.search.replace(/^\?/, "");
        eq = this.seq;
        sep = this.ssp;
      } else {
        str = this.hash.replace(/^\#/, "");
        eq = this.heq;
        sep = this.hsp;
      }

      list = str.split(sep);
      map = {};

      for (i = 0, l = list.length; i < l; i++) {
        pair = list[i].split(eq);
        append(map, pair[0], pair[1]);
      }

      return map;
    },

    // ### toString_
    //
    // turn an object into a str for search or hash
    toString_: function (type, map) {
      var str = "", eq, sep, i;

      if (type === "search") {
        eq = this.seq;
        sep = this.ssp;
      } else {
        eq = this.heq;
        sep = this.hsp;
      }

      for (i in map) {
        if (map.hasOwnProperty(i)) {
          str += stringify(i, map[i], eq, sep);
        }
      }

      return str.replace(new RegExp("^\\" + sep), "");
    },

    // ### getUrlVars_
    //
    // get search and hash vars
    getUrlVars_: function (type) {
      var vars;

      if (this.cache_.hasOwnProperty(this.href)) {
        vars = this.cache_[this.href];
      } else {
        vars = {
          search: this.toObject_("search"),
          hash: this.toObject_("hash")
        };
      }

      this.cache_[this.href] = vars;
      return type ? vars[type] : vars;
    },

    // ### setUrlVars_
    //
    // set search and hash vars
    setUrlVars_: function (type, map) {
      var vars = this.getUrlVars_(type),
          i;

      for (i in map) {
        if (map.hasOwnProperty(i)) {
          update(vars, i, map[i]);
        }
      }

      return this.toString_(type, vars);
    }
  };

  // ## Public Interface
  var publicMethods = {

    // ### getSearchVars
    //
    // returns a key-value object with the parameters in the URL search
    getSearchVars: function () {
      return this.getUrlVars_("search");
    },

    // ### getHashVars
    //
    // returns a key-value object with the parameters in the URL hash
    getHashVars: function () {
      return this.getUrlVars_("hash");
    },

    // ### setSearchVars
    //
    // sets parameters using a key-value object in the URL search; returns this
    setSearchVars: function (map) {
      this.search = this.setUrlVars_("search", map);
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
      this.hash = this.setUrlVars_("hash", map);
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
  var Anchor = function (href, /* optional */ searchEq, searchSep, hashEq, hashSep) {
    this.href = href;

    if (typeof href === "undefined") {
      throw new Error("The href argument must be defined.");
    }

    this.seq = searchEq  || "=";
    this.ssp = searchSep || "&";
    this.heq = hashEq    || "=";
    this.hsp = hashSep   || "&";

    // URL variable cache
    this.cache_ = {};
  };

  Anchor.prototype = extend(anchor, privateMethods, publicMethods);

  // **return factory**
  return function (href, searchEq, searchSep, hashEq, hashSep) {
    return new Anchor(href, searchEq, searchSep, hashEq, hashSep);
  };

})(window, document);