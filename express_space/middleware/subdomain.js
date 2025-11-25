/**
 * Subdomain Extraction Middleware
 * 
 * Extracts site name from:
 * 1. Subdomain in production (e.g., ikbhal.tiiny.site -> ikbhal)
 * 2. Query parameter in local (?name=ikbhal)
 * 3. Path parameter in local (/site/ikbhal)
 * 
 * Attaches siteName to req.siteName for downstream handlers
 */

const extractSubdomain = (req, res, next) => {
    let siteName = null;

    // Method 1: Extract from subdomain (production)
    const host = req.get('host') || '';
    const hostname = host.split(':')[0]; // Remove port if present

    // Check if it's a subdomain of tiiny.site
    if (hostname.endsWith('.tiiny.site')) {
        const parts = hostname.split('.');
        if (parts.length >= 3) {
            // Extract subdomain (e.g., ikbhal from ikbhal.tiiny.site)
            siteName = parts[0];
        }
    }
    // Check for localhost subdomain testing (e.g., ikbhal.localhost)
    else if (hostname.endsWith('.localhost')) {
        const parts = hostname.split('.');
        if (parts.length >= 2) {
            siteName = parts[0];
        }
    }

    // Method 2: Extract from query parameter (local development)
    if (!siteName && req.query.name) {
        siteName = req.query.name;
    }

    // Method 3: Extract from path parameter (handled in route)
    // This is handled in the route definition with :siteName parameter

    // Attach to request object
    req.siteName = siteName;

    next();
};

module.exports = extractSubdomain;
