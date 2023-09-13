const express = require('express');
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError')
const {postSchema} = require('../schemas.js');
const Post = require('../models/post');
const router = express.Router();

const validatePost = (req, res, next) => {
    const result = postSchema.validate(req.body)
    if(result.error){
      const msg = error.details.map(el => el.message).join(',');
      throw new ExpressError(msg, 400);
    }else
    {
      next();
    }
  }

router.get('/', async (req, res) => {
    const posts = await Post.find({});
    res.render('home', { posts });
});

router.get('/post/:id', catchAsync(async (req, res) => {
    const post = await Post.findById(req.params.id);
    if(!post){
        req.flash('error', 'Can not find the campground!');
        return res.redirect('/');
    }
    res.render('show', { post });
}));

router.put('/post/:id', validatePost, catchAsync(async (req, res) => {
    const { id } = req.params;
    const post = await Post.findByIdAndUpdate(id, { ...req.body.post });
    await post.save();
    req.flash('success', 'Sucessfully edited the post!');
    res.redirect(`/post/${post._id}`)
}));

router.get('/createPost', (req, res) => {
    res.render('create');
});

router.post('/', validatePost, catchAsync(async (req, res) => {
    const post = new Post(req.body.post);
    await post.save();
    req.flash('success', 'Sucessfully made a new post!');
    res.redirect(`/post/${post._id}`);
}));

router.delete('/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    await Post.findByIdAndDelete(id);
    req.flash('success', 'Sucessfully deleted the post!');
    res.redirect('/');
}));

router.get('/:id/edit', catchAsync(async (req, res) => {
    const { id } = req.params;
    const post = await Post.findById(id);
    res.render('edit', { post });
}));

module.exports = router;