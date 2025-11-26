# Update Project

Update an existing project on Tiiny Host.

## Request

**Method**: `PUT`
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
| `domain` | String | The domain of the project to update. |

### Example Request

```bash
curl --location --request PUT 'https://ext.host.naml.in/v1/upload' \
--header 'x-api-key: YOUR_API_KEY' \
--form 'files="/path/to/file.zip"' \
--form 'siteSettings="{ \"password\": \"he!!ow0rld\", \"passwordProtected\": true }"' \
--form 'domain="my-project.tiiny.site"'
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
