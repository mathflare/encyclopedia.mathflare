module.exports = {
    ensureAuthenticated: (req, res, next) => {
        if (req.isAuthenticated()) {
            return next();
        }
        req.flash('error_message', 'You must be logged in to view this page');
        res.status(401).redirect('/login');
    }
};