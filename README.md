This project is a Backend-end user authentication system built with Node.js, Express, and MongoDB. It includes functionalities for user registration, login, forgot password, and change password.
The project uses JSON Web Tokens (JWT) for authentication and bcrypt for password hashing.

Features
User registration
User login
Password reset (Forgot Password)
Password change
JWT for secure authentication
Bcrypt for password hashing


API Endpoints
Registration
Endpoint: POST /register
Description: Register a new user

Login
Endpoint: POST /login
Description: Login a user

Reset Password
Endpoint: POST /reset-password
Description: Reset the user's password

Send-reset-password-email
Endpoint: POST /send-reset-password-email
Description: Send Link to create new password
