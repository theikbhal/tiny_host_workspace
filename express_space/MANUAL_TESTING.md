# Manual Testing Guide: Email/Password Authentication

Follow these steps to test the new Email/Password login flow.

## Prerequisites
- Server must be running on **port 3001**.

## Steps

### 1. Registration (Sign Up)
1.  **Open Login Page**
    -   Go to [http://localhost:3001/login.html](http://localhost:3001/login.html).
2.  **Switch to Sign Up**
    -   Click the **"Sign up"** link at the bottom.
    -   The title should change to "Create Account".
3.  **Enter Details**
    -   **Full Name**: Test User
    -   **Email**: `test@example.com`
    -   **Password**: `password123`
4.  **Submit**
    -   Click **"Sign Up"**.
    -   **Expected Result**: Success message "Registration successful! Please login." and automatic switch to Login mode.

### 2. Login
1.  **Enter Credentials**
    -   **Email**: `test@example.com`
    -   **Password**: `password123`
2.  **Submit**
    -   Click **"Login"**.
    -   **Expected Result**: Redirect to **Dashboard** ([http://localhost:3001/dashboard.html](http://localhost:3001/dashboard.html)).

### 3. Invalid Login (Negative Test)
1.  **Enter Wrong Password**
    -   **Email**: `test@example.com`
    -   **Password**: `wrongpassword`
2.  **Submit**
    -   Click **"Login"**.
    -   **Expected Result**: Error message "Invalid credentials".
