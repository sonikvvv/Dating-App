const express = require("express");
const catchAsync = require("../utils/catchAsync");
const router = express.Router();
const passport = require("passport");
const {
    validateUser,
    validateRegister,
    isLoggedIn,
    isAdmin,
} = require("../utils/middleware");
const users = require("../controllers/users");

router.get("/", isAdmin, catchAsync(users.renderAllUsers));

router
    .route("/login")
    .get(users.renderLogin)
    .post(
        passport.authenticate("local", {
            failureFlash: true,
            failureRedirect: "/login",
        }),
        users.login
    );

router.get("/logout", users.logout);

router
    .route("/register")
    .get(users.renderRegister)
    .post(validateRegister, catchAsync(users.register));

router.get("/chats", isLoggedIn, catchAsync(users.renderChats));

router.get("/discover", isLoggedIn, catchAsync(users.renderDiscover));

router.get("/discover/:id/:liked", isLoggedIn, catchAsync(users.discover));

router
    .route("/:id")
    .get(isLoggedIn, catchAsync(users.renderUser))
    .put(isLoggedIn, validateUser, catchAsync(users.updateUser))
    .delete(isLoggedIn, catchAsync(users.deleteUser));

router.get("/:id/edit", catchAsync(users.renderEditUser));

module.exports = router;
