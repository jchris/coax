# coax

Couch client using pax for path currying and request for HTTP.

[![Build Status](https://travis-ci.org/jchris/coax.png?branch=master)](https://travis-ci.org/jchris/coax)

## Getting Started
Install the module with: `npm install coax`

### Example code illustrating URL currying

```javascript
var server = coax("http://server.com")

// just for example
var database = server("my-database")


database.get(function(error, data){
   // did a get to http://server.com/my-database
})

database.get("foobar", function(error, data){
   // did a get to http://server.com/my-database/foobar
})

// note the array
database.get(["foobar", "baz"], function(error, data){
   // did a get to http://server.com/my-database/foobar/baz
})

// still an array, with query options
database.get(["foobar", "baz", {"x" : "y"}], function(error, data){
   // did a get to http://server.com/my-database/foobar/baz?x=y
})

// also we can curry it again
var doc  = database(["foobar","baz"])
doc.get(function(error, data){
   // did a get to http://server.com/my-database/foobar/baz
})

```


See [hoax](https://github.com/jchris/hoax) for documentation. Coax is like hoax, but with some Couch-specific things (like JSON encoding key / startkey / endkey).

## License
Copyright (c) 2013 Chris Anderson
Licensed under the Apache license.
