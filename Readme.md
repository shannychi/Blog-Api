![website image](/public//images/Screenshot%202024-05-18%20173027.png)

<https://blog-api-n53y.onrender.com/>


# Overview

 This is a Node.js blog application that allows users to create, edit, publish, and delete blog posts. Users can also search for blog posts, and view published and draft posts. The application uses Express.js as the server framework, MongoDB for the database, and EJS for templating.

# Features

* User authentication and authorization.
* Create, edit, delete blog posts.\
* Save blog posts as drafts or publish them.
* Paginate published and draft blog posts.
* Search for blog posts by title or content.

# Setup

**Prerequisites**

* Node.js
* MongoDB

# Installation

 **1. Clone the repository:**

* git clone <https://github.com/shannychi/Blog-Api.git>

* cd blog-api

**2. Install dependencies:**

npm install

**3. Set up environment variables:**

Create a .env file in the root directory and add your environment variables.

* MONGODB_URL= your-mongodb-connection-string
* JWT_SECRET= your-session-secret 

**4. Run the application:**

npm start