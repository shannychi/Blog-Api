const express = require('express');
const Blog = express.Router();
const createdBlog = require("../Models/BlogPost");
const BlogUser = require("../Models/Users");
const mongoose = require("mongoose")
var ObjectId = require('mongodb').ObjectID;
const { checkUser, requireAuth  } = require("../middlewares/authmiddlewares");

const Pages = 10;

Blog.get('/posts', requireAuth, checkUser,  (req, res) => {
    res.render("createBlog.ejs")
    res.status(200)
})

Blog.post('/posts', async(req, res) => {
    try {
        const { title, content, status, body} = req.body;
        console.log(req.body)
        const newBlog = new createdBlog({
            title,
            content,
            body,
            // createdAt,
            // updatedAt,
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

        const count = await createdBlog.countDocuments({});
        const nextPage = perPage + 1 ;
        const hasNextPage = nextPage <= Math.ceil(count / Pages);

       res.render("Published.ejs", {posts: published,
        current: perPage,
        nextPage: hasNextPage ? nextPage : null,
       })
    }
    catch (err) {
        console.error('error getting draft post:', err)
        res.status(500).json({
            message: 'server error'
        })
    }
})


Blog.get('/posts/drafts', checkUser, requireAuth, async(req, res) => {
    try {

        const perPage = parseInt(req.query.page) || 1;

        const skip = (perPage - 1) * Pages;

        const Draft = await createdBlog
        .find({status: 'draft'})
        .skip(skip)
        .limit(Pages);

        const count = await createdBlog.countDocuments({});
        const nextPage = perPage + 1 ;
        const hasNextPage = nextPage <= Math.ceil(count / Pages);

       res.render("Draft.ejs", {posts: Draft,
        current: perPage,
        nextPage: hasNextPage ? nextPage : null,
       })
    }
    catch (err) {
        console.error('error getting draft post:', err)
        res.status(500).json({
            message: 'server error'
        })
    }
})


Blog.get('/posts/publishedblogs', checkUser, requireAuth, async(req, res) => {
    try {

        const perPage = parseInt(req.query.page) || 1;

        const skip = (perPage - 1) * Pages;

        const Draft = await createdBlog
        .find({status: 'published'})
        .skip(skip)
        .limit(Pages);

        const count = await createdBlog.countDocuments({});
        const nextPage = perPage + 1 ;
        const hasNextPage = nextPage <= Math.ceil(count / Pages);

       res.render("publishedBlog.ejs", {posts: Draft,
        current: perPage,
        nextPage: hasNextPage ? nextPage : null,
       })
    }
    catch (err) {
        console.error('error getting draft post:', err)
        res.status(500).json({
            message: 'server error'
        })
    }
})


Blog.get('/post/:id', async(req, res) => {
    try {
        let slug = req.params.id;
        const data = await createdBlog.findById({_id: slug});
        res.render('post.ejs', {data})
    }
    catch (err) {
        console.error('error getting draft post:', err)
        res.status(500).json({
            message: 'server error'
        })
    }
})


Blog.post('/post/search', async(req, res) => {
    try {
        let searchTerm = req.body.searchTerm;
        const searchNoSpecialChar = searchTerm.replace(/[^a-zA-Z0-9 ]/g, "")

        const data = await createdBlog.find({
            $or: [
                
                  {title: {$regex: new RegExp(searchNoSpecialChar, "i")}},
                  {body: {$regex: new RegExp(searchNoSpecialChar, "i")}}
                
            ]
        });
        res.render("search.ejs", {
            data
        })
    }
    catch (err) {
        console.error('error getting draft post:', err)
        res.status(500).json({
            message: 'server error'
        })
    }
})

Blog.get('/edit-post/:id', checkUser, requireAuth,  async (req, res) => {
    try{
        
         const data = await createdBlog.findOne({ _id: req.params.id})
       
        res.render('editBlog.ejs', { data });
    } catch (err) {
        console.error('error gettin post:'. err);
        res.status(500).send('server error')
    }
})


Blog.post('/edit-post/:id', async (req, res) => {
    try {
        const status = req.body.status;

        await createdBlog.findByIdAndUpdate(req.params.id, {
            title: req.body.title,
            content: req.body.content,
            body: req.body.body,
            updatedAt: Date.now(),
            status
        });

        if (status === 'draft') {
            res.status(200).redirect('/posts/drafts');
        } else if (status === 'published') {
            res.status(200).redirect('/posts/published');
        }
    } catch (err) {
        console.error('error getting post:', err);
        res.status(500).send('server error');
    }
});



// Blog.post('/edit-post/:id',  async(req, res) => {
//     try {

//         let id = req.params.id
//          const {title, content, status} = req.body;

//          try{
//             const updatedPost = await createdBlog.findByIdAndUpdate(id, { title, content, status, id }, { new: true });

//             if (!updatedPost) {
//                 return res.status(404).send('Post not found');
//             }
    
//          }
//          catch(error){
//             console.log(error)
//             res.send("an error occured")
//          }
        
        
//         res.send("update successful")

//         // if (status === 'draft') {
//         //     res.status(200).redirect('/posts/drafts');
//         // } else if (status === 'published') {
//         //     res.status(200).redirect(`/posts/published`);
//         // }
//     } catch (error) {
//         console.error('Error editing post:', error);
//         res.status(500).send('Server error');
//     }
// })


Blog.delete('/delete-post/:id', checkUser, requireAuth, async (req, res) => {
    try {
        await createdBlog.deleteOne({_id: req.params.id});
        res.redirect('/dashboard');
        }
         catch (error) {
        console.error('Error deleting post:', error);
        res.status(500).json({ message: 'Server error' });
    }
});







module.exports = Blog;