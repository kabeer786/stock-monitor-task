var express = require('express');
var app = express();
var fs = require("fs");
var sse = require('server-sent-events');
var stockTestDataFile = "test-data/stockes.json";
var subscriptionListTestDataFile = "test-data/subscription.json";
var onlyAllowedClient = "http://localhost:3000"

var openConnections = [];

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", onlyAllowedClient);
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

    res.set({
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
        "Access-Control-Allow-Origin": "*"
    });
    next();
});

// simple route to register the clients
app.get('/stats', function(req, res) {
    res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive'
    });

    /* push this res object to   global variable*/
    openConnections.push(res);

    /* calling When the request is closed*/
    req.on("close", function() {
        var toRemove;
        for (var j = 0; j < openConnections.length; j++) {
            if (openConnections[j] == res) {
                toRemove = j;
                break;
            }
        }
        openConnections.splice(j, 1);
        console.log(openConnections.length);
    });
});

/*responding to  each connection*/
setInterval(function() {
    openConnections.forEach(function(resp) {
        fs.readFile(__dirname + "/" + stockTestDataFile, 'utf8', function(err, data) {
            resp.write('data:' + data + '\n\n');
            //Todo End Connection with StocklistDatafile
        });

    });
}, 3000);

app.get('/getSubscriptionList', function(req, res) {
    fs.readFile(__dirname + "/" + subscriptionListTestDataFile, 'utf8', function(err, data) {
        console.log(data);
        res.end(data);
    });
})

var server = app.listen(8081, function() {

    var host = server.address().address
    var port = server.address().port

    console.log("Example app listening at http://%s:%s", host, port)

})