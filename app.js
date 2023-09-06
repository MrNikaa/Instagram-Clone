const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
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



app.listen(3000, () => {
    console.log("serving on port 3000");
});

app.get('/', async (req, res) => {
  const posts = await Post.find({});
    res.render('home', { posts });
});

app.get('/createPost', (req, res) => {
     res.render('create');
});

app.post('/', async (req, res) => {
  const post = new Post(req.body.post);
  await post.save();
  res.redirect('/');
});

app.delete('/:id'), async (req, res) => {
  const { id } = req.params;
  console.log(id);
  await Post.findByIdAndDelete(id);
  res.redirect('/');
}