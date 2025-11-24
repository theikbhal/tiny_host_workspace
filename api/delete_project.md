# Delete Project

Delete a project from Tiiny Host.

## Request

**Method**: `DELETE`
**URL**: `https://ext.tiiny.host/v1/delete`

### Headers

| Key | Value | Description |
| :--- | :--- | :--- |
| `x-api-key` | `YOUR_API_KEY` | Your API Key |

### Body (multipart/form-data)

| Key | Type | Description |
| :--- | :--- | :--- |
| `domain` | String | The domain of the project to delete. |

### Example Request

```bash
curl --location --request DELETE 'https://ext.tiiny.host/v1/delete' \
--header 'x-api-key: YOUR_API_KEY' \
--form 'domain="abc.tiiny.site"'
```

## Responses

### Success (200 OK)

```json
{
  "success": true,
  "data": {
    "links": [
      "abc.tiiny.site",
      "abc.myblog.info"
    ],
    "quotaUsed": 5,
    "quotaLimit": 1024
  }
}
```
