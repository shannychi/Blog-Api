const express = require('express');
const Blog = express.Router();
const createdBlog = require("../Models/BlogPost");
const BlogUser = require("../Models/Users");
const mongoose = require("mongoose")
var ObjectId = require('mongodb').ObjectID;


const Pages = 20;

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if(token == null) {
        return res.status(401).send( "Unauthorized" );
    }
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if(err) {
            return res.status(403).send("forbidden")
        }
        req.user = user;
        next();
    })
}

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
    res.status(200)
})

Blog.post('/posts', authenticateToken, async(req, res) => {
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


Blog.get('/posts/published', async(req, res) => {
    try {

        const perPage = parseInt(req.query.page) || 1;

        const skip = (perPage - 1) * Pages;

        const published = await createdBlog
        .find({status: 'published'})
        .skip(skip)
        .limit(Pages);

       res.render("Published.ejs", {posts: published})
    }
    catch (err) {
        console.error('error getting draft post:', err)
        res.status(500).json({
            message: 'server error'
        })
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

Blog.get('/posts/edit/:id', authenticateToken, async (req, res) => {
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


Blog.post('/posts/update/:id', authenticateToken, async(req, res) => {
    try {

        let id = req.params.id
         const {title, content, status} = req.body;

         try{
            const updatedPost = await createdBlog.findByIdAndUpdate(id, { title, content, status, id }, { new: true });

            if (!updatedPost) {
                return res.status(404).send('Post not found');
            }
    
         }
         catch(error){
            console.log(error)
            res.send("an error occured")
         }
        
        
        res.send("update successful")

        // if (status === 'draft') {
        //     res.status(200).redirect('/posts/drafts');
        // } else if (status === 'published') {
        //     res.status(200).redirect(`/posts/published`);
        // }
    } catch (error) {
        console.error('Error editing post:', error);
        res.status(500).send('Server error');
    }
})


Blog.delete('/posts/delete/:id', authenticateToken, async (req, res) => {
    try {
        const postId = req.params.id;
        const deletedPost = await createdBlog.findByIdAndDelete(postId);
        if (!deletedPost) {
            return res.status(404).json({ message: 'Post not found' });
        }
        res.redirect('/posts/drafts');
    } catch (error) {
        console.error('Error deleting post:', error);
        res.status(500).json({ message: 'Server error' });
    }
});



Blog.get('/posts/publish/:id',authenticateToken , async (req, res) => {
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