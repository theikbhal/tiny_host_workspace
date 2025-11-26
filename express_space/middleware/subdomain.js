/**
 * Subdomain Extraction Middleware
 * Supports:
 *  - ikbhal.site.naml.in
 *  - ikbhal.localhost (dev)
 *  - ?name=ikbhal fallback
 */

const extractSubdomain = (req, res, next) => {
    let siteName = null;

    const host = req.get('host') || '';
    const hostname = host.split(':')[0];

    // ✅ Production: *.simplhost.naml.in
    if (hostname.endsWith('.simplhost.com')) {
        const parts = hostname.split('.');
        if (parts.length >= 4) {
            siteName = parts[0];
        }
    }

    // ✅ Local testing: ikbhal.localhost
    else if (hostname.endsWith('.localhost')) {
        const parts = hostname.split('.');
        if (parts.length >= 2) {
            siteName = parts[0];
        }
    }

    // ✅ Fallback: query parameter
    if (!siteName && req.query.name) {
        siteName = req.query.name;
    }

    // attach to request
    req.siteName = siteName;

    next();
};

module.exports = extractSubdomain;
