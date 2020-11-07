module.exports = {
    ensureAuthenticated: function(req, res, next) {
        if(req.isAuthenticated()) {
            console.log(req.connection.remoteAddress.replace('::ffff:', '') + ' - Access to /dashboard granted to authorized user');
            return next();
        }
        req.flash('error_msg', "Please login to view this resource");
        res.redirect('/');
    }
}