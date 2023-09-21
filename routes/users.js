const express = require('express');
const User = require('../models/user');
const Post = require('../models/post');
const passport = require('passport');
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn } = require('../middleware');
const router = express.Router();

router.get('/:id/profile', catchAsync(async (req, res) => {
    const { id } = req.params;
    const postCount = await Post.countDocuments({ author: id });
    const user = await User.findById(id);
    if (req.user) {
        const alreadyFollowing = user.followers.some(userId => userId.equals(req.user._id));
    }
    res.render('user/profile', { user, postCount });
}));

router.post('/:id/profile/follow', isLoggedIn, catchAsync(async (req, res) => {
    const { id } = req.params;
    const user = await User.findById(id);
    const alreadyFollowing = user.followers.some(userId => userId.equals(req.user._id));

    if (alreadyFollowing) {
        user.followers.pull(req.user._id);
    } else {
        user.followers.push(req.user._id);
    }

    await user.save();
    res.status(204).send();
}));

router.get('/register', (req, res) => {
    res.render('authentication/register');
});
router.post('/register', catchAsync(async (req, res, next) => {
    try {
        const { email, username, password } = req.body;
        const user = new User({ email, username });
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, err => {
            if (err) return next(err);
            req.flash('success', 'Sucesfully registered!');
            res.redirect('/');
        });
    }
    catch (e) {
        req.flash('error', e.message);
        res.redirect('/register');
    }
}));

router.get('/login', (req, res) => {
    res.render('authentication/login');
});

router.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), (req, res) => {
    req.flash('success', 'Sucesfully signed in');
    res.redirect('/');
});

router.get('/logout', (req, res, next) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        req.flash('success', 'Goodbye!');
        res.redirect('/');
    });
});

module.exports = router;