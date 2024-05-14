const { Router } = require('express');

const admincontrollers = require('../controllers/admincontrollers')
const { checkUser, requireAuth  } = require("../middlewares/authmiddlewares");
const Blog = Router();



Blog.get('/posts',checkUser, requireAuth,  admincontrollers.Blog_get)

Blog.post('/posts', checkUser, requireAuth, admincontrollers.Blog_post)


Blog.get('/posts/published', admincontrollers.published)


Blog.get('/posts/drafts', checkUser, requireAuth, admincontrollers.draft)


Blog.get('/posts/publishedblogs', checkUser, requireAuth,  admincontrollers.get_UserPublished_Blog)


Blog.get('/post/:id', admincontrollers.get_post_id)


Blog.post('/post/search', admincontrollers.SearchPost)

Blog.get('/edit-post/:id', checkUser, requireAuth,  admincontrollers.edit_blog_get)


Blog.post('/edit-post/:id', admincontrollers.edit_blog_post);


Blog.delete('/delete-post/:id', checkUser, requireAuth, admincontrollers.delete_post);







module.exports = Blog;