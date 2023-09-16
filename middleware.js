module.exports.isLoggedIn = (req, res, next) => {
    if(!req.isAuthenticated()){
        req.flash('error', 'You must sign in to do this.');
        return res.redirect('/login');
    }
    next();
}