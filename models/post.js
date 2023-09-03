const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postSchema = new Schema({
    description: String,
    image: String,
    likes: {
        type: Number,
        default: 0, // Set the default number of likes to 0
      }
});

const Post = mongoose.model('Post', postSchema);

module.exports = Post;