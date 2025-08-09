const db = require('../config/db');

const createExpense = (expenseData, callback) => {
    db.query('INSERT INTO expenses SET ?', expenseData, callback);
};

const getExpensesByUserEmail = (userEmail, callback) => {
    db.query('SELECT * FROM expenses WHERE user_email = ?', [userEmail], callback);
};

module.exports = { createExpense, getExpensesByUserEmail };
