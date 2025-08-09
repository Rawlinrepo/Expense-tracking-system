const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel');

const register = async (req, res) => {
    const { username, email, password, avatarCategory, avatarType } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        userModel.createUser({ username, email, password: hashedPassword, avatarCategory, avatarType }, (err, result) => {
            if (err) return res.status(500).json({ message: 'Registration failed', error: err });
            res.json({ message: 'User registered successfully!' });
        });
    } catch (error) {
        res.status(500).json({ message: 'Error during registration', error });
    }
};

const login = async (req, res) => {
    const { email, password } = req.body;

    userModel.findUserByEmail(email, async (err, results) => {
        if (err) return res.status(500).json(err);
        if (results.length === 0) return res.status(404).json({ message: 'User not found' });

        const user = results[0];
        const match = await bcrypt.compare(password, user.password);
        if (!match) return res.status(400).json({ message: 'Incorrect password' });

        const token = jwt.sign({ email: user.email, username: user.username, avatarCategory: user.avatar_category, avatarType: user.avatar_type }, process.env.JWT_SECRET || 'your_secret_key', { expiresIn: '1h' });
        res.json({ token, username: user.username, avatar: user.avatar, avatarCategory: user.avatar_category, avatarType: user.avatar_type });
    });
};

module.exports = { register, login };
