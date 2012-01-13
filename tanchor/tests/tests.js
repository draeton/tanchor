(function (window, undefined) {

    "use strict";

    var document = window.document;
    var location = window.location;

    var DEFAULT_URL = "http://www.example.com/?fruit=banana&pie=apple#fruit=banana&pie=apple";


    module("Tanchor");


    test("Dependencies", 1, function () {
        ok(Tanchor, "Deeplink exists.");
    });


    test("Initialization", 4, function () {
        var a;

        raises(function () {
                a = new Tanchor()
            }, Error, "No arguments raises exception.");

        a = new Tanchor("");
        equal(a.href, location.href, "Empty string produces window.location.href link");

        a = new Tanchor("/");
        equal(a.hostname, location.hostname, "Relative URL produces relative link.");

        a = new Tanchor("http://google.com");
        equal(a.hostname, "google.com", "Absolute URL produces absolute link.");
    });


    test("Custom operators", 2, function () {
        var a;

        a = new Tanchor("");
        equal(a.seq+a.ssp+a.heq+a.hsp, "=&=&", "Default equality and separator values are =, &, =, &");

        a = new Tanchor("", ":", "/", "-", "|");
        equal(a.seq+a.ssp+a.heq+a.hsp, ":/-|", "Equality and separator values are :, /, -, |");
    });


    test("Functions like native anchor", function () {
        var props = "href protocol host hostname port pathname search hash".split(" ");
        var i = 0;
        var prop;

        expect(props.length);

        var a = new Tanchor(DEFAULT_URL);

        var anchor = document.createElement("a");
        anchor.href = DEFAULT_URL;

        while (prop = props[i++]) {
            equal(a[prop], anchor[prop], "Property: " + prop);
        }
    });


    test("getSearchVars()", 6, function () {
        var a, v, expected;

        a = new Tanchor("http://www.example.com/");
        v = a.getSearchVars();
        expected = {};
        equal(JSON.stringify(v), JSON.stringify(expected), "Empty object");

        a = new Tanchor(DEFAULT_URL);
        v = a.getSearchVars();
        expected = {"fruit": "banana", "pie": "apple"};
        equal(JSON.stringify(v), JSON.stringify(expected), "Simple map of keys and values");

        a = new Tanchor("http://www.example.com/?fruit=banana&fruit=pear&pie=apple#fruit=banana&pie=apple");
        v = a.getSearchVars();
        expected = {"fruit": ["banana", "pear"], "pie": "apple"};
        equal(JSON.stringify(v.fruit), JSON.stringify(expected.fruit), "Array for duplicate parameters");

        a = new Tanchor("http://www.example.com/?fruit&pie=apple#fruit=banana&pie=apple");
        v = a.getSearchVars();
        ok(v.hasOwnProperty("fruit"), "Undefined value in object for key-only parameter");
        equal(v.fruit, undefined, "Undefined value in object for key-only parameter");

        a = new Tanchor("http://www.example.com/?fruit:banana/pie:apple#fruit:banana/pie:apple", ":", "/");
        v = a.getSearchVars();
        expected = {"fruit": "banana", "pie": "apple"};
        equal(JSON.stringify(v), JSON.stringify(expected), "Custom operators: Simple map of keys and values");
    });


    test("getHashVars()", 6, function () {
        var a, v, expected;

        a = new Tanchor("http://www.example.com/");
        v = a.getHashVars();
        expected = {};
        equal(JSON.stringify(v), JSON.stringify(expected), "Empty object");

        a = new Tanchor(DEFAULT_URL);
        v = a.getHashVars();
        expected = {"fruit": "banana", "pie": "apple"};
        equal(JSON.stringify(v), JSON.stringify(expected), "Simple map of keys and values");

        a = new Tanchor("http://www.example.com/?fruit=banana&pie=apple#fruit=banana&fruit=pear&pie=apple");
        v = a.getHashVars();
        expected = {"fruit": ["banana", "pear"], "pie": "apple"};
        equal(JSON.stringify(v.fruit), JSON.stringify(expected.fruit), "Array for duplicate parameters");

        a = new Tanchor("http://www.example.com/?fruit=banana&pie=apple#fruit&pie=apple");
        v = a.getHashVars();
        ok(v.hasOwnProperty("fruit"), "Undefined value in object for key-only parameter");
        equal(v.fruit, undefined, "Undefined value in object for key-only parameter");

        a = new Tanchor("http://www.example.com/?fruit:banana/pie:apple#fruit:banana/pie:apple", null, null, ":", "/");
        v = a.getHashVars();
        expected = {"fruit": "banana", "pie": "apple"};
        equal(JSON.stringify(v), JSON.stringify(expected), "Custom operators: Simple map of keys and values");
    });


    test("setSearchVars()", 3, function () {
        var a, v, expected;

        a = new Tanchor(DEFAULT_URL);
        a.setSearchVars({"fruit": "pear"});
        expected = "http://www.example.com/?fruit=pear&pie=apple#fruit=banana&pie=apple";
        equal(a.href, expected, "Object with existing property updates parameter");

        a = new Tanchor(DEFAULT_URL);
        a.setSearchVars({"type": "test"});
        expected = "http://www.example.com/?fruit=banana&pie=apple&type=test#fruit=banana&pie=apple";
        equal(a.href, expected, "Object with new property adds parameter");

        a = new Tanchor(DEFAULT_URL);
        a.setSearchVars({"fruit": undefined});
        expected = "http://www.example.com/?pie=apple#fruit=banana&pie=apple";
        equal(a.href, expected, "Object with undefined property deletes parameter");
    });


    test("setHashVars()", 3, function () {
        var a, v, expected;

        a = new Tanchor(DEFAULT_URL);
        a.setHashVars({"fruit": "pear"});
        expected = "http://www.example.com/?fruit=banana&pie=apple#fruit=pear&pie=apple";
        equal(a.href, expected, "Object with existing property updates parameter");

        a = new Tanchor(DEFAULT_URL);
        a.setHashVars({"type": "test"});
        expected = "http://www.example.com/?fruit=banana&pie=apple#fruit=banana&pie=apple&type=test";
        equal(a.href, expected, "Object with new property adds parameter");

        a = new Tanchor(DEFAULT_URL);
        a.setHashVars({"fruit": undefined});
        expected = "http://www.example.com/?fruit=banana&pie=apple#pie=apple";
        equal(a.href, expected, "Object with undefined property deletes parameter");
    });


    test("setSearchVar()", 3, function () {
        var a, v, expected;

        a = new Tanchor(DEFAULT_URL);
        a.setSearchVar("fruit", "pear");
        expected = "http://www.example.com/?fruit=pear&pie=apple#fruit=banana&pie=apple";
        equal(a.href, expected, "Existing key updates parameter");

        a = new Tanchor(DEFAULT_URL);
        a.setSearchVar("type", "test");
        expected = "http://www.example.com/?fruit=banana&pie=apple&type=test#fruit=banana&pie=apple";
        equal(a.href, expected, "New key adds parameter");

        a = new Tanchor(DEFAULT_URL);
        a.setSearchVar("fruit");
        expected = "http://www.example.com/?pie=apple#fruit=banana&pie=apple";
        equal(a.href, expected, "Key undefined value deletes parameter");
    });


    test("setHashVar()", 3, function () {
        var a, v, expected;

        a = new Tanchor(DEFAULT_URL);
        a.setHashVar("fruit", "pear");
        expected = "http://www.example.com/?fruit=banana&pie=apple#fruit=pear&pie=apple";
        equal(a.href, expected, "Existing key updates parameter");

        a = new Tanchor(DEFAULT_URL);
        a.setHashVar("type", "test");
        expected = "http://www.example.com/?fruit=banana&pie=apple#fruit=banana&pie=apple&type=test";
        equal(a.href, expected, "New key adds parameter");

        a = new Tanchor(DEFAULT_URL);
        a.setHashVar("fruit");
        expected = "http://www.example.com/?fruit=banana&pie=apple#pie=apple";
        equal(a.href, expected, "Key undefined value deletes parameter");

    });


    test("delSearchVar()", 1, function () {
        var a, v, expected;

        a = new Tanchor(DEFAULT_URL);
        a.delSearchVar("fruit");
        expected = "http://www.example.com/?pie=apple#fruit=banana&pie=apple";
        equal(a.href, expected, "Deletes parameter");

    });


    test("delHashVar()", 1, function () {
        var a, v, expected;

        a = new Tanchor(DEFAULT_URL);
        a.delHashVar("fruit");
        expected = "http://www.example.com/?fruit=banana&pie=apple#pie=apple";
        equal(a.href, expected, "Key undefined value deletes parameter");
    });


})(window);