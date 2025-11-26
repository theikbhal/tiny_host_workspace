const express = require('express');
const router = express.Router();
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const fs = require('fs');
const AdmZip = require('adm-zip');
const bcrypt = require('bcrypt');

// Base domain for hosted sites
const BASE_SITE_DOMAIN = process.env.BASE_SITE_DOMAIN || 'simplhost.com';

// Path to JSON files
const USERS_FILE = path.join(__dirname, '..', 'data', 'users.json');
const SITES_FILE = path.join(__dirname, '..', 'data', 'sites.json');

// Helper function to ensure directory exists
const ensureDir = (dirPath) => {
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
    }
};

// Ensure data directory exists
ensureDir(path.join(__dirname, '..', 'data'));

// Helper functions for user management
const readUsers = () => {
    try {
        if (!fs.existsSync(USERS_FILE)) {
            fs.writeFileSync(USERS_FILE, JSON.stringify([], null, 2));
            return [];
        }
        const data = fs.readFileSync(USERS_FILE, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error reading users file:', error);
        return [];
    }
};

const writeUsers = (users) => {
    try {
        fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
        return true;
    } catch (error) {
        console.error('Error writing users file:', error);
        return false;
    }
};

// Helper functions for site management
const readSites = () => {
    try {
        if (!fs.existsSync(SITES_FILE)) {
            fs.writeFileSync(SITES_FILE, JSON.stringify([], null, 2));
            return [];
        }
        const data = fs.readFileSync(SITES_FILE, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error reading sites file:', error);
        return [];
    }
};

const writeSites = (sites) => {
    try {
        fs.writeFileSync(SITES_FILE, JSON.stringify(sites, null, 2));
        return true;
    } catch (error) {
        console.error('Error writing sites file:', error);
        return false;
    }
};

const findSitesByUserId = (userId) => {
    const sites = readSites();
    return sites.filter(site => site.userId === userId);
};

const findUserByEmail = (email) => {
    const users = readUsers();
    return users.find(user => user.email.toLowerCase() === email.toLowerCase());
};

// ==================== AUTH ROUTES ====================

// POST /auth/register - User Registration
router.post('/register', async (req, res) => {
    try {
        const { email, password, name } = req.body;

        // Validation
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                error: 'Email and password are required'
            });
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                error: 'Invalid email format'
            });
        }

        // Password strength validation
        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                error: 'Password must be at least 6 characters long'
            });
        }

        // Check if user already exists
        const existingUser = findUserByEmail(email);
        if (existingUser) {
            return res.status(409).json({
                success: false,
                error: 'User with this email already exists'
            });
        }

        // Hash password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Create new user
        const newUser = {
            id: uuidv4(),
            email: email.toLowerCase(),
            password: hashedPassword,
            name: name || email.split('@')[0],
            createdAt: new Date().toISOString(),
            projects: [],
            apiKeys: [] // Initialize apiKeys array
        };

        // Save user
        const users = readUsers();
        users.push(newUser);

        if (!writeUsers(users)) {
            return res.status(500).json({
                success: false,
                error: 'Failed to save user data'
            });
        }

        // Return success (without password)
        const { password: _, ...userWithoutPassword } = newUser;

        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            user: userWithoutPassword
        });

    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
});

// POST /auth/login - User Login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validation
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                error: 'Email and password are required'
            });
        }

        // Find user
        const user = findUserByEmail(email);
        if (!user) {
            return res.status(401).json({
                success: false,
                error: 'Invalid email or password'
            });
        }

        // Verify password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                error: 'Invalid email or password'
            });
        }

        // Return success (without password)
        const { password: _, ...userWithoutPassword } = user;

        res.json({
            success: true,
            message: 'Login successful',
            user: userWithoutPassword
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
});

// GET /auth/user/:email - Get user by email (for checking if exists)
router.get('/user/:email', (req, res) => {
    try {
        const { email } = req.params;
        const user = findUserByEmail(email);

        if (!user) {
            return res.status(404).json({
                success: false,
                error: 'User not found'
            });
        }

        const { password: _, ...userWithoutPassword } = user;

        res.json({
            success: true,
            user: userWithoutPassword
        });

    } catch (error) {
        console.error('Get user error:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
});

// GET /auth/sites/:userId - Get user's sites
router.get('/sites/:userId', (req, res) => {
    try {
        const { userId } = req.params;

        if (!userId) {
            return res.status(400).json({
                success: false,
                error: 'User ID is required'
            });
        }

        const userSites = findSitesByUserId(userId);

        res.json({
            success: true,
            sites: userSites
        });

    } catch (error) {
        console.error('Get sites error:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
});

// ==================== API KEY ROUTES ====================

// POST /auth/api-keys - Create API Key
router.post('/api-keys', (req, res) => {
    try {
        const { userId, name } = req.body;

        if (!userId || !name) {
            return res.status(400).json({
                success: false,
                error: 'User ID and key name are required'
            });
        }

        const users = readUsers();
        const userIndex = users.findIndex(u => u.id === userId);

        if (userIndex === -1) {
            return res.status(404).json({
                success: false,
                error: 'User not found'
            });
        }

        const newKey = {
            id: uuidv4(),
            key: 'sk_' + uuidv4().replace(/-/g, ''),
            name: name,
            createdAt: new Date().toISOString()
        };

        if (!users[userIndex].apiKeys) {
            users[userIndex].apiKeys = [];
        }

        users[userIndex].apiKeys.push(newKey);
        writeUsers(users);

        res.status(201).json({
            success: true,
            apiKey: newKey
        });

    } catch (error) {
        console.error('Create API key error:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
});

// GET /auth/api-keys/:userId - List API Keys
router.get('/api-keys/:userId', (req, res) => {
    try {
        const { userId } = req.params;

        const users = readUsers();
        const user = users.find(u => u.id === userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                error: 'User not found'
            });
        }

        res.json({
            success: true,
            apiKeys: user.apiKeys || []
        });

    } catch (error) {
        console.error('List API keys error:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
});

// DELETE /auth/api-keys/:userId/:keyId - Delete API Key
router.delete('/api-keys/:userId/:keyId', (req, res) => {
    try {
        const { userId, keyId } = req.params;

        const users = readUsers();
        const userIndex = users.findIndex(u => u.id === userId);

        if (userIndex === -1) {
            return res.status(404).json({
                success: false,
                error: 'User not found'
            });
        }

        if (!users[userIndex].apiKeys) {
            return res.status(404).json({
                success: false,
                error: 'Key not found'
            });
        }

        const initialLength = users[userIndex].apiKeys.length;
        users[userIndex].apiKeys = users[userIndex].apiKeys.filter(k => k.id !== keyId);

        if (users[userIndex].apiKeys.length === initialLength) {
            return res.status(404).json({
                success: false,
                error: 'Key not found'
            });
        }

        writeUsers(users);

        res.json({
            success: true,
            message: 'API key deleted successfully'
        });

    } catch (error) {
        console.error('Delete API key error:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
});

module.exports = router;
