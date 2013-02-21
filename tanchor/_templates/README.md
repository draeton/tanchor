## Tanchor

[Tanchor](http://draeton.github.com/tanchor/) is a small utility library for working with URLs using the DOM's anchor element.
The current version is `@VERSION@`. Documentation is available
[here](http://draeton.github.com/tanchor/tanchor/docs/tanchor.html). Unit tests are available
[here](http://draeton.github.com/tanchor/tanchor/tests/).


## Implementation

Tanchor is a single-script utility.

    <script src="js/tanchor-@VERSION@-min.js"></script>


## Usage

    var a = new Tanchor("http://www.example.com?fruit=banana&pie=apple#page=1");
    a.href();   // "http://www.example.com?fruit=banana&pie=apple#page=1";
    a.search(); // "?fruit=banana&pie=apple"
    a.hash();   // "#page=1"

    a.getSearchVars(); // {"fruit": "banana", "pie": "apple"}
    a.getHashVars();   // {"page": "1"}

    a.setSearchVars({fruit: "pear", type: "test"});
    a.href(); // "http://www.example.com/?fruit=pear&pie=apple&type=test#page=1"

    a.setHashVars({page: 2});
    a.href(); // "http://www.example.com/?fruit=pear&pie=apple&type=test#page=2"

    a.setSearchVar("type", "live");
    a.href(); // "http://www.example.com/?fruit=pear&pie=apple&type=live#page=2"

    a.setHashVar("page", 3);
    a.href(); // "http://www.example.com/?fruit=pear&pie=apple&type=live#page=3"

    a.delSearchVar("type");
    a.href(); // "http://www.example.com/?fruit=pear&pie=apple#page=3"

    a.delHashVar("page");
    a.href(); // "http://www.example.com/?fruit=pear&pie=apple#"


## License

(The MIT License)

Copyright (c) 2013, <[Matthew Cobbs](mailto:draeton@gmail.com)>

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be included
in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.