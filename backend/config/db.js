const mysql = require('mysql2');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'expense_tracker_db'
});

db.connect(err => {
    if (err) throw err;
    console.log('MySQL Connected!');
});

module.exports = db;
