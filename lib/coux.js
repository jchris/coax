/*
 * coux
 * https://github.com/jchris/coux
 *
 * Copyright (c) 2013 Chris Anderson
 * Licensed under the Apache license.
 */
var pax = require("pax"),
  request = require("request"),
  jreq = require("request").defaults({json:true});

// console.log(jreq)

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
    // console.log("urlOrOpts", urlOrOpts);
    return [urlOrOpts, cb];
  } else {
    // hope it's string or array
    // console.log("myPax(urlOrOpts)", myPax(urlOrOpts));
    return [callPaxOrArgs(myPax, urlOrOpts), cb];
  }
}

function makeCoux(myPax) {
  var newCoux = function(url, cb) {
    var args = processArguments(myPax, url, cb);
    if (args[1]) {
      return jreq(args[0].toString(), makeCouxCallback(args[1]));
    } else {
      console.log("curry me");
    //   return jreq(url)
      // return a function with a built in path
      return makeCoux(args[0]);
    }
  };
  return newCoux;
}

var Coux = module.exports = function (url, cb) {

  var args = processArguments(pax(), url, cb);
  if (args[1]) {
    return jreq(args[0].toString(), makeCouxCallback(args[1]));
  } else {
    console.log("curry me");
  //   return jreq(url)
    // return a function with a built in path
    return makeCoux(args[0]);
  }
};

"get put post head del".split(" ").forEach(function(verb){
  Coux[verb] = function(url, cb) {
    var args = processArguments(pax(), url, cb);
    return jreq[verb](args[0].toString(), makeCouxCallback(args[1]));
  };
});
