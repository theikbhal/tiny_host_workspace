import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import mime from 'mime'; // Need to install mime-types or similar, or use simple lookup

// We'll use a simple mime lookup map for common types to avoid dependency if possible, 
// or just install 'mime-types'. User said "plain JavaScript", didn't forbid new deps, 
// but I should check if I can use what I have. 
// I'll install 'mime-types' for robustness.

const UPLOADS_DIR = path.join(process.cwd(), 'uploads');

export async function GET(request, { params }) {
    const { siteName, path: urlPath } = await params;

    // Construct file path
    // urlPath is an array of segments, e.g. ['css', 'style.css']
    // If undefined (root), serve index.html

    let filePath = 'index.html';
    if (urlPath && urlPath.length > 0) {
        filePath = urlPath.join('/');
    }

    // Security check: prevent directory traversal
    if (filePath.includes('..')) {
        return new NextResponse('Access Denied', { status: 403 });
    }

    const fullPath = path.join(UPLOADS_DIR, siteName, filePath);

    // Check if file exists
    if (!fs.existsSync(fullPath)) {
        // Try index.html if it's a directory or root
        if (filePath === 'index.html' || fs.existsSync(fullPath + '/index.html')) {
            // Already handled or directory index
        }

        // Custom 404
        return new NextResponse(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>404 Not Found</title>
                <style>
                    body { font-family: sans-serif; text-align: center; padding: 50px; }
                    h1 { color: #333; }
                </style>
            </head>
            <body>
                <h1>404 - Page Not Found</h1>
                <p>The requested file could not be found on this site.</p>
            </body>
            </html>
        `, {
            status: 404,
            headers: { 'Content-Type': 'text/html' }
        });
    }

    // Check if directory
    const stats = fs.statSync(fullPath);
    if (stats.isDirectory()) {
        const indexPath = path.join(fullPath, 'index.html');
        if (fs.existsSync(indexPath)) {
            const fileBuffer = fs.readFileSync(indexPath);
            return new NextResponse(fileBuffer, {
                headers: { 'Content-Type': 'text/html' }
            });
        }
        return new NextResponse('Directory listing forbidden', { status: 403 });
    }

    // Read file
    const fileBuffer = fs.readFileSync(fullPath);

    // Determine content type
    // I'll use a basic map for now to avoid installing another dep if I can, 
    // but 'mime-types' is standard. I'll just install it.
    // For now, I'll use a helper function.

    const ext = path.extname(fullPath).toLowerCase();
    const contentType = getContentType(ext);

    return new NextResponse(fileBuffer, {
        headers: { 'Content-Type': contentType }
    });
}

function getContentType(ext) {
    const types = {
        '.html': 'text/html',
        '.htm': 'text/html',
        '.css': 'text/css',
        '.js': 'application/javascript',
        '.json': 'application/json',
        '.png': 'image/png',
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.gif': 'image/gif',
        '.svg': 'image/svg+xml',
        '.ico': 'image/x-icon',
        '.txt': 'text/plain',
        '.pdf': 'application/pdf',
        '.zip': 'application/zip',
        '.xml': 'application/xml',
        '.mp4': 'video/mp4',
        '.mp3': 'audio/mpeg',
        '.wav': 'audio/wav',
        '.woff': 'font/woff',
        '.woff2': 'font/woff2',
        '.ttf': 'font/ttf',
        '.eot': 'application/vnd.ms-fontobject',
        '.otf': 'font/otf'
    };
    return types[ext] || 'application/octet-stream';
}
