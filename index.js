// Requirements
const mysql = require('mysql');
const util = require('util');
let express = require('express');
let app = express();
app.use(express.static('source'));
let http = require('http').Server(app);
const io = require('socket.io')(http);
const PORT = process.env.PORT || 8080; // Default port number
let db_information = ['', '', '', ''];

// Set DB info
exports.setDataBaseInformation = (host, user, password, database) => {
    db_information = [host, user, password, database];
};

exports.startServer = () => {
    // DB connection
    const pool = mysql.createPool({
        host: db_information[0],
        user: db_information[1],
        password: db_information[2],
        database: db_information[3],
    });
    pool.query = util.promisify(pool.query);

    // Routing
    app.get('/', (req, res) => {
        res.sendFile(__dirname + '/top.html');
    });
    app.get('/spoiler/[0-9]*', (req, res) => {
        res.sendFile(__dirname + '/spoiler.html');
    });

    io.on('connection', (socket) => {
        let id = socket.id;
        socket.on('book-list', (data) => {
            getBookList(id, io, data, pool);
        });
        socket.on('read-book-list', (data) => {
            getReadBookList(id, io, data, pool);
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
}

async function getBookList(id, io, data, pool) {
    let sql;
    try {
        sql = 'select * from book limit ?, ?;';
        values = [data.head - 1, data.number_of_data];
        let book_list = await pool.query(mysql.format(sql, values));
        let information = {book_list: book_list};
        io.to(id).emit('book-list', information);
    } catch (err) {
        throw new Error(err);
    }
}

async function getReadBookList(id, io, data, pool) {
    let sql;
    try {
        sql = 'select * from read_book_list limit ?, ?;';
        values = [data.head, data.number_of_data];
        let read_book_list = await pool.query(mysql.format(sql, values));
        let information = {read_book_list: read_book_list};
        io.to(id).emit('read-book-list', information);
    } catch (err) {
        throw new Error(err);
    }
}