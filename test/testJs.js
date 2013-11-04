// THIS IS DOGESCRIPT

var dogeudle = require('dogeudle');
var wow = require('boring');

var dogescript = 'such messy; very doge-friendly'

    function woof(foo, bar, bat) {
        console.log(foo);

        function nested() {
            console.log(['so', 'wow']);
        }
        nested();
        return bar;
    }

woof('multiple', 'doge', 'properties wow');

var cat = 'not a doge'

while (woof === 'doges only' && cat !== 'doge' || cat === 'not a doge') {
    console.log({
        such: 'doge'
    });
}

if (woof === 'doges only' && cat !== 'doge' || cat === 'not a doge') {
    console.log({
        such: 'doge',
        wow: 'dogee'
    });
}

for (var woof = 1; woof < 3; woof += 1) {
    console.log({
        such: 'doge'
    });
}

// chaining
var canvas = d3.select('body')
    .append('canvas')
    .attr('width', width)
    .attr('height', height);

var regex = new RegExp(keyword, 'g');
var regex2 = new RegExp('doge', 'g');

var arr = new Array(0);

obj = new Object();

module.exports = woof

// example http server

var http = require('http');
http.createServer(function(req, res) {
        req.writeHead(200, {
            'Content-Type': 'text/plain'
        });
        req.end('so hello\nmuch world');
    }