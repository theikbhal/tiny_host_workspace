const express = require('express');
const router = express.Router();
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const path = require('path');

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// Mock data store
const projects = {};

// POST /v1/upload - Create Project
router.post('/upload', upload.single('files'), (req, res) => {
    const { siteSettings, domain } = req.body;
    const file = req.file;

    if (!file) {
        return res.status(400).json({ success: false, error: 'No file uploaded' });
    }

    const projectId = domain || uuidv4();
    const link = `${projectId}.tiiny.site`;

    projects[projectId] = {
        id: projectId,
        link: link,
        status: 'active',
        file: file.path,
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

    // In a real app, check if project exists. For mock, we just upsert/update.
    const projectId = domain; // Simplified
    const link = `${projectId}.tiiny.site`;

    projects[projectId] = {
        ...projects[projectId],
        id: projectId,
        link: link,
        status: 'active',
        file: file ? file.path : projects[projectId]?.file,
        settings: siteSettings ? JSON.parse(siteSettings) : (projects[projectId]?.settings || {}),
        updatedAt: new Date()
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
