// ## Tanchor - The (anchor) URL parsing library
// 
// [http://draeton.github.com/tanchor](http://draeton.github.com/tanchor)
//
// Copyright 2011, Matthew Cobbs  
// Licensed under the MIT license.
//
/*global jQuery*/
(function (window) {
    
    "use strict";

    var document = window.document;
    
    // ## String prototype helper methods

    // Trim whitespace from the end of the string
    //     @param {String} c An optional additional character to remove
    //     @return {String}
    if (!String.prototype.trimEnd) {
        String.prototype.trimEnd = function (c) {
            if (c) {
                return this.replace(new RegExp(c.escapeRegExp() + "*$"), '');
            }
            return this.replace(/\s+$/, '');
        };
    }
    
    // Trim whitespace from the start of the string
    //     @param {String} c An optional additional character to remove
    //     @return {String}
    if (!String.prototype.trimStart) {
        String.prototype.trimStart = function (c) {
            if (c) {
                return this.replace(new RegExp("^" + c.escapeRegExp() + "*"), '');
            }
            return this.replace(/^\s+/, '');
        };
    }
    
    // Escape special characters in a string
    //     @return {String}
    if (!String.prototype.escapeRegExp) {
        String.prototype.escapeRegExp = function () {
            return this.replace(/[.*+?^${}()|[\]\/\\]/g, "\\$0");
        };
    }
    
    // ## Tanchor constructor
    // 
    // Use an anchor to parse a url
    //     @param {String} url The url to parse
    //     @return {Tanchor} An object with url components
    function Tanchor (url) {
        var isViewSource, a;

        /* remove view-source */
        isViewSource = /^view-source/.test(url);
        if (isViewSource) {
            url = url.replace(/^view-source:/, '');
        }

        /* create element */
        a = document.createElement("a");
        a.href = url;

        /* set properties */
        this.protocol   = a.protocol;
        this.host       = a.host;
        this.pathname   = a.pathname;
        this.search     = a.search;
        this.hash       = a.hash;
        this.viewsource = isViewSource;

        a = null;
        return this;
    }
    
    // ## Tanchor prototype
    //
    // *Methods:*
    //     {String} toString,
    //     {String|Null} getSearchVal,
    //     {String|Null} getHashVal,
    //     {Void} setSearchVal,
    //     {Void} setHashVal
    Tanchor.prototype = (function () {

        // ### toString
        // 
        // Make a url from a Tanchor object
        //     @return {String} the url
        function toString () {
            var search, hash, str;

            /* prepend ? to query string, if necessary */
            search = ( (this.search && !/^\?/.test(this.search)) ? '?' : '' ) + this.search;

            /* prepend # to hash if necessary */
            hash   = ( (this.hash   && !/^\#/.test(this.hash))   ? '#' : '' ) + this.hash;

            /* make the url */
            str = this.protocol + '//' + this.host + this.pathname + search + hash;

            if (this.viewsource) {
                str = 'view-source:' + str;
            }

            return str;
        }

        // ### *getUrlValueGetter*
        // 
        // Used as curry function for search or hash value getter
        //     @param {String} type Either "search" or "hash"
        function getUrlValueGetter (type) {

            /* start character for regexp */
            var char0 = (type === "search") ? "?" : "#";

            // Get the key value of a url search or hash
            //     @param {String} key
            //     @return {String} The value
            return function (key) {
                var re, test, result;

                /* test for the key and optional value */
                re = new RegExp("[" + char0 + "|&]" + key + "(=.*?)?&");
                test = re.test(this[type] + "&");

                /* if there is key and value, result = value
                   if there is only key, result = ""
                   if no key or value, result = null */
                if (test) {
                    if (RegExp.$1 !== "") {
                        result = RegExp.$1.trimStart("=");
                    } else {
                        result = "";
                    }
                } else {
                    result = null;
                }

                /* if we have a result, decode the string */
                if (result) {
                    result = decodeURIComponent(result.replace("+", " "));
                }

                return result;
            };
        }

        // ### *getUrlValueSetter*
        // 
        // Used as curry function for search or hash value setter
        //     @param {String} type Either "search" or "hash"
        function getUrlValueSetter (type) {

            /* start character for regexp */
            var char0 = (type === "search") ? "?" : "#";

            // Set the key value of a url search or hash
            //     @param {String} key
            //     @param {String} value The new value
            //     @praam {Boolean} doRemoveBlank If true, remove the key on value === ""
            //     @return {Void}
            return function (key, value, doRemoveBlank) {
                var q, re;
                
                /* account for undefined */
                value = typeof value === "undefined" ? "" : value;

                /* test for the key */
                q = this[type] + "&";
                re = new RegExp("[" + char0 + "|&]" + key + "(=.*?)?&");

                /* if doRemoveBlank and no value, remove key */
                if (doRemoveBlank && value === "") {
                    q = q.replace(re, "");
                }

                /* if no key, add to the end
                   if key, replace value */
                if (!re.test(q)) {
                    q = q + key + "=" + encodeURIComponent(value);
                } else {
                    q = q.replace(re, "&" + key + "=" + encodeURIComponent(value) + "&");
                }

                /* trim extra ampersands and add first char */
                this[type] = char0 + q.trimStart("&").trimEnd("&");
            };
        }
        
        // **Tanchor.prototype public interface
        return {            
            toString     : toString,
            getSearchVal : getUrlValueGetter("search"),
            getHashVal   : getUrlValueGetter("hash"),
            setSearchVal : getUrlValueSetter("search"),
            setHashVal   : getUrlValueSetter("hash")
        };
        
    })();
    
    // **set global reference**
    window.Tanchor = Tanchor

})(window);