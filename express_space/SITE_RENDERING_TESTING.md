# Site Rendering - Manual Testing Guide

This guide explains how to manually test the subdomain-based site rendering system in both local and production environments.

## Prerequisites

- Server running on `http://localhost:3000`
- Authentication token (if required)

## Test Scenarios

### 1. Prepare Test Site Content

First, create a simple test site to upload:

**Option A: Single HTML File**
```bash
# Create a test HTML file
echo "<html><head><title>Test Site</title></head><body><h1>Hello from ikbhal site!</h1><p>This is a test site.</p></body></html>" > test-site.html
```

**Option B: Multiple Files (ZIP)**
```bash
# Create a directory with multiple files
mkdir test-site
echo "<html><head><title>Test Site</title></head><body><h1>Welcome to ikbhal!</h1><a href='about.html'>About</a></body></html>" > test-site/index.html
echo "<html><head><title>About</title></head><body><h1>About Page</h1><a href='index.html'>Home</a></body></html>" > test-site/about.html

# Create a ZIP file
# On Windows PowerShell:
Compress-Archive -Path test-site\* -DestinationPath test-site.zip
```

---

### 2. Upload Test Site via API

**Using cURL:**
```bash
# Upload with subdomain name "ikbhal"
curl -X POST http://localhost:3000/v1/upload \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "files=@test-site.html" \
  -F "domain=ikbhal"

# Or upload ZIP file
curl -X POST http://localhost:3000/v1/upload \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "files=@test-site.zip" \
  -F "domain=ikbhal"
```

**Using Postman:**
1. Create POST request to `http://localhost:3000/v1/upload`
2. Add Authorization header: `Bearer YOUR_TOKEN`
3. In Body tab, select "form-data"
4. Add fields:
   - `files` (File): Select your HTML or ZIP file
   - `domain` (Text): `ikbhal`
5. Send request

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "link": "ikbhal.tiiny.site",
    "status": "active",
    "profile": {
      "quotaUsed": 5,
      "quotaLimit": 1024
    }
  }
}
```

---

### 3. Verify File Structure

Check that files are stored correctly:

```bash
# Navigate to uploads directory
cd c:\workspace\tiny_host_workspace\express_space\uploads

# List contents - should see ikbhal directory
dir

# Check ikbhal directory contents
dir ikbhal
```

**Expected Structure:**
```
uploads/
  └── ikbhal/
      ├── index.html
      └── about.html (if multi-file site)
```

---

### 4. Test Local Access - Query Parameter Method

**Browser Test:**
1. Open browser
2. Navigate to: `http://localhost:3000/site?name=ikbhal`
3. Should display the uploaded site content

**cURL Test:**
```bash
curl http://localhost:3000/site?name=ikbhal
```

**Expected Result:**
- HTML content of the site is displayed
- If ZIP was uploaded, `index.html` is served by default

---

### 5. Test Local Access - Path Parameter Method

**Browser Test:**
1. Open browser
2. Navigate to: `http://localhost:3000/site/ikbhal`
3. Should display the uploaded site content

**cURL Test:**
```bash
curl http://localhost:3000/site/ikbhal
```

**Expected Result:**
- Same as query parameter method
- HTML content displayed correctly

---

### 6. Test Specific File Access (Multi-file Sites)

If you uploaded a multi-file site:

**Browser Test:**
1. Navigate to: `http://localhost:3000/site/ikbhal/about.html`
2. Should display the about page

**cURL Test:**
```bash
curl http://localhost:3000/site/ikbhal/about.html
```

---

### 7. Test Viewer Page

**Browser Test:**
1. Navigate to: `http://localhost:3000/viewer.html`
2. Enter site name: `ikbhal`
3. Click submit/view button
4. Should redirect to site rendering page

---

### 8. Test Error Handling - Non-existent Site

**Browser Test:**
1. Navigate to: `http://localhost:3000/site?name=nonexistent`
2. Should show "Site not found" error (404)

**cURL Test:**
```bash
curl -i http://localhost:3000/site?name=nonexistent
```

**Expected Response:**
- HTTP 404 status
- Error message: "Site not found"

---

### 9. Test Production Subdomain (Requires nginx)

> **Note:** This requires nginx configuration and DNS/hosts file setup

**Hosts File Setup (for local testing):**

Edit your hosts file:
- Windows: `C:\Windows\System32\drivers\etc\hosts`
- Add line: `127.0.0.1 ikbhal.tiiny.site`

**Browser Test:**
1. Navigate to: `http://ikbhal.tiiny.site`
2. Should display the uploaded site

**nginx Configuration Required:**
```nginx
server {
    listen 80;
    server_name *.tiiny.site;

    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

---

## Test Checklist

- [ ] Upload single HTML file with domain name
- [ ] Upload ZIP file with multiple pages
- [ ] Verify files stored in `uploads/<domain>/` directory
- [ ] Access site via query parameter: `?name=ikbhal`
- [ ] Access site via path parameter: `/site/ikbhal`
- [ ] Access specific files in multi-file site
- [ ] Test viewer page functionality
- [ ] Test 404 for non-existent sites
- [ ] Test subdomain access (if nginx configured)

---

## Troubleshooting

### Site Not Found
- Check if files exist in `uploads/<sitename>/` directory
- Verify site name matches exactly (case-sensitive)
- Check server logs for errors

### Files Not Serving
- Ensure `index.html` exists for default page
- Check file permissions
- Verify MIME types are set correctly

### Subdomain Not Working
- Verify nginx configuration
- Check hosts file entries
- Ensure DNS is configured correctly
- Verify proxy headers are being passed

---

## Quick Test Commands

```bash
# 1. Upload test site
curl -X POST http://localhost:3000/v1/upload -H "Authorization: Bearer YOUR_TOKEN" -F "files=@test.html" -F "domain=ikbhal"

# 2. View via query parameter
curl http://localhost:3000/site?name=ikbhal

# 3. View via path parameter
curl http://localhost:3000/site/ikbhal

# 4. Test non-existent site
curl -i http://localhost:3000/site?name=fake
```
