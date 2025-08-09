const db = require('../config/db');

const createUser = (userData, callback) => {
    const { username, email, password, avatarCategory, avatarType } = userData;
    db.query('INSERT INTO users (email, username, password, avatar_category, avatar_type) VALUES (?, ?, ?, ?, ?)', 
        [email, username, password, avatarCategory, avatarType], callback);
};

const findUserByEmail = (email, callback) => {
    db.query('SELECT * FROM users WHERE email = ?', [email], callback);
};

module.exports = { createUser, findUserByEmail };
