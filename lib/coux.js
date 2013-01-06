/*
 * coux
 * https://github.com/jchris/coux
 *
 * Copyright (c) 2013 Chris Anderson
 * Licensed under the Apache license.
 */
var pax = require("pax"),
  request = require("request"),
  jreq = request.defaults({json:true});

pax.getQuery = function(params) {
  params = JSON.parse(JSON.stringify(params));
  var key, keys = ["key", "startkey", "endkey", "start_key", "end_key"];
  for (var i = 0; i < keys.length; i++) {
    key = keys[i];
    if (params[key]) {
      params[key] = JSON.stringify(params[key]);
    }
  }
  return params;
};

function makeCouxCallback(cb) {
  return function(err, res, body){
    if (err) {
      cb(err, res, body);
    } else {
      if (res.statusCode >= 400) {
        cb(body || res.statusCode, res);
      } else {
        cb(null, body);
      }
    }
  };
}

function callPaxOrArgs(myPax, path) {
  // if path is array and last is query, couchify it
  if (myPax.uri) {
    return myPax.uri(path);
  } else {
    return myPax(path);
  }
}

function processArguments(myPax, urlOrOpts, cb) {
  if (urlOrOpts.uri || urlOrOpts.url) {
    // it's options
    urlOrOpts.uri = callPaxOrArgs(myPax, (urlOrOpts.uri || urlOrOpts.url));
    return [urlOrOpts, cb];
  } else if (typeof urlOrOpts === 'function') {
    return [myPax, urlOrOpts];
  } else {
    return [callPaxOrArgs(myPax, urlOrOpts), cb];
  }
}

function makeCoux(myPax, verb) {
  var newCoux = function(url, cb) {
    var args = processArguments(myPax, url, cb);
    if (args[1]) {
      if (verb) {
        return jreq[verb](args[0].toString(), makeCouxCallback(args[1]));
      } else {
        return jreq(args[0].toString(), makeCouxCallback(args[1]));
      }
    } else {
      return makeCoux(args[0], verb);
    }
  };
  if (!verb) {
    "get put post head del".split(" ").forEach(function(v){
      newCoux[v] = makeCoux(myPax, v);
    });
  }
  return newCoux;
}

var Coux = module.exports = makeCoux(pax());
