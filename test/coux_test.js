var coux = require('../lib/coux.js'),
  request = require("request");

var http = require("http"), url = require("url");

var handlers = {};

var testServer = function() {
  http.createServer(function(req, res){
    // your custom error-handling logic:
    function error(status, err) {
      res.statusCode = status || 500;
      res.end(err.toString());
    }
    var path = url.parse(req.url).pathname;
    console.log("test server", req.method, path);
    if (handlers[path]) {
      handlers[path](req, res);
    } else {
      error(404, "no handler for "+path);
    }
  }).listen(3001);
};

testServer();

exports['/awesome'] = {
  setUp: function(done) {
    // setup here
    handlers['/awesome'] = function(req, res) {
      res.statusCode = 200;
      res.end(JSON.stringify({awesome:true}));
    };
    handlers['/very/awesome'] = function(req, res) {
      res.statusCode = 200;
      res.end(JSON.stringify({awesome:true, method : req.method}));
    };
    done();
  },
  '200 get': function(test) {
    test.expect(2);
    // tests here
    coux("http://localhost:3001/awesome", function(err, json){
      // console.log(ok.statusCode, body);
      test.equal(err, null);
      test.equal(json.awesome, true, 'should be awesome.');
      test.done();
    });
  },
  '200 array' : function(test) {
    // test.expect()
    coux(["http://localhost:3001/","very","awesome"], function(err, json){
      test.equal(err, null);
      test.equal(json.awesome, true, 'should be awesome.');
      test.equal(json.method, 'GET', 'should be get.');
      test.done();
    });
  },
  '200 put' : function(test) {
    // test.expect()
    coux.put("http://localhost:3001/very/awesome", function(err, json){
      test.equal(err, null);
      test.equal(json.awesome, true, 'should be awesome.');
      test.equal(json.method, 'PUT', 'should be put.');
      test.done();
    });
  },
  '200 array put' : function(test) {
    // test.expect()
    coux.put(["http://localhost:3001/","very","awesome"], function(err, json){
      test.equal(err, null);
      test.equal(json.awesome, true, 'should be awesome.');
      test.equal(json.method, 'PUT', 'should be put.');
      test.done();
    });
  },
  '200 post' : function(test) {
    test.expect(3);
    coux.post("http://localhost:3001/very/awesome", function(err, json){
      test.equal(err, null);
      test.equal(json.awesome, true, 'should be awesome.');
      test.equal(json.method, 'POST', 'should be put.');
      test.done();
    });
  },
  '200 array curry' : function(test) {
    // test.expect()
    var host = coux("http://localhost:3001/"),
      resource = host(["very","awesome"]);
    resource("", function(err, json){
      test.equal(err, null);
      test.equal(json.awesome, true, 'should be awesome.');
      test.equal(json.method, 'GET', 'should be get.');
      test.done();
    });
  },
  '200 array curry put' : function(test) {
    // test.expect()
    var host = coux("http://localhost:3001/"),
      resource = host(["very","awesome"]);
    resource.put("", function(err, json){
      test.equal(err, null);
      test.equal(json.awesome, true, 'should be awesome.');
      test.equal(json.method, 'PUT', 'should be put.');
      test.done();
    });
  }
};

exports['/error'] = {
  setUp: function(done) {
    // setup here
    handlers['/error'] = function(req, res) {
      res.statusCode = 404;
      res.end(JSON.stringify({error:true}));
    };
    done();
  },
  '404': function(test) {
    // test.expect(2);
    // tests here
    coux("http://localhost:3001/error?status=404",
      function(errJSON, res){
      // console.log(ok.statusCode, body);
      test.equal(res.statusCode, 404, 'response is second argument on error');
      test.equal(errJSON.error, true, 'error should be body when parsed json and error code');
      test.done();
    });
  }
};
