// Requirements
const mysql = require('mysql');
const util = require('util');
let express = require('express');
let app = express();
let http = require('http').Server(app);
const io = require('socket.io')(http);
const PORT = process.env.PORT || 8080; // Default port number

// DB connection
const pool = mysql.createPool({
    host: 'host_name',
    user: 'user_name',
    password: 'password',
    database: 'database',
});
pool.query = util.promisify(pool.query);

// Routing
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/top.html');
});

io.on('connection', (socket) => {
    console.log('User connected');
    socket.on('book-list', (data) => {
        
    });
    socket.on('read-book-list', (data) => {

    });
    socket.on('register-read-book', (data) => {

    });
    socket.on('register-review', (data) => {

    });
    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

// Listening
http.listen(PORT, () => {
    console.log('Book manager is activated.');
});