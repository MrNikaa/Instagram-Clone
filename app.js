const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const post = require('./models/post');

mongoose.connect('mongodb://localhost:27017/instagram-clone', {

});


const ejsMate = require('ejs-mate');
const app = express();

app.engine('ejs', ejsMate)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))


app.listen(3000, () => {
    console.log("serving on port 3000");
});

app.get('/', async (req, res) => {
    const post = new Post({
        description: 'Look at kanye... hes so ugly',
        image: 'https://th.bing.com/th/id/OIP.BElQbGY91yjENT5HzVmzVgHaHa?pid=ImgDet&rs=1', // Replace with the actual URL or file upload logic
        likes: 15
      });
      await post.save();
      res.render('home');
});