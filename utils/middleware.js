module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl;
        req.flash("error", "You must be signed in!");
        return res.redirect("/users/login");
    }
    next();
};

module.exports.isAdmin = (req, res, next) => {
    if (currentUser && currentUser.access == "admin") {
        return next();
    }
    req.flash("error", "You must be admin!");
    res.redirect("/");
};

 