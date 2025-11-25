const express = require('express');
const router = express.Router();
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const fs = require('fs');
const AdmZip = require('adm-zip');

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

// Mock data store
const projects = {};

// Helper function to ensure directory exists
const ensureDir = (dirPath) => {
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
    }
};

// Helper function to process uploaded file
const processUploadedFile = (file, domain) => {
    const siteDir = path.join(__dirname, '..', 'uploads', domain);
    ensureDir(siteDir);

    const fileExt = path.extname(file.originalname).toLowerCase();

    if (fileExt === '.zip') {
        // Extract ZIP file
        try {
            const zip = new AdmZip(file.path);
            zip.extractAllTo(siteDir, true);

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

// Ensure temp directory exists
ensureDir(path.join(__dirname, '..', 'uploads', 'temp'));

// POST /v1/upload - Create Project
router.post('/upload', upload.single('files'), (req, res) => {
    const { siteSettings, domain } = req.body;
    const file = req.file;

    if (!file) {
        return res.status(400).json({ success: false, error: 'No file uploaded' });
    }

    const projectId = domain || uuidv4();
    const link = `${projectId}.tiiny.site`;

    // Process the uploaded file
    const result = processUploadedFile(file, projectId);

    if (!result.success) {
        return res.status(500).json({ success: false, error: result.error });
    }

    projects[projectId] = {
        id: projectId,
        link: link,
        status: 'active',
        fileType: result.type,
        settings: siteSettings ? JSON.parse(siteSettings) : {},
        createdAt: new Date()
    };

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
    const link = `${projectId}.tiiny.site`;

    // Process the uploaded file if provided
    if (file) {
        const result = processUploadedFile(file, projectId);

        if (!result.success) {
            return res.status(500).json({ success: false, error: result.error });
        }

        projects[projectId] = {
            ...projects[projectId],
            id: projectId,
            link: link,
            status: 'active',
            fileType: result.type,
            settings: siteSettings ? JSON.parse(siteSettings) : (projects[projectId]?.settings || {}),
            updatedAt: new Date()
        };
    } else {
        // Update settings only
        projects[projectId] = {
            ...projects[projectId],
            id: projectId,
            link: link,
            status: 'active',
            settings: siteSettings ? JSON.parse(siteSettings) : (projects[projectId]?.settings || {}),
            updatedAt: new Date()
        };
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

    // Mock deletion
    delete projects[domain];

    res.json({
        success: true,
        data: {
            links: [
                `${domain}.tiiny.site`,
                `${domain}.myblog.info`
            ],
            quotaUsed: 5,
            quotaLimit: 1024
        }
    });
});

// GET /v1/profile - Fetch Profile
router.get('/profile', (req, res) => {
    res.json({
        success: true,
        data: {
            links: Object.values(projects).map(p => p.link),
            quotaUsed: 5,
            quotaLimit: 1024
        }
    });
});

module.exports = router;
