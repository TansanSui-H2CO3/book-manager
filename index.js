// Requirements
const mysql = require('mysql');
const util = require('util');
const fetch = require('node-fetch');
let express = require('express');
let app = express();
app.use(express.static('source'));
let http = require('http').Server(app);
const io = require('socket.io')(http);
const PORT = process.env.PORT || 8080; // Default port number
let db_information = ['', '', '', ''];
let rakuten_app_id = '';

// Set Rakuten application ID
exports.setRakutenAppId = (id) => {
    rakuten_app_id = id;
}

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
    app.get('/spoiling/[0-9]*', (req, res) => {
        res.sendFile(__dirname + '/spoiling.html');
    });

    io.on('connection', (socket) => {
        let id = socket.id;
        socket.on('book-list', (data) => {
            getBookList(id, io, data, pool);
        });
        socket.on('search', (data) => {
            jsonFromRakten(id, io, data);
        });
        socket.on('mark-up', (data) => {
            markUp(id, io, data, pool);
        });
        socket.on('spoiler', (data) => {
            setSpoiler(id, io, data, pool);
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
    let sql, values;
    try {
        sql = 'select isbn from book order by isbn asc limit ?, ?;';
        values = [data.head - 1, data.number_of_data];
        let isbn = await pool.query(mysql.format(sql, values));
        let spoiled_book_list = [];
        let information = {isbn: isbn};
        io.to(id).emit('book-list', information);
    } catch (err) {
        throw new Error(err);
    }
}

async function jsonFromRakten(id, io, data) {
    let reqUrl = 'https://app.rakuten.co.jp/services/api/BooksBook/Search/20170404?applicationId=' + rakuten_app_id + '&title=' + data.keyword[0];
    for (let i = 1; i < data.keyword.length; i++) {
        reqUrl += ' ' + data.keyword[i];
    }
    reqUrl += '&hits=' + data.hits + '&page=' + data.page;
    const res = await fetch(encodeURI(reqUrl));
    const book_json = (await res.json()).Items;
    let isbn = [];
    for (let i = 0; i < book_json.length; i++) {
        isbn.push(book_json[i].Item.isbn);
    }
    let information = {isbn: isbn};
    io.to(id).emit('search', information);
}

async function markUp(id, io, data, pool) {
    let sql, values;
    try {
        let isbn = [];
        if (data.user_name != '') {
            sql = 'select isbn from spoiler where user_name=?;';
            values = [data.user_name];
            isbn = await pool.query(mysql.format(sql, values));
        }
        let information = {isbn: isbn};
        io.to(id).emit('mark-up', information);
    } catch (err) {
        throw new Error(err);
    }
}

async function setSpoiler(id, io, data, pool) {
    let sql, values;
    try {
        // Matching user
        sql = 'select * from user where user_name=? and password=?;';
        values = [data.user_name, data.password];
        let user = await pool.query(mysql.format(sql, values));

        if (0 < user.length) {
            // Check book table
            sql = 'select isbn from book where isbn=?;';
            values = [data.isbn];
            let book = await pool.query(mysql.format(sql, values));
            if (book.length == 0) {
                sql = 'insert into book values (?, ?, ?, ?);';
                values = [data.isbn, false, null, ''];
                await pool.query(mysql.format(sql, values));
            }

            // Search previous spoiler
            sql = 'select * from spoiler where isbn=? and user_name=?;';
            values = [data.isbn, data.user_name];
            let spoiler = await pool.query(mysql.format(sql, values));

            if (0 < spoiler.length) {
                // Update spoiler
                sql = 'update spoiler set spoiled_date=?, spoiler=?, evaluation=?, up_vote=?, down_vote=?, visible=? where isbn=? and user_name=?;';
                values = [getDate(), data.spoiler, 5, 0, 0, true, data.isbn, data.user_name];
                await pool.query(mysql.format(sql, values));
            } else {
                // Set new spoiler
                sql = 'insert into spoiler values (?, ?, ?, ?, ?, ?, ?, ?, ?);';
                values = [1, data.isbn, getDate(), data.user_name, data.spoiler, 5, 0, 0, true];
                await pool.query(mysql.format(sql, values));
            }

            // Send 'success' event
            io.to(id).emit('success');
        } else {
            io.to(id).emit('invalid-access');
        }
    } catch (err) {
        throw new Error(err);
    }
}

function getDate() {
    let dt = new Date();
    return dt.getFullYear() + '-' + (+dt.getMonth() + 1) + '-' + dt.getDate();
}