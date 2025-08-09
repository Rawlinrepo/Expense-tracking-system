const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();
const port = 5000;
const secret = 'your_secret_key';

app.use(cors());
app.use(bodyParser.json());

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

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];

    if (!authHeader) {
        return res.status(401).json({ message: 'Authorization header missing' });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Token missing' });
    }

    jwt.verify(token, secret, (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Invalid or expired token' });
        }
        req.user = user;
        next();
    });
};

app.post('/register', async (req, res) => {
    const { username, email, password, avatarCategory, avatarType } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        db.query(
            'INSERT INTO users (email, username, password, avatar_category, avatar_type) VALUES (?, ?, ?, ?, ?)',
            [email, username, hashedPassword, avatarCategory, avatarType],
            (err, result) => {
                if (err) return res.status(500).json({ message: 'Registration failed', error: err });
                res.json({ message: 'User registered successfully!' });
            }
        );
    } catch (error) {
        res.status(500).json({ message: 'Error during registration', error });
    }
});

app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    db.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
        if (err) return res.status(500).json(err);
        if (results.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        const user = results[0];
        const match = await bcrypt.compare(password, user.password);
        if (!match) return res.status(400).json({ message: 'Incorrect password' });

        const token = jwt.sign(
            {
                email: user.email,
                username: user.username,
                avatarCategory: user.avatar_category,
                avatarType: user.avatar_type
            },
            secret,
            { expiresIn: '1h' }
        );

        res.json({
            message: 'Login successful',
            token,
            username: user.username,
            avatarCategory: user.avatar_category,
            avatarType: user.avatar_type
        });
    });
});

app.get('/expenses', authenticateToken, (req, res) => {
    const userEmail = req.user.email;

    db.query('SELECT * FROM expenses WHERE user_email = ?', [userEmail], (err, results) => {
        if (err) return res.status(500).json(err);
        res.json(results);
    });
});

app.get('/expenses/:id', authenticateToken, (req, res) => {
    const { id } = req.params;

    db.query('SELECT * FROM expenses WHERE id = ?', [id], (err, results) => {
        if (err) return res.status(500).json(err);
        if (results.length === 0) {
            return res.status(404).json({ message: 'Expense not found' });
        }
        res.json(results[0]);
    });
});

app.post('/expenses', authenticateToken, (req, res) => {
    const { name, description, amount, date, category, transactionType } = req.body;
    const userEmail = req.user.email;

    const sql = `
        INSERT INTO expenses 
        (user_email, name, amount, date, description, category, transactionType)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(sql, [userEmail, name, description, amount, date, category, transactionType], (err, result) => {
        if (err) {
            console.error('MySQL Error:', err.sqlMessage || err);
            return res.status(500).json({
                message: 'Error adding expense',
                error: err.sqlMessage || err
            });
        }

        res.status(201).json({ message: 'Expense added successfully', id: result.insertId });
    });
});

app.put('/expenses/:id', authenticateToken, (req, res) => {
    const { id } = req.params;
    const { name, description, amount, date, category, transactionType } = req.body;

    if (!name || !description || !amount || !date || !category || !transactionType) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    const validTransactionTypes = ['credit', 'expense'];
    if (!validTransactionTypes.includes(transactionType)) {
        return res.status(400).json({ message: 'Invalid transaction type' });
    }

    const updatedExpense = { name, description, amount, date, category, transactionType };

    db.query('UPDATE expenses SET ? WHERE id = ?', [updatedExpense, id], (err, result) => {
        if (err) {
            return res.status(500).json({ message: 'Error updating expense', error: err });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Expense not found' });
        }
        res.json({ message: 'Expense updated successfully!', id, ...updatedExpense });
    });
});

app.delete('/expenses/:id', authenticateToken, (req, res) => {
    const { id } = req.params;

    db.query('DELETE FROM expenses WHERE id = ?', [id], (err) => {
        if (err) return res.status(500).json(err);
        res.json({ message: 'Expense deleted' });
    });
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
