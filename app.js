const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const Post = require('./models/post');

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

app.use(express.static('public'));


app.listen(3000, () => {
    console.log("serving on port 3000");
});

app.get('/', async (req, res) => {
    
      res.render('home');
});