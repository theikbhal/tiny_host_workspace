# Create Project

Upload a new project to Tiiny Host.

## Request

**Method**: `POST`
**URL**: `https://ext.host.naml.in/v1/upload`

### Headers

| Key | Value | Description |
| :--- | :--- | :--- |
| `x-api-key` | `YOUR_API_KEY` | Your API Key |

### Body (multipart/form-data)

| Key | Type | Description |
| :--- | :--- | :--- |
| `files` | File | The file to upload (e.g., .zip, .html, .pdf). |
| `siteSettings` | JSON String | Optional. Settings for the site (e.g., password). |
| `domain` | String | Optional. Custom domain or subdomain. |

### Example Request

```bash
curl --location --request POST 'https://ext.host.naml.in/v1/upload' \
--header 'x-api-key: YOUR_API_KEY' \
--form 'files="/path/to/file.zip"' \
--form 'siteSettings="{ \"password\": \"he!!ow0rld\", \"passwordProtected\": true }"' \
--form 'domain="my-project.tiiny.co"'
```

## Responses

### Success (200 OK)

```json
{
  "success": true,
  "data": {
    "link": "something.tiiny.site",
    "status": "active",
    "profile": {
      "quotaUsed": 5,
      "quotaLimit": 1024
    }
  }
}
```
