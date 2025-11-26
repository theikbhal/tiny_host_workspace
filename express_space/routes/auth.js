const express = require('express');
const router = express.Router();
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const fs = require('fs');
const AdmZip = require('adm-zip');
const bcrypt = require('bcrypt');

// ✅ Base domain for hosted sites
const BASE_SITE_DOMAIN = process.env.BASE_SITE_DOMAIN || 'site.naml.in';

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
            projects: []
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

// ==================== PROJECT ROUTES ====================

// ✅ Helper to build production URL like https://ikb.site.naml.in
function buildSiteUrl(projectId, req) {
    const proto =
        req.headers['x-forwarded-proto'] ||
        req.protocol ||
        'http';

    const host = `${projectId}.${BASE_SITE_DOMAIN}`;
    return `${proto}://${host}`;
}

// Configure multer for file uploads (temporary storage)
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/temp/');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(
            null,
            file.fieldname +
            '-' +
            uniqueSuffix +
            path.extname(file.originalname)
        );
    },
});

const upload = multer({ storage: storage });

// Mock data store
const projects = {};

// Helper function to process uploaded file
const processUploadedFile = (file, domain) => {
    const siteDir = path.join(__dirname, '..', 'uploads', domain);
    ensureDir(siteDir);

    const fileExt = path.extname(file.originalname).toLowerCase();

    if (fileExt === '.zip') {
        // Extract ZIP file
        try {
            const zip = new AdmZip(file.path);
            const tempExtractDir = path.join(
                __dirname,
                '..',
                'uploads',
                'temp',
                `extract-${Date.now()}`
            );

            // Extract to temporary directory first
            zip.extractAllTo(tempExtractDir, true);

            // Check if ZIP contains a single root folder
            const extractedItems = fs.readdirSync(tempExtractDir);

            if (extractedItems.length === 1) {
                const singleItem = path.join(
                    tempExtractDir,
                    extractedItems[0]
                );
                const stats = fs.statSync(singleItem);

                if (stats.isDirectory()) {
                    // ZIP contains a single folder - copy its contents directly
                    const folderContents = fs.readdirSync(singleItem);

                    folderContents.forEach((item) => {
                        const srcPath = path.join(singleItem, item);
                        const destPath = path.join(siteDir, item);

                        // Move each item (file or folder) to site directory
                        fs.renameSync(srcPath, destPath);
                    });
                } else {
                    // Single file - move it directly
                    const destPath = path.join(
                        siteDir,
                        extractedItems[0]
                    );
                    fs.renameSync(singleItem, destPath);
                }
            } else {
                // Multiple items at root - move all directly
                extractedItems.forEach((item) => {
                    const srcPath = path.join(tempExtractDir, item);
                    const destPath = path.join(siteDir, item);
                    fs.renameSync(srcPath, destPath);
                });
            }

            // Clean up temporary extraction directory
            if (fs.existsSync(tempExtractDir)) {
                fs.rmSync(tempExtractDir, {
                    recursive: true,
                    force: true,
                });
            }

            // Delete the temporary ZIP file
            fs.unlinkSync(file.path);

            return { success: true, type: 'zip', extracted: true };
        } catch (error) {
            return {
                success: false,
                error: 'Failed to extract ZIP file: ' + error.message,
            };
        }
    } else if (fileExt === '.html' || fileExt === '.htm') {
        // Move HTML file to site directory as index.html
        const targetPath = path.join(siteDir, 'index.html');
        fs.renameSync(file.path, targetPath);

        return { success: true, type: 'html', file: targetPath };
    } else {
        // For other files, move to site directory with original name
        const targetPath = path.join(siteDir, file.originalname);
        fs.renameSync(file.path, targetPath);

        return { success: true, type: 'other', file: targetPath };
    }
};

// Ensure temp directory exists
ensureDir(path.join(__dirname, '..', 'uploads', 'temp'));

