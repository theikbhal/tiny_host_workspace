const express = require('express');
const router = express.Router();
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const fs = require('fs');
const AdmZip = require('adm-zip');

// Base domain for hosted sites
const BASE_SITE_DOMAIN = process.env.BASE_SITE_DOMAIN || 'simplhost.com';
const SITES_FILE = path.join(__dirname, '..', 'data', 'sites.json');

// Configure multer for file uploads (temporary storage)
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/temp/');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// Helper function to ensure directory exists
const ensureDir = (dirPath) => {
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
    }
};

// Ensure data directory exists
ensureDir(path.join(__dirname, '..', 'data'));
ensureDir(path.join(__dirname, '..', 'uploads', 'temp'));

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

// Helper to build production URL
function buildSiteUrl(projectId, req) {
    const proto = req.headers['x-forwarded-proto'] || req.protocol || 'http';
    const host = `${projectId}.${BASE_SITE_DOMAIN}`;
    return `${proto}://${host}`;
}

// Helper function to process uploaded file
const processUploadedFile = (file, domain) => {
    const siteDir = path.join(__dirname, '..', 'uploads', domain);
    ensureDir(siteDir);

    const fileExt = path.extname(file.originalname).toLowerCase();

    if (fileExt === '.zip') {
        // Extract ZIP file
        try {
            const zip = new AdmZip(file.path);
            const tempExtractDir = path.join(__dirname, '..', 'uploads', 'temp', `extract-${Date.now()}`);

            // Extract to temporary directory first
            zip.extractAllTo(tempExtractDir, true);

            // Check if ZIP contains a single root folder
            const extractedItems = fs.readdirSync(tempExtractDir);

            if (extractedItems.length === 1) {
                const singleItem = path.join(tempExtractDir, extractedItems[0]);
                const stats = fs.statSync(singleItem);

                if (stats.isDirectory()) {
                    // ZIP contains a single folder - copy its contents directly
                    const folderContents = fs.readdirSync(singleItem);

                    folderContents.forEach(item => {
                        const srcPath = path.join(singleItem, item);
                        const destPath = path.join(siteDir, item);

                        // Move each item (file or folder) to site directory
                        fs.renameSync(srcPath, destPath);
                    });
                } else {
                    // Single file - move it directly
                    const destPath = path.join(siteDir, extractedItems[0]);
                    fs.renameSync(singleItem, destPath);
                }
            } else {
                // Multiple items at root - move all directly
                extractedItems.forEach(item => {
                    const srcPath = path.join(tempExtractDir, item);
                    const destPath = path.join(siteDir, item);
                    fs.renameSync(srcPath, destPath);
                });
            }

            // Clean up temporary extraction directory
            if (fs.existsSync(tempExtractDir)) {
                fs.rmSync(tempExtractDir, { recursive: true, force: true });
            }

            // Delete the temporary ZIP file
            fs.unlinkSync(file.path);

            return { success: true, type: 'zip', extracted: true };
        } catch (error) {
            return { success: false, error: 'Failed to extract ZIP file: ' + error.message };
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

// POST /v1/upload - Create Project
router.post('/upload', upload.single('files'), (req, res) => {
    const { siteSettings, domain, userId } = req.body;
    const file = req.file;

    if (!file) {
        return res.status(400).json({ success: false, error: 'No file uploaded' });
    }

    // Note: userId is optional for anonymous uploads, but required for user association

    const projectId = domain || uuidv4();
    const link = buildSiteUrl(projectId, req);

    // Process the uploaded file
    const result = processUploadedFile(file, projectId);

    if (!result.success) {
        return res.status(500).json({ success: false, error: result.error });
    }

    // Save to sites.json
    const sites = readSites();
    const newSite = {
        id: projectId,
        userId: userId || null, // Store userId if provided
        domain: projectId,
        link: link,
        status: 'active',
        fileType: result.type,
        settings: siteSettings ? JSON.parse(siteSettings) : {},
        createdAt: new Date().toISOString()
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
                quotaLimit: 1024
            }
        }
    });
});

// PUT /v1/upload - Update Project
router.put('/upload', upload.single('files'), (req, res) => {
    const { siteSettings, domain } = req.body;
    const file = req.file;

    if (!domain) {
        return res.status(400).json({ success: false, error: 'Domain is required for update' });
    }

    const projectId = domain;
    const link = buildSiteUrl(projectId, req);
    let fileType = null;

    // Process the uploaded file if provided
    if (file) {
        const result = processUploadedFile(file, projectId);

        if (!result.success) {
            return res.status(500).json({ success: false, error: result.error });
        }
        fileType = result.type;
    }

    // Update sites.json
    const sites = readSites();
    const siteIndex = sites.findIndex(s => s.domain === projectId);

    if (siteIndex !== -1) {
        sites[siteIndex] = {
            ...sites[siteIndex],
            link: link,
            status: 'active',
            fileType: fileType || sites[siteIndex].fileType,
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
                quotaLimit: 1024
            }
        }
    });
});

// DELETE /v1/delete - Delete Project
router.delete('/delete', upload.none(), (req, res) => {
    const { domain } = req.body;

    if (!domain) {
        return res.status(400).json({ success: false, error: 'Domain is required' });
    }

    // Remove from sites.json
    const sites = readSites();
    const filteredSites = sites.filter(s => s.domain !== domain);
    writeSites(filteredSites);

    const deletedUrl = `https://${domain}.${BASE_SITE_DOMAIN}`;

    res.json({
        success: true,
        data: {
            links: [deletedUrl],
            quotaUsed: 5,
            quotaLimit: 1024
        }
    });
});

// GET /v1/profile - Fetch Profile
router.get('/profile', (req, res) => {
    const sites = readSites();
    res.json({
        success: true,
        data: {
            links: sites.map(p => p.link),
            quotaUsed: 5,
            quotaLimit: 1024
        }
    });
});

module.exports = router;
