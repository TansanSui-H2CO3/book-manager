// Requirements
const mysql = require('mysql');
const util = require('util');
let express = require('express');
let app = express();
let http = require('http').Server(app);
const io = require('socket.io')(http);
const PORT = process.env.PORT || 8080; // Default port number

// Routing
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/top.html');
});

// Listening
http.listen(PORT, () => {
    console.log('Book manager is activated.');
});