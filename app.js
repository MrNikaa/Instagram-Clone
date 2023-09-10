const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const catchAsync = require('./utils/catchAsync');
const ExpressError = require('./utils/ExpressError')
const Post = require('./models/post');
const methodOverride = require("method-override");

mongoose.connect('mongodb://0.0.0.0:27017/instagram-clone', {

});

mongoose.connection.on('connected', () => {
    console.log('Connected to MongoDB');
  });
  
  mongoose.connection.on('error', (err) => {
    console.error('MongoDB connection error:', err);
  });


const ejsMate = require('ejs-mate');
const app = express();

app.engine('ejs', ejsMate)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));


app.get('/', async (req, res) => {
  const posts = await Post.find({});
    res.render('home', { posts });
});

app.get('/post/:id', catchAsync(async (req,res) => {
  const post = await Post.findById(req.params.id);
  res.render('show', { post });
}));

app.put('/post/:id',  catchAsync(async (req, res) =>{
  const {id} = req.params;
    const post = await Post.findByIdAndUpdate(id, { ...req.body.post });
    await post.save();
    res.redirect(`/post/${post._id}`)
}));

app.get('/createPost', (req, res) => {
     res.render('create');
});

app.post('/', catchAsync(async (req, res) => {
  const post = new Post(req.body.post);
  await post.save();
  res.redirect(`/post/${post._id}`);
}));

app.delete('/:id',  catchAsync(async (req, res) => {
  const { id } = req.params;
  await Post.findByIdAndDelete(id);
  res.redirect('/');
}));

app.get('/:id/edit', catchAsync( async (req, res) =>{
  const { id } = req.params;
  const post = await Post.findById(id);
  res.render('edit', {post});
}));

app.all('*', (req,res,next) =>{
  next(new ExpressError('Page not found!', 404));
});

app.use((err, req, res, next) =>{
  const {statusCode = 500, message = "Something went wrong"} = err;
  res.status(statusCode).send(message);
});

app.listen(3000, () => {
  console.log("serving on port 3000");
});
