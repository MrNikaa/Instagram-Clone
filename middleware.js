const { postSchema } = require('./schemas.js');
const ExpressError = require('./utils/ExpressError');
const Post = require('./models/post');

module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.flash('error', 'You must sign in to do this.');
    return res.redirect('/login');
  }
  next();
}

module.exports.isAuthor = async (req, res, next) => {
  const { id } = req.params;
  const post = await Post.findById(id);
  if (!post.author.equals(req.user._id)) {
    req.flash('error', 'You do not have permission to do that');
    return res.redirect(`/post/${post._id}`);
  }
  next();
}

module.exports.validatePost = (req, res, next) => {
  const result = postSchema.validate(req.body)
  if (result.error) {
    const msg = result.error.details.map(el => el.message).join(',');
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
}
