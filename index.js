/**
 * Created by edwardhunton on 06/10/15.
 */
var WebSocketServer = require("ws").Server
var http = require("http")
var express = require("express")
var app = express()
var port = process.env.PORT || 5000

app.use(express.static(__dirname + "/"))



var server = http.createServer(app)
server.listen(port)

console.log("http server listening on %d", port)

var wss = new WebSocketServer({server: server})

var clients = [];

console.log("websocket server created")

wss.on("connection", function(ws) {

    clients.forEach(function(client) {
        client.send(JSON.stringify("Client Added"), function() {  });
    });


    clients.push(ws)



    console.log("websocket connection open")

    ws.on("close", function() {
        console.log("websocket connection close")
        clients.forEach(function(client) {
            client.send(JSON.stringify("Client Disconnected"), function() {  });
        });
        clients.pop(ws);
    })

    ws.on('message', function(message) {
        console.log('received: %s', message);

        clients.forEach(function(client) {
            client.send(JSON.stringify(message), function() {  });
        });

    });


})