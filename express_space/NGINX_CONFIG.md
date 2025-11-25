# Nginx Configuration for Production

This document explains how to configure nginx for production deployment with wildcard subdomain routing.

## Overview

In production, nginx will:
- Handle wildcard subdomain requests (`*.tiiny.site`)
- Proxy requests to the Express server
- Pass the subdomain information via the `Host` header
- The Express middleware will extract the subdomain and serve the appropriate site

---

## Nginx Configuration

### Basic Configuration

Create or edit your nginx configuration file (e.g., `/etc/nginx/sites-available/tiiny-host`):

```nginx
server {
    listen 80;
    listen [::]:80;
    
    # Wildcard subdomain - matches any subdomain of tiiny.site
    server_name *.tiiny.site tiiny.site;

    # Logging
    access_log /var/log/nginx/tiiny-host-access.log;
    error_log /var/log/nginx/tiiny-host-error.log;

    # Proxy to Express server
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        
        # Important: Pass the original Host header
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # WebSocket support (if needed)
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_cache_bypass $http_upgrade;
    }
}
```

### SSL/HTTPS Configuration (Recommended)

For production with SSL certificates:

```nginx
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    
    server_name *.tiiny.site tiiny.site;

    # SSL certificates (use Let's Encrypt with wildcard cert)
    ssl_certificate /etc/letsencrypt/live/tiiny.site/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/tiiny.site/privkey.pem;
    
    # SSL configuration
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    # Logging
    access_log /var/log/nginx/tiiny-host-ssl-access.log;
    error_log /var/log/nginx/tiiny-host-ssl-error.log;

    # Proxy to Express server
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_cache_bypass $http_upgrade;
    }
}

# Redirect HTTP to HTTPS
server {
    listen 80;
    listen [::]:80;
    
    server_name *.tiiny.site tiiny.site;
    
    return 301 https://$host$request_uri;
}
```

---

## DNS Configuration

### Wildcard DNS Record

You need to set up a wildcard DNS record for your domain:

**DNS Records:**
```
Type    Name        Value           TTL
A       @           YOUR_SERVER_IP  3600
A       *           YOUR_SERVER_IP  3600
```

This configuration:
- `@` points the root domain (`tiiny.site`) to your server
- `*` points all subdomains (`*.tiiny.site`) to your server

### Example DNS Settings

If your server IP is `123.45.67.89`:

```
A       @           123.45.67.89    3600
A       *           123.45.67.89    3600
```

---

## SSL Certificate with Let's Encrypt

To get a wildcard SSL certificate:

```bash
# Install certbot
sudo apt-get install certbot python3-certbot-nginx

# Get wildcard certificate (requires DNS challenge)
sudo certbot certonly --manual --preferred-challenges dns -d tiiny.site -d *.tiiny.site

# Follow the prompts to add TXT records to your DNS
# After verification, certificates will be in /etc/letsencrypt/live/tiiny.site/
```

**Note:** Wildcard certificates require DNS challenge verification, not HTTP challenge.

---

## Deployment Steps

### 1. Enable Nginx Configuration

```bash
# Create symlink to enable site
sudo ln -s /etc/nginx/sites-available/tiiny-host /etc/nginx/sites-enabled/

# Test nginx configuration
sudo nginx -t

# Reload nginx
sudo systemctl reload nginx
```

### 2. Start Express Server

Use a process manager like PM2:

```bash
# Install PM2
npm install -g pm2

# Start the server
cd /path/to/express_space
pm2 start server.js --name tiiny-host

# Save PM2 configuration
pm2 save

# Enable PM2 on system startup
pm2 startup
```

### 3. Verify Configuration

Test that everything works:

```bash
# Test main domain
curl http://tiiny.site

# Test subdomain
curl http://ikbhal.tiiny.site
```

---

## How It Works

### Request Flow

1. **User visits:** `http://ikbhal.tiiny.site`
2. **DNS resolves** to your server IP
3. **Nginx receives** the request with `Host: ikbhal.tiiny.site`
4. **Nginx proxies** to Express server on `localhost:3000`
5. **Express middleware** extracts `ikbhal` from the Host header
6. **Express serves** files from `uploads/ikbhal/` directory

### Subdomain Extraction

The Express middleware (`middleware/subdomain.js`) extracts the subdomain:

```javascript
// Host header: ikbhal.tiiny.site
// Extracted subdomain: ikbhal
// Serves from: uploads/ikbhal/
```

---

## Troubleshooting

### Subdomain Not Working

**Check nginx configuration:**
```bash
sudo nginx -t
sudo tail -f /var/log/nginx/tiiny-host-error.log
```

**Verify DNS:**
```bash
nslookup ikbhal.tiiny.site
dig ikbhal.tiiny.site
```

**Check Express logs:**
```bash
pm2 logs tiiny-host
```

### 502 Bad Gateway

This means nginx can't reach the Express server:

```bash
# Check if Express is running
pm2 status

# Check if port 3000 is listening
netstat -tulpn | grep 3000

# Restart Express
pm2 restart tiiny-host
```

### SSL Certificate Issues

```bash
# Check certificate validity
sudo certbot certificates

# Renew certificates
sudo certbot renew

# Test renewal
sudo certbot renew --dry-run
```

---

## Local Testing with Hosts File

For local testing without DNS:

**Windows:** Edit `C:\Windows\System32\drivers\etc\hosts`
**Linux/Mac:** Edit `/etc/hosts`

Add:
```
127.0.0.1 ikbhal.tiiny.site
127.0.0.1 test.tiiny.site
```

Then you can test locally:
```bash
curl http://ikbhal.tiiny.site:3000
```

---

## Performance Optimization

### Enable Gzip Compression

Add to nginx configuration:

```nginx
gzip on;
gzip_vary on;
gzip_min_length 1024;
gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;
```

### Enable Caching

```nginx
location ~* \.(jpg|jpeg|png|gif|ico|css|js)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```

### Rate Limiting

```nginx
# Define rate limit zone
limit_req_zone $binary_remote_addr zone=upload_limit:10m rate=10r/s;

# Apply to upload endpoint
location /v1/upload {
    limit_req zone=upload_limit burst=20;
    proxy_pass http://localhost:3000;
}
```

---

## Security Considerations

1. **Firewall:** Only allow ports 80, 443, and 22 (SSH)
2. **SSL:** Always use HTTPS in production
3. **File Upload:** Implement file size limits and validation
4. **Rate Limiting:** Prevent abuse with nginx rate limiting
5. **CORS:** Configure CORS properly in Express
6. **Authentication:** Secure the upload API with proper authentication

---

## Monitoring

### Check Server Status

```bash
# Nginx status
sudo systemctl status nginx

# Express status
pm2 status

# View logs
pm2 logs tiiny-host --lines 100
sudo tail -f /var/log/nginx/tiiny-host-access.log
```

### Monitor Resources

```bash
# CPU and memory
htop

# Disk usage
df -h

# Check uploads directory size
du -sh /path/to/express_space/uploads
```
