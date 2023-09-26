const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postSchema = new Schema({
  description: String,
  image: {
      url: String
    },
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  likes: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  comments: [{
    author: { type: Schema.Types.ObjectId, ref: 'User' },
    text: { type: String }
  }]
});

const Post = mongoose.model('Post', postSchema);

module.exports = Post;