/*
 * coux
 * https://github.com/jchris/coux
 *
 * Copyright (c) 2013 Chris Anderson
 * Licensed under the Apache license.
 */
var pax = require("pax"),
  hoax = require("hoax");


var couxPax = pax();

couxPax.getQuery = function(params) {
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

var Coux = module.exports = hoax.makeHoax(couxPax());
