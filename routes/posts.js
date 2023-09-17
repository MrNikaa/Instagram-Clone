const express = require('express');
const catchAsync = require('../utils/catchAsync');
const Post = require('../models/post');
const router = express.Router();
const {isLoggedIn, isAuthor, validatePost} = require('../middleware');


router.get('/', async (req, res) => {
    const posts = await Post.find({}).populate('author');
    res.render('home', { posts });
});

router.get('/post/:id', catchAsync(async (req, res) => {
    const post = await Post.findById(req.params.id).populate('author');
    if(!post){
        req.flash('error', 'Can not find the campground!');
        return res.redirect('/');
    }
    res.render('show', { post });
}));

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(async (req, res) => {
    const { id } = req.params;
    const post = await Post.findById(id);
    res.render('edit', { post });
}));

router.put('/post/:id', validatePost, isLoggedIn, isAuthor, catchAsync(async (req, res) => {
    const { id } = req.params;
    const currentPost = await Post.findById(id);
    const post = await Post.findByIdAndUpdate(id, { ...req.body.post });
    await post.save();
    req.flash('success', 'Sucessfully edited the post!');
    res.redirect(`/post/${post._id}`)
}));

router.get('/createPost', isLoggedIn, (req, res) => {
    res.render('create');
});

router.post('/', validatePost, isLoggedIn, catchAsync(async (req, res) => {
    const post = new Post(req.body.post);
    post.author = req.user._id;
    await post.save();
    req.flash('success', 'Sucessfully made a new post!');
    res.redirect(`/post/${post._id}`);
}));

router.delete('/:id', isLoggedIn, isAuthor, catchAsync(async (req, res) => {
    const { id } = req.params;
    await Post.findByIdAndDelete(id);
    req.flash('success', 'Sucessfully deleted the post!');
    res.redirect('/');
}));


module.exports = router;