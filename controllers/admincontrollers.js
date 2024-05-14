const express = require('express');
const createdBlog = require("../Models/BlogPost");
const BlogUser = require("../Models/Users");
const Pages = 10;

module.exports.Blog_get = (req, res) => {
    res.render("createBlog.ejs")
    res.status(200)
}


module.exports.Blog_post = async(req, res) => {
    try {
        const { title, content, status, body} = req.body;
         
        const author = await BlogUser.findById(req.user.id);

        const newBlog = new createdBlog({
            title,
            content,
            body,
            // createdAt,
            // updatedAt,
            userId: req.user.id,
            author: {FirstName: author.FirstName, LastName: author.LastName},
            status
        });
        await newBlog.save();
        console.log(newBlog);
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
}


module.exports.published = async(req, res) => {
    try {

        const perPage = parseInt(req.query.page) || 1;

        const skip = (perPage - 1) * Pages;

        const published = await createdBlog
        .find({status: 'published'})
        .skip(skip)
        .limit(Pages);

        // //get authors for each post
        // const publishedWithAuthors = await Promise.all(published.map(async (post) => {
        //     const author = await BlogUser.findById(post.userId);
        //     return { post, author };
        // }));

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
}


module.exports.draft = async(req, res) => {
    try {

        const perPage = parseInt(req.query.page) || 1;

        const skip = (perPage - 1) * Pages;


        const Draft = await createdBlog
        .find({ userId: req.user.id, status: 'draft' })
        .populate('userId', ['title', 'content', 'body'])
        .skip(skip)
        .limit(Pages);

        const count = await createdBlog.countDocuments({ userId: req.user.id, status: 'draft'});
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
}


module.exports.get_UserPublished_Blog = async(req, res) => {
    try {
 
        const perPage = parseInt(req.query.page) || 1;
        const skip = (perPage - 1) * Pages;
        const Draft = await createdBlog
        .find({ userId: req.user.id,  status: 'published'})
        .populate('userId',['title', 'content', 'body'])
        .skip(skip)
        .limit(Pages);

        const count = await createdBlog.countDocuments({ userId: req.user.id, status: 'published' });
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
}


module.exports.get_post_id = async(req, res) => {
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
}


module.exports.SearchPost = async(req, res) => {
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
}


module.exports.edit_blog_get = async(req, res) => {
    try{
        
        const data = await createdBlog.findOne({ _id: req.params.id})
      
       res.render('editBlog.ejs', { data });
   } catch (err) {
       console.error('error gettin post:'. err);
       res.status(500).send('server error')
   }
}

module.exports.edit_blog_post = async(req, res) => {
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
}


module.exports.delete_post = async(req, res) => {
    try {
        await createdBlog.deleteOne({_id: req.params.id});
        res.redirect('/dashboard');
        }
         catch (error) {
        console.error('Error deleting post:', error);
        res.status(500).json({ message: 'Server error' });
    }
}