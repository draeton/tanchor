---
layout: default
title: Tanchor - The (anchor) URL parsing library
---

<section id="main" role="main">

[Tanchor](http://github.com/draeton/tanchor/) is a small utility library for working with URLs using the DOM's anchor element.


## Implementation

Tanchor is a single-script utility.

{% highlight html %}
<script src="js/tanchor-0.8.31-min.js"></script>
{% endhighlight %}

Documentation is available [here](http://draeton.github.com/tanchor/tanchor/docs/tanchor.html). Unit tests are available
[here](http://draeton.github.com/tanchor/tanchor/tests/).


## Usage

{% highlight js %}
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
{% endhighlight %}


## Contributing

* [Fork the project.](https://github.com/draeton/tanchor)
* Read through the [outstanding issues or report new ones.](https://github.com/draeton/tanchor/issues)
* Write some tests to make sure we don't accidentally break each other's code.
* Send a pull request.


## License

[MIT](https://raw.github.com/draeton/tanchor/master/LICENSE)


## Download

The latest release, **0.8.31 is [available here](http://draeton.github.com/tanchor/tanchor/dist/tanchor-0.8.31.zip).**

You can download this project in either [zip](https://github.com/draeton/tanchor/zipball/master)
or [tar](https://github.com/draeton/tanchor/tarball/master) formats.

You can also clone the project with [Git](http://git-scm.com) by running:

    $ git clone git://github.com/draeton/tanchor

</section>