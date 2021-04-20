const ExpressError = require("../utils/ExpressError");
const {
    badgeSchema,
    registerSchema,
    ruleSchema,
    tagSchema,
    userSchema,
} = require("../utils/validationSchemas");

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl;
        req.flash("error", "You must be signed in!");
        return res.redirect("/users/login");
    }
    next();
};

module.exports.isAdmin = (req, res, next) => {
    const user = req.user;
    if (user && user.access == "admin") {
        return next();
    }
    req.flash("error", "You must be admin!");
    res.redirect("/");
};

module.exports.validateUser = (req, res, next) => {
    const { error } = userSchema.validate(req.body);
    if (error) {
        const msg = error.details.map((el) => el.message).join(", ");
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
};

module.exports.validateRegister = (req, res, next) => {
    const { error } = registerSchema.validate(req.body);
    if (error) {
        const msg = error.details.map((el) => el.message).join(", ");
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
};

module.exports.validateTag = (req, res, next) => {
    const { error } = tagSchema.validate(req.body);
    if (error) {
        const msg = error.details.map((el) => el.message).join(", ");
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
};

module.exports.validateRule = (req, res, next) => {
    const { error } = ruleSchema.validate(req.body);
    if (error) {
        const msg = error.details.map((el) => el.message).join(", ");
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
};

module.exports.validateBadge = (req, res, next) => {
    const { error } = badgeSchema.validate(req.body);
    if (error) {
        const msg = error.details.map((el) => el.message).join(", ");
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
};
