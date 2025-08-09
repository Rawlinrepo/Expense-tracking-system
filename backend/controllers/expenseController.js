const expenseModel = require('../models/expenseModel');

const getExpenses = (req, res) => {
    const userEmail = req.user.email;
    expenseModel.getExpensesByUserEmail(userEmail, (err, results) => {
        if (err) return res.status(500).json(err);
        res.json(results);
    });
};

const createExpense = (req, res) => {
    const { name, description, amount, date, category, transactionType } = req.body;

    if (!name || !description || !amount || !date || !category || !transactionType) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    const userEmail = req.user.email;

    expenseModel.addExpense(userEmail, name, description, amount, date, category, transactionType, (err, result) => {
        if (err) {
            console.error('Error adding expense:', err);
            return res.status(500).json({ message: 'Error adding expense', error: err });
        }
        res.status(201).json({ message: 'Expense added successfully!', id: result.insertId });
    });
};

const updateExpense = (req, res) => {
    const { id } = req.params;
    const { name, description, amount, date, category, transactionType } = req.body;

    if (!name || !description || !amount || !date || !category || !transactionType) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    const updatedExpense = { name, description, amount, date, category, transactionType };

    expenseModel.updateExpenseById(id, updatedExpense, (err, result) => {
        if (err) {
            console.error('Error updating expense:', err);
            return res.status(500).json({ message: 'Error updating expense', error: err });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Expense not found' });
        }

        res.json({ message: 'Expense updated successfully!', id, ...updatedExpense });
    });
};

const deleteExpense = (req, res) => {
    const { id } = req.params;

    expenseModel.deleteExpenseById(id, (err) => {
        if (err) return res.status(500).json(err);
        res.json({ message: 'Expense deleted' });
    });
};

module.exports = { getExpenses, createExpense, updateExpense, deleteExpense };
