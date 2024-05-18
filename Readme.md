https://blog-api-n53y.onrender.com/


Overview
This is a Node.js blog application that allows users to create, edit, publish, and delete blog posts. Users can also search for blog posts, and view published and draft posts. The application uses Express.js as the server framework, MongoDB for the database, and EJS for templating.

Features
User authentication and authorization.
Create, edit, delete blog posts.\
Save blog posts as drafts or publish them.
Paginate published and draft blog posts.
Search for blog posts by title or content.

Setup

Prerequisites
Node.js

MongoDB

Installation
Clone the repository:

git clone https://github.com/shannychi/Blog-Api.git
cd blog-app

Install dependencies:
npm install

Set up environment variables:
Create a .env file in the root directory and add your environment variables.

MONGODB_URL=<your-mongodb-connection-string>
JWT_SECRET=<your-session-secret>

Run the application:
npm start