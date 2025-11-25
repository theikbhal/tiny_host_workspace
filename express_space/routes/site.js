const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');

/**
 * Site Rendering Routes
 * 
 * Handles serving user-uploaded sites from uploads/<sitename>/ directory
 * Supports both query parameter and path parameter access
 */

// Helper function to serve site files
const serveSiteFile = (siteName, filePath, res) => {
    const uploadsDir = path.join(__dirname, '..', 'uploads');
    const siteDir = path.join(uploadsDir, siteName);

    // Check if site directory exists
    if (!fs.existsSync(siteDir)) {
        return res.status(404).send(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Site Not Found</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        height: 100vh;
                        margin: 0;
                        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                        color: white;
                    }
                    .container {
                        text-align: center;
                        padding: 2rem;
                        background: rgba(255, 255, 255, 0.1);
                        border-radius: 10px;
                        backdrop-filter: blur(10px);
                    }
                    h1 { font-size: 3rem; margin: 0; }
                    p { font-size: 1.2rem; margin-top: 1rem; }
                    a { color: #fff; text-decoration: underline; }
                </style>
            </head>
            <body>
                <div class="container">
                    <h1>404</h1>
                    <p>Site "${siteName}" not found</p>
                    <p><a href="/">Go back home</a></p>
                </div>
            </body>
            </html>
        `);
    }

    // Determine which file to serve
    let fileToServe = filePath || 'index.html';
    const fullPath = path.join(siteDir, fileToServe);

    // Security check: prevent directory traversal
    if (!fullPath.startsWith(siteDir)) {
        return res.status(403).send('Access denied');
    }

    // Check if file exists
    if (!fs.existsSync(fullPath)) {
        // If requesting root and index.html doesn't exist, try to find any HTML file
        if (!filePath || filePath === 'index.html') {
            const files = fs.readdirSync(siteDir);
            const htmlFile = files.find(f => f.endsWith('.html'));

            if (htmlFile) {
                return res.sendFile(path.join(siteDir, htmlFile));
            }
        }

        return res.status(404).send(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>File Not Found</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        height: 100vh;
                        margin: 0;
                        background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
                        color: white;
                    }
                    .container {
                        text-align: center;
                        padding: 2rem;
                        background: rgba(255, 255, 255, 0.1);
                        border-radius: 10px;
                        backdrop-filter: blur(10px);
                    }
                    h1 { font-size: 3rem; margin: 0; }
                    p { font-size: 1.2rem; margin-top: 1rem; }
                </style>
            </head>
            <body>
                <div class="container">
                    <h1>404</h1>
                    <p>File not found: ${fileToServe}</p>
                </div>
            </body>
            </html>
        `);
    }

    // Serve the file
    res.sendFile(fullPath);
};

// Route 1: Query parameter method - /site?name=ikbhal
router.get('/site', (req, res) => {
    const siteName = req.siteName || req.query.name;

    if (!siteName) {
        return res.status(400).send(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Bad Request</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        height: 100vh;
                        margin: 0;
                        background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
                        color: #333;
                    }
                    .container {
                        text-align: center;
                        padding: 2rem;
                        background: white;
                        border-radius: 10px;
                        box-shadow: 0 10px 40px rgba(0,0,0,0.1);
                    }
                    h1 { font-size: 2.5rem; margin: 0; color: #fa709a; }
                    p { font-size: 1.1rem; margin-top: 1rem; }
                    code { background: #f5f5f5; padding: 0.2rem 0.5rem; border-radius: 3px; }
                </style>
            </head>
            <body>
                <div class="container">
                    <h1>Missing Site Name</h1>
                    <p>Please provide a site name using <code>?name=yoursite</code></p>
                    <p>Example: <code>/site?name=ikbhal</code></p>
                </div>
            </body>
            </html>
        `);
    }

    serveSiteFile(siteName, null, res);
});

// Route 2: Path parameter method - /site/ikbhal or /site/ikbhal/about.html
router.get('/site/:siteName/*', (req, res) => {
    const siteName = req.params.siteName;
    const filePath = req.params[0]; // Everything after /site/ikbhal/

    serveSiteFile(siteName, filePath, res);
});

// Route 3: Path parameter method (root) - /site/ikbhal
router.get('/site/:siteName', (req, res) => {
    const siteName = req.params.siteName;

    serveSiteFile(siteName, null, res);
});

// Route 4: Root subdomain handling (for production with nginx)
// This catches requests where subdomain is already extracted
router.get('/', (req, res, next) => {
    // Only handle if siteName was extracted from subdomain
    if (req.siteName) {
        serveSiteFile(req.siteName, null, res);
    } else {
        // Pass to next middleware (default Express routes)
        next();
    }
});

// Route 5: Subdomain with file path (for production)
router.get('/*', (req, res, next) => {
    // Only handle if siteName was extracted from subdomain
    if (req.siteName) {
        const filePath = req.path.substring(1); // Remove leading slash
        serveSiteFile(req.siteName, filePath, res);
    } else {
        // Pass to next middleware
        next();
    }
});

module.exports = router;
