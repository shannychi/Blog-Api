const express = require('express');
const Blog = express.Router();
const createdBlog = require("../Models/BlogPost");
const BlogUser = require("../Models/Users");


// function authenticateToken(req, res, next) {
//     const authHeader = req.headers['authorization'];
//     const token = authHeader && authHeader.split(' ')[1];
//     if(token == null) {
//         return res.status(401).send( "Unauthorized" );
//     }
//     jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
//         if(err) {
//             return res.status(403).send("forbidden")
//         }
//         req.user = user;
//         next();
//     })
// }

// async function checkOwner(req, res, next) {
//     try {
//         const postId = req.params.id;
//         if(!post) {
//             return res.status(404).send("page not found")
//         }
//         if(post.author.toString() !== req.user.id) {
//             return res.status(403).send("unauthorized")
//         }
//         next();
//     } catch(error) {
//         console.error('error checking wuthor', error);
//         res.status(500).send('Server error')
//     }
// }

Blog.get('/posts', (req, res) => {
    res.render("createBlog.ejs")
})

Blog.post('/posts', async(req, res) => {
    try {
        const { title, content, status} = req.body;
        console.log(req.body)
        const newBlog = new createdBlog({
            title,
            content,
            status
            //  author: req.user.id
        });
        await newBlog.save();

        if(status === 'draft'){
            res.status(200).redirect("/posts/drafts")
        }
        else if (status === 'published') {
            res.status(200).redirect("/posts/published")
        }
        else {
            res.status(400).send("invaild status")
        }
    }
    catch(error) {
        console.error('error creating blog post', error);
        res.status(500).send("server error")
    }
})

Blog.get('/posts/drafts', async(req, res) => {
    try {
        const drafts = await createdBlog.find({status: 'draft'})
        res.render('Draft.ejs', {drafts})
    }
    catch (err) {
        console.error('error getting draft post:', err)
        res.status(500).json({
            message: 'server error'
        })
    }
})

Blog.get('/posts/published', async(req, res) => {
    try {
        const published = await createdBlog.find({status: 'published'})
       res.render("Published.ejs", {posts: published})
    }
    catch (err) {
        console.error('error getting draft post:', err)
        res.status(500).json({
            message: 'server error'
        })
    }
})

Blog.get('/posts/:id/edit', async (req, res) => {
    try{
        const post = await createdBlog.findById(req.params.id);
       
        if(!post) {
            return res.status(404).send('post not found')
        }

        const {title, content} = post;
        res.render('editBlog.ejs', {
            title: title,
            content: content
        });
    } catch (err) {
        console.error('error gettin post:'. err);
        res.status(500).send('server error')
    }
})

Blog.post('/posts/:id/edit' , async(req, res) => {
   

    try {
        const {title, content, status} = req.body;
        
        const updatedPost = await createdBlog.findByIdAndUpdate(req.params.id, { title, content, status }, { new: true });

        if (!updatedPost) {
            return res.status(404).send('Post not found');
        }

        if (status === 'draft') {
            res.status(200).redirect(`/posts/drafts`);
        } else if (status === 'published') {
            res.status(200).redirect(`/posts/published`);
        }
    } catch (error) {
        console.error('Error editing post:', error);
        res.status(500).send('Server error');
    }
})

Blog.get('/posts/:id/publish' , async (req, res) => {
    try {
        const postId = req.params.id;
        const updatedPost = await createdBlog.findByIdAndUpdate(postId, { status: 'published' }, { new: true });
        
        if (!updatedPost) {
            return res.status(404).json({ message: 'Post not found' });
        }
        
        res.redirect('/posts/published');
    } catch (error) {
        console.error('Error publishing post:', error);
        res.status(500).json({ message: 'Server error' });
    }
});


module.exports = Blog;