// POST /v1/upload - Create Project
router.post('/upload', upload.single('files'), (req, res) => {
    const { siteSettings, domain, userId } = req.body;
    const file = req.file;

    if (!file) {
        return res
            .status(400)
            .json({ success: false, error: 'No file uploaded' });
    }

    if (!userId) {
        return res
            .status(400)
            .json({ success: false, error: 'User ID is required' });
    }

    const projectId = domain || uuidv4();
    const link = buildSiteUrl(projectId, req);

    // Process the uploaded file
    const result = processUploadedFile(file, projectId);

    if (!result.success) {
        return res
            .status(500)
            .json({ success: false, error: result.error });
    }

    // Save to in-memory projects
    projects[projectId] = {
        id: projectId,
        link: link,
        status: 'active',
        fileType: result.type,
        settings: siteSettings ? JSON.parse(siteSettings) : {},
        createdAt: new Date(),
    };

    // Save to sites.json with user association
    const sites = readSites();
    const newSite = {
        id: projectId,
        userId: userId,
        domain: projectId,
        link: link,
        status: 'active',
        fileType: result.type,
        settings: siteSettings ? JSON.parse(siteSettings) : {},
        createdAt: new Date().toISOString(),
    };
    sites.push(newSite);
    writeSites(sites);

    res.json({
        success: true,
        data: {
            link: link,
            status: 'active',
            profile: {
                quotaUsed: 5,
                quotaLimit: 1024,
            },
        },
    });
});

// PUT /v1/upload - Update Project
router.put('/upload', upload.single('files'), (req, res) => {
    const { siteSettings, domain } = req.body;
    const file = req.file;

    if (!domain) {
        return res.status(400).json({
            success: false,
            error: 'Domain is required for update',
        });
    }

    const projectId = domain;
    const link = buildSiteUrl(projectId, req);

    // Process the uploaded file if provided
    if (file) {
        const result = processUploadedFile(file, projectId);

        if (!result.success) {
            return res
                .status(500)
                .json({ success: false, error: result.error });
        }

        projects[projectId] = {
            ...projects[projectId],
            id: projectId,
            link: link,
            status: 'active',
            fileType: result.type,
            settings: siteSettings
                ? JSON.parse(siteSettings)
                : projects[projectId]?.settings || {},
            updatedAt: new Date(),
        };
    } else {
        // Update settings only
        projects[projectId] = {
            ...projects[projectId],
            id: projectId,
            link: link,
            status: 'active',
            settings: siteSettings
                ? JSON.parse(siteSettings)
                : projects[projectId]?.settings || {},
            updatedAt: new Date(),
        };
    }

    // Update sites.json
    const sites = readSites();
    const siteIndex = sites.findIndex(s => s.domain === projectId);

    if (siteIndex !== -1) {
        sites[siteIndex] = {
            ...sites[siteIndex],
            link: link,
            status: 'active',
            fileType: file ? (processUploadedFile(file, projectId).type) : sites[siteIndex].fileType,
            settings: siteSettings ? JSON.parse(siteSettings) : (sites[siteIndex].settings || {}),
            updatedAt: new Date().toISOString()
        };
        writeSites(sites);
    }

    res.json({
        success: true,
        data: {
            link: link,
            status: 'active',
            profile: {
                quotaUsed: 5,
                quotaLimit: 1024,
            },
        },
    });
});

// DELETE /v1/delete - Delete Project
router.delete('/delete', upload.none(), (req, res) => {
    const { domain } = req.body;

    if (!domain) {
        return res.status(400).json({
            success: false,
            error: 'Domain is required',
        });
    }

    // Remove from sites.json
    const sites = readSites();
    const filteredSites = sites.filter(s => s.domain !== domain);
    writeSites(filteredSites);

    delete projects[domain];

    const deletedUrl = `https://${domain}.${BASE_SITE_DOMAIN}`;

    res.json({
        success: true,
        data: {
            links: [deletedUrl],
            quotaUsed: 5,
            quotaLimit: 1024,
        },
    });
});

// GET /v1/profile - Fetch Profile
router.get('/profile', (req, res) => {
    res.json({
        success: true,
        data: {
            links: Object.values(projects).map((p) => p.link),
            quotaUsed: 5,
            quotaLimit: 1024,
        },
    });
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

module.exports = router;
