var  request = require("request")
    , qs = require('querystring');
// coux is a tiny couch client, there are implementations for server side and client side
// this implementation is node.js

var coux = exports.coux = function(opts, body) {
    if (typeof opts === 'string' || Array.isArray(opts)) {
        opts = {url:opts};
    }
    var cb = arguments[Math.max(1,arguments.length -1)] || function() {console.log("empty callback", opts)};

    if (arguments.length == 3) {
        opts.body = JSON.stringify(body);
    } else {
        body = null;
    }
    opts.url = opts.url || opts.uri;
    if (Array.isArray(opts.url)) {
        var first = true;
        if (typeof opts.url[opts.url.length-1] == 'object') {
            var query = qs.stringify(opts.url.pop());
        }
        opts.url = (opts.url.map(function(path) {
            if (first) {
                first = false;
                if (/^http/.test(path)) {
                    return path;
                }
            }
            return encodeURIComponent(path);
        })).join('/');
        if (query) {
            opts.url = opts.url + "?" + query;
        }
    }
    var req = {
        method: 'GET',
        headers : {
            'content-type': 'application/json'
        }
    };
    for (var x in opts) {
        if (opts.hasOwnProperty(x)){
            req[x] = opts[x];
        }
    }
    log('coux', req.method, req.url, body);
    request(req, function(err, resp, body) {
        var jsonBody;
        log('done', req.method, req.url);
        if (err) {
            cb(err, resp, body)
        } else {
            try {
                jsonBody = JSON.parse(body);
            } catch(e) {
                jsonBody = body;
            }
            if (resp.statusCode >= 400) {
                cb(jsonBody, resp)
            } else {
                cb(false, jsonBody)
            }
        }
    });
};

coux.put = function() {
    var opts = arguments[0];
    if (typeof opts === 'string' || Array.isArray(opts)) {
        opts = {url:opts};
    }
    opts.method = "PUT";
    arguments[0] = opts;
    coux.apply(null, arguments);
};

coux.post = function() {
    var opts = arguments[0];
    if (typeof opts === 'string' || Array.isArray(opts)) {
        opts = {url:opts};
    }
    opts.method = "POST";
    arguments[0] = opts;
    coux.apply(null, arguments);
};

coux.del = function() {
    var opts = arguments[0];
    if (typeof opts === 'string' || Array.isArray(opts)) {
        opts = {url:opts};
    }
    opts.method = "DELETE";
    arguments[0] = opts;
    coux.apply(null, arguments);
};


// connect to changes feed
coux.subscribeDb = function(db, fun, since) {
    function getChanges(since) {
        var opts = {url:[db, "_changes",
            {include_docs:true,feed:"longpoll",since:since}], agent:false};
        coux(opts,
        function(err, changes) {
            if (err) {
                console.error(err)
                console.error("opts",opts)
            } else {
                changes.results.forEach(fun)
                getChanges(changes.last_seq);
            }
        })
    }
    getChanges(since || 0);
};

// don't log anything
coux.log = [];
// don't log GET
// coux.log = ["PUT", "POST", "DELETE"];
function log(message, verb) {
    if (coux.log.indexOf(verb) !== -1) {
        console.log.apply(null, arguments);
    }
};