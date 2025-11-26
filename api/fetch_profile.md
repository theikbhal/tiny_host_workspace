# Fetch Profile

Retrieve your Tiiny Host profile information, including quota usage.

## Request

**Method**: `GET`
**URL**: `https://ext.host.naml.in/v1/profile`

### Headers

| Key | Value | Description |
| :--- | :--- | :--- |
| `x-api-key` | `YOUR_API_KEY` | Your API Key |

### Example Request

```bash
curl --location --request GET 'https://ext.host.naml.in/v1/profile' \
--header 'x-api-key: YOUR_API_KEY'
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
