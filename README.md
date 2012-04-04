# Coux, pronounced "Couch"

Coux is the least amount of CouchDB client I can imagine. It doesn't do much, but it is relaxing.

## Usage

The only thing worth noting is that for coux, arrays are a perfectly good way to specify paths. And it'll do the URL encoding for you. Oh and lately I've noticed it's more general that Couch. Mikeal tells me it's almost just a config mode to request. See TODOs.

```javascript
var db = "http://jchris.iriscouch.com/foobar";

// Get database info:
coux(db, function(err, info) {
  console.log(info)
})

// Get a document:
coux([db, "mydocid"], function(err, doc) {
  console.log(doc)
  // Update a document:
  doc.updated_by = "yours truly";
  coux.put([db, "mydocid"], doc, function(err, ok) {
    console.log(ok)
  })
})

// Create a document letting the server assign the id:
var newDoc = {foo : "bar"};
coux.post(db, , function(err, ok) {
  console.log(ok)
  
  // Delete a document without sending the doc body
  coux.del([db, ok.id, {rev : ok.rev}], function(err, ok) {
    console.log(ok);
  })
})


```
## TODOs

Make it into like no code just a basic request config.

Enjoy!