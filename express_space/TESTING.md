# Testing Tiiny Host Mock API with Postman

## Prerequisites
-   [Postman](https://www.postman.com/downloads/) installed.
-   Server running on `http://localhost:3000`.

## 1. Fetch Profile (GET)
1.  Create a new request.
2.  Set method to **GET**.
3.  Set URL to `http://localhost:3000/v1/profile`.
4.  Go to **Headers** tab.
5.  Add key `x-api-key` with value `test-key`.
6.  Click **Send**.
7.  **Expected Result**: JSON with `quotaUsed` and `quotaLimit`.

## 2. Upload Project (POST)
1.  Create a new request.
2.  Set method to **POST**.
3.  Set URL to `http://localhost:3000/v1/upload`.
4.  Go to **Headers** tab.
5.  Add key `x-api-key` with value `test-key`.
6.  Go to **Body** tab.
7.  Select **form-data**.
8.  Add key `files` (type: **File**) and select a file (e.g., a zip or html file).
9.  Add key `domain` (type: **Text**) with value `my-new-site`.
10. Click **Send**.
11. **Expected Result**: JSON with `link` and `status: active`.

## 3. Delete Project (DELETE)
1.  Create a new request.
2.  Set method to **DELETE**.
3.  Set URL to `http://localhost:3000/v1/delete`.
4.  Go to **Headers** tab.
5.  Add key `x-api-key` with value `test-key`.
6.  Go to **Body** tab.
7.  Select **form-data**.
8.  Add key `domain` (type: **Text**) with value `my-new-site`.
9.  Click **Send**.
10. **Expected Result**: JSON confirming deletion.
