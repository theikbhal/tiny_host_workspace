const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');

// In-memory user store (for demo purposes)
// Structure: { email: { id, fullName, email, password } }
const users = {};

// POST /auth/register - Register new user
router.post('/register', (req, res) => {
    const { fullName, email, password } = req.body;

    if (!fullName || !email || !password) {
        return res.status(400).json({ success: false, error: 'All fields are required' });
    }

    if (users[email]) {
        return res.status(400).json({ success: false, error: 'User already exists' });
    }

    const newUser = {
        id: uuidv4(),
        fullName,
        email,
        password // In a real app, hash this!
    };

    users[email] = newUser;
    console.log('New user registered:', email);

    res.json({ success: true, message: 'Registration successful' });
});

// POST /auth/login - Login user
router.post('/login', (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ success: false, error: 'Email and password are required' });
    }

    const user = users[email];

    if (!user || user.password !== password) {
        return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }

    // In a real app, generate JWT here
    const token = uuidv4();

    console.log('User logged in:', email);
    res.json({ success: true, token, user: { fullName: user.fullName, email: user.email } });
});

module.exports = router;
