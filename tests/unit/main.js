(function (window, undefined) {

    "use strict";

    var document = window.document;
    var location = window.location;

    var DEFAULT_URL = "http://www.example.com/?fruit=banana&pie=apple#fruit=banana&pie=apple";


    module("Tanchor", {
        teardown: window.moduleTeardown
    });


    test("Dependencies", 1, function () {
        ok(Tanchor, "Tanchor exists.");
    });


    test("Initialization", 4, function () {
        var t;

        raises(function () {
                t = new Tanchor()
            }, "No arguments raises exception.");

        raises(function () {
                t = new Tanchor("")
            }, "Empty string href raises exception because behavior is unpredictable.");

        t = new Tanchor(DEFAULT_URL);
        equal(t.href(), DEFAULT_URL, "Full path is returned when used as first argument.");

        t = new Tanchor("http://google.com");
        equal(t.hostname(), "google.com", "Absolute URL produces absolute link.");
    });

    test("Partial URLs", 5, function () {
        var t;

        t = new Tanchor("/testing/tests");
        ok(/testing\/tests$/.test(t.pathname()), "Relative path with root");

        t = new Tanchor("test.htm");
        ok(/test\.htm$/.test(t.pathname()), "Relative path without root");

        t = new Tanchor("?test=test");
        ok(/^\?test=test$/.test(t.search()), "Search only");

        t = new Tanchor("#test");
        ok(/^\#test$/.test(t.hash()), "Hash only");

        t = new Tanchor("//google.com");
        equal(t.protocol(), location.protocol, "Protocol-relative");
    })


    test("t.anchor OR t.a", 2, function () {
        var t;

        t = new Tanchor(DEFAULT_URL);
        equal(t.anchor.tagName, "A", "t.anchor references an Anchor Element.");
        equal(t.anchor, t.a, "t.a is a shortcut for t.anchor.");
    });


    test("Custom operators", 2, function () {
        var t;

        t = new Tanchor(DEFAULT_URL);
        equal(t.seq+t.ssp+t.heq+t.hsp, "=&=&", "Default equality and separator values are =, &, =, &");

        t = new Tanchor(DEFAULT_URL, ":", "/", "-", "|");
        equal(t.seq+t.ssp+t.heq+t.hsp, ":/-|", "Equality and separator values are :, /, -, |");
    });


    test("Functions like native anchor", function () {
        var props = ["href", "protocol", "host", "hostname", "port", "pathname", "search", "hash"];
        var i = 0;
        var prop;

        expect(props.length);

        var t = new Tanchor(DEFAULT_URL);

        var a = document.createElement("a");
        a.href = DEFAULT_URL;

        while (prop = props[i++]) {
            equal(t[prop](), a[prop], "t." + prop + "() equals a." + prop);
        }
    });


    test("getSearchVars()", 6, function () {
        var t, v, expected;

        t = new Tanchor("http://www.example.com/");
        v = t.getSearchVars();
        expected = {};
        equal(JSON.stringify(v), JSON.stringify(expected), "Empty object");

        t = new Tanchor(DEFAULT_URL);
        v = t.getSearchVars();
        expected = {"fruit": "banana", "pie": "apple"};
        equal(JSON.stringify(v), JSON.stringify(expected), "Simple map of keys and values");

        t = new Tanchor("http://www.example.com/?fruit=banana&fruit=pear&pie=apple#fruit=banana&pie=apple");
        v = t.getSearchVars();
        expected = {"fruit": ["banana", "pear"], "pie": "apple"};
        equal(JSON.stringify(v.fruit), JSON.stringify(expected.fruit), "Array for duplicate parameters");

        t = new Tanchor("http://www.example.com/?fruit&pie=apple#fruit=banana&pie=apple");
        v = t.getSearchVars();
        ok(v.hasOwnProperty("fruit"), "Undefined value in object for key-only parameter");
        equal(v.fruit, undefined, "Undefined value in object for key-only parameter");

        t = new Tanchor("http://www.example.com/?fruit:banana/pie:apple#fruit:banana/pie:apple", ":", "/");
        v = t.getSearchVars();
        expected = {"fruit": "banana", "pie": "apple"};
        equal(JSON.stringify(v), JSON.stringify(expected), "Custom operators: Simple map of keys and values");
    });


    test("getHashVars()", 6, function () {
        var t, v, expected;

        t = new Tanchor("http://www.example.com/");
        v = t.getHashVars();
        expected = {};
        equal(JSON.stringify(v), JSON.stringify(expected), "Empty object");

        t = new Tanchor(DEFAULT_URL);
        v = t.getHashVars();
        expected = {"fruit": "banana", "pie": "apple"};
        equal(JSON.stringify(v), JSON.stringify(expected), "Simple map of keys and values");

        t = new Tanchor("http://www.example.com/?fruit=banana&pie=apple#fruit=banana&fruit=pear&pie=apple");
        v = t.getHashVars();
        expected = {"fruit": ["banana", "pear"], "pie": "apple"};
        equal(JSON.stringify(v.fruit), JSON.stringify(expected.fruit), "Array for duplicate parameters");

        t = new Tanchor("http://www.example.com/?fruit=banana&pie=apple#fruit&pie=apple");
        v = t.getHashVars();
        ok(v.hasOwnProperty("fruit"), "Undefined value in object for key-only parameter");
        equal(v.fruit, undefined, "Undefined value in object for key-only parameter");

        t = new Tanchor("http://www.example.com/?fruit:banana/pie:apple#fruit:banana/pie:apple", null, null, ":", "/");
        v = t.getHashVars();
        expected = {"fruit": "banana", "pie": "apple"};
        equal(JSON.stringify(v), JSON.stringify(expected), "Custom operators: Simple map of keys and values");
    });


    test("setSearchVars()", 3, function () {
        var t, v, expected;

        t = new Tanchor(DEFAULT_URL);
        t.setSearchVars({"fruit": "pear"});
        expected = "http://www.example.com/?fruit=pear&pie=apple#fruit=banana&pie=apple";
        equal(t.href(), expected, "Object with existing property updates parameter");

        t = new Tanchor(DEFAULT_URL);
        t.setSearchVars({"type": "test"});
        expected = "http://www.example.com/?fruit=banana&pie=apple&type=test#fruit=banana&pie=apple";
        equal(t.href(), expected, "Object with new property adds parameter");

        t = new Tanchor(DEFAULT_URL);
        t.setSearchVars({"fruit": undefined});
        expected = "http://www.example.com/?pie=apple#fruit=banana&pie=apple";
        equal(t.href(), expected, "Object with undefined property deletes parameter");
    });


    test("setHashVars()", 3, function () {
        var t, v, expected;

        t = new Tanchor(DEFAULT_URL);
        t.setHashVars({"fruit": "pear"});
        expected = "http://www.example.com/?fruit=banana&pie=apple#fruit=pear&pie=apple";
        equal(t.href(), expected, "Object with existing property updates parameter");

        t = new Tanchor(DEFAULT_URL);
        t.setHashVars({"type": "test"});
        expected = "http://www.example.com/?fruit=banana&pie=apple#fruit=banana&pie=apple&type=test";
        equal(t.href(), expected, "Object with new property adds parameter");

        t = new Tanchor(DEFAULT_URL);
        t.setHashVars({"fruit": undefined});
        expected = "http://www.example.com/?fruit=banana&pie=apple#pie=apple";
        equal(t.href(), expected, "Object with undefined property deletes parameter");
    });


    test("setSearchVar()", 3, function () {
        var t, v, expected;

        t = new Tanchor(DEFAULT_URL);
        t.setSearchVar("fruit", "pear");
        expected = "http://www.example.com/?fruit=pear&pie=apple#fruit=banana&pie=apple";
        equal(t.href(), expected, "Existing key updates parameter");

        t = new Tanchor(DEFAULT_URL);
        t.setSearchVar("type", "test");
        expected = "http://www.example.com/?fruit=banana&pie=apple&type=test#fruit=banana&pie=apple";
        equal(t.href(), expected, "New key adds parameter");

        t = new Tanchor(DEFAULT_URL);
        t.setSearchVar("fruit");
        expected = "http://www.example.com/?pie=apple#fruit=banana&pie=apple";
        equal(t.href(), expected, "Key undefined value deletes parameter");
    });


    test("setHashVar()", 3, function () {
        var t, v, expected;

        t = new Tanchor(DEFAULT_URL);
        t.setHashVar("fruit", "pear");
        expected = "http://www.example.com/?fruit=banana&pie=apple#fruit=pear&pie=apple";
        equal(t.href(), expected, "Existing key updates parameter");

        t = new Tanchor(DEFAULT_URL);
        t.setHashVar("type", "test");
        expected = "http://www.example.com/?fruit=banana&pie=apple#fruit=banana&pie=apple&type=test";
        equal(t.href(), expected, "New key adds parameter");

        t = new Tanchor(DEFAULT_URL);
        t.setHashVar("fruit");
        expected = "http://www.example.com/?fruit=banana&pie=apple#pie=apple";
        equal(t.href(), expected, "Key undefined value deletes parameter");

    });


    test("delSearchVar()", 1, function () {
        var t, v, expected;

        t = new Tanchor(DEFAULT_URL);
        t.delSearchVar("fruit");
        expected = "http://www.example.com/?pie=apple#fruit=banana&pie=apple";
        equal(t.href(), expected, "Deletes parameter");

    });


    test("delHashVar()", 1, function () {
        var t, v, expected;

        t = new Tanchor(DEFAULT_URL);
        t.delHashVar("fruit");
        expected = "http://www.example.com/?fruit=banana&pie=apple#pie=apple";
        equal(t.href(), expected, "Key undefined value deletes parameter");
    });


})(window);