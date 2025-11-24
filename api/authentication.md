# Authentication

The Tiiny Host API uses API keys to authenticate requests. You can view and manage your API keys in the [Tiiny Host Dashboard](https://tiiny.host/manage/account).

## Using the API Key

Authentication to the API is performed via the `x-api-key` header.

### Example

```bash
curl --location --request GET 'https://ext.tiiny.host/v1/profile' \
--header 'x-api-key: YOUR_API_KEY'
```

> [!NOTE]
> You must replace `YOUR_API_KEY` with your actual API key.
