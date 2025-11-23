# Tiiny Host API Analysis

## Overview
The Tiiny Host API allows developers to programmatically manage their static sites ("projects"). It requires a paid account and an API key for authentication.

## Authentication
- **Method**: API Key
- **Header**: `Authorization: Bearer <YOUR_API_KEY>` (Standard Bearer token format is implied, or potentially just the key depending on specific endpoint docs).
- **Generation**: API keys are generated in the "Manage Account" section of the Tiiny Host dashboard.

## Core Resources

### Projects
The central entity is a "Project", which represents a deployed site.

- **Create Project (`POST /project`)**
    - Used to upload and deploy a new site.
    - Likely accepts a file (ZIP, HTML, PDF, etc.) and a project name/subdomain.
    - Supports over 100 file formats.

- **Update Project (`PUT /project`)**
    - Used to update the content of an existing site.
    - Probably similar to creation but targets an existing project ID or name.

- **Delete Project (`DELETE /project`)**
    - Removes a site and its content.

### User
- **Get Profile (`GET /profile`)**
    - Retrieves account details, likely including subscription status and usage limits.

## Key Features
- **Wide File Support**: Supports uploading various file types directly (HTML, ZIP, PDF, etc.).
- **Simple Lifecycle**: Create -> Update -> Delete workflow.
- **Paid Feature**: API access is restricted to paid plans.

## Comparison with Our Implementation
| Feature | Tiiny Host API | Our Tiny Host Backend |
| :--- | :--- | :--- |
| **Auth** | API Key (Paid) | JWT Token (User Login) |
| **Uploads** | Projects (ZIP/HTML/PDF+) | Sites (ZIP/HTML) |
| **Versioning** | Update (PUT) | Overwrite (POST with flag) |
| **Structure** | `/project` based | `/upload` & `/delete` |
| **Metadata** | Profile endpoint | Profile endpoint |

## Recommendations for "Tiny Host" Evolution
1.  **API Keys**: Implement persistent API keys for users so they can use tools (CLI, CI/CD) without logging in via a browser session every time.
2.  **Project ID**: Move from just `folderName` to a stable `projectId` to allow renaming sites without breaking links or logic.
3.  **PUT Support**: Adopt RESTful standards by adding `PUT` for updates instead of overloading `POST`.
