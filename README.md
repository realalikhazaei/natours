# 🏞️ Natours
A comprehensive RESTful API for a fictional tour-booking application, built as an in-depth course project.
The backend powers features for tour management, user authentication, payments, and reviews.
It also includes server-side rendered views using the Pug templating engine to display tours and map locations.

## Key Features:

* User Management: Secure user authentication and authorization using JSON Web Tokens (JWT).
* Role-Based Access Control: Differentiated permissions for users, guides, lead-guides and admins.
* Tour & Booking Operations: Full CRUD functionality for tours, including a complete booking and payment cycle.
* Reviews & Ratings: System for users to review and rate tours they have completed.
* Geospatial Data: Integration with maps to display tour start/stop locations.

## Tech Stack:

* Backend: Node.js, Express.js
* Database: MongoDB with Mongoose
* Templating: Pug
* Authentication: JWT, Bcryptjs
* Payments: Zibal

## Setup and Installation

```
# Clone the master branch of repository

git clone --branch master https://github.com/realalikhazaei/natours

# Install the required dependencies:

npm install

# Create a config.env file in the root directory and add the necessary environment variables.

# Required Variables
NODE_ENV = development or production
DATABASE_URL = <your_mongodb_connection_string>
JWT_SECRET = <your jwt secret string>
JWT_EXPIRES_IN = <jwt expiration time>
BCRYPT_HASH_COST = <password hashing cost - 12 is recommended>
COOKIE_EXPIRES = <cookie expiration time - enter the days number>
SMTP_FROM = <your smtp source email>
SMTP_HOST = <smtp service host>
SMTP_PORT = <smtp service port>
SMTP_USER = <your smtp service username>
SMTP_PASS = <your smtp service password>

# Start the server in development environment:

npm start

# Start the server in production environment:

npm run start:prod
```
