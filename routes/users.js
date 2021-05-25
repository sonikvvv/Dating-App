const express = require("express");
const { isError } = require("joi"); //? do we use it
const User = require("../utils/models/userModel");
const catchAsync = require("../utils/catchAsync");
const router = express.Router();
const passport = require("passport");
const {
    validateUser,
    validateRegister,
    isLoggedIn,
} = require("../utils/middleware");
const { ObjectId } = require("mongodb");
const Chat = require('../utils/models/chatModel');
const Tag = require("../utils/models/tagModel");

router.get(
    "/",
    catchAsync(async (req, res) => {
        const users = await User.find({});
        res.render("users/users", { users });
    })
);

router.get("/login", (req, res) => {
    res.render("users/log-reg/login");
});

router.post(
    "/login",
    passport.authenticate("local", {
        failureFlash: true,
        failureRedirect: "/login",
    }),
    (req, res) => {
        const user = req.user;
        req.flash("success", `Welcome back ${user.username}!`);
        const redirect = req.session.returnTo || "/users/discover";
        res.redirect(redirect);
    }
);

router.get("/logout", (req, res) => {
    req.logout();
    req.flash("success", "Goodbye!");
    res.redirect("/");
});

router.get("/register", (req, res) => {
    res.render("users/log-reg/register");
});

router.post(
    "/register",
    validateRegister,
    catchAsync(async (req, res) => {
        try {
            const { email, username, password, years } = req.body.user;
            const user = new User({ email, username, years });
            const registeredUser = await User.register(user, password);
            req.login(registeredUser, (err) => {
                if (err) return next(err);
                req.flash("success", "Welcome to BlindDatee!");
                res.redirect(`/users/${user._id}`);
            });
        } catch (e) {
            req.flash("error", e.message);
            res.redirect("/users/register");
        }
    })
);

router.get(
    "/chats",
    isLoggedIn,
    catchAsync(async (req, res) => {
        let chatUserIds = [];
        req.user.liked.forEach((el) => {
            if (el.chatId) {
                chatUserIds.push(el.userId);
            }
        });
        let users = await User.find({_id: {$in: chatUserIds}});
        res.render("users/chats/chatsPage", { users });
    })
);

router.get(
    "/discover",
    isLoggedIn,
    catchAsync(async (req, res) => {
        const filter = req.user.filter;
        let exclude = [];
        exclude.push(ObjectId(req.user._id));

        req.user.liked.forEach((el) => {
            exclude.push(ObjectId(el.userId));
        });

        req.user.disliked.forEach((el) => {
            exclude.push(ObjectId(el));
        });

        let excludeFilter = {};
        excludeFilter._id = { $nin: exclude };
        if (filter.years.years_from && filter.years.years_to) {
            excludeFilter.years = {
                $gte: filter.years.years_from,
                $lte: filter.years.years_to,
            };
        }
        if (filter.sex || filter.sex != "") excludeFilter.sex = filter.sex;
        if (filter.user_orientation || filter.user_orientation != "")
            excludeFilter.orientation = filter.user_orientation;
        if (filter.relationshipStatus || filter.relationshipStatus != "")
            excludeFilter.relationshipStatus = filter.relationshipStatus;
        if (filter.bodyType || filter.bodyType != "")
            excludeFilter.bodyType = filter.bodyType;

        const user = await User.findOne(excludeFilter);
        res.render("users/discover/discoverPage", { user });
    })
);

router.get(
    "/discover/:id/:liked",
    isLoggedIn,
    catchAsync(async (req, res) => {
        const { id, liked } = req.params;
        const user = req.user;
        
        if (liked == "true") {
            const likedUser = await User.findById(id);
            if (likedUser.liked.length != 0) {
                for (let index = 0; index < likedUser.liked.length; index++) {
                    const element = likedUser.liked[index];
                    if (element.userId.equals(user._id)) {
                        const chat = new Chat();
                        chat.participants.push(user._id, id);
                        chat.save();
                        user.liked.push({ userId: id, chatId: chat._id });
                        likedUser.liked[index].chatId = chat._id;
                        await User.findByIdAndUpdate(id, { ...likedUser });
                        req.flash("success", "You have a match!");
                        break;
                    }
                }
            } else  {
                user.liked.push({ userId: id });
                await User.findByIdAndUpdate(user._id, { ...user });
            }
        } else user.disliked.push(id);

        await User.findByIdAndUpdate(user._id, { ...user });
        res.redirect("/users/discover");
    })
);
    
router.get("/settings", isLoggedIn, (req, res) => {
    const filter = req.user.filter;
    res.render("users/settings/settings", { filter });
});

router.get("/settings/edit", isLoggedIn, (req, res) => {
    res.render("users/settings/edit");
});

router.post(
    "/settings",
    isLoggedIn,
    catchAsync(async (req, res) => {
        const user = req.user;
        user.filter = req.body.filter;

        await User.findByIdAndUpdate(user._id, { ...user });
        res.redirect("/users/discover");
    })
);

router.get(
    "/tags",
    isLoggedIn,
    catchAsync(async (req, res) => {
        const userTags = req.user.tags;
        const allTags = await Tag.find({});
        let tags = [];
        allTags.forEach((tag) => {
            if (userTags.indexOf(tag._id) > -1) {
                tag.selected = 1;
            }
            tags.push(tag);
        });
        res.render("users/tags/select", { tags });
    })
);

router.post(
    "/tags",
    isLoggedIn,
    catchAsync(async (req, res) => {
        const user = req.user;
        if (req.body.tags) {
            user.tags = [];
            req.body.tags.forEach((tagId) => {
                user.tags.push(tagId);
            });
            await User.findByIdAndUpdate(user._id, { ...user });
        }
        res.redirect(`/users/${user._id}`);
    })
);

router.get(
    "/:id",
    catchAsync(async (req, res) => {
        const { id } = req.params;
        const user = await User.findById(id);
        res.render("users/userPage", { user });
    })
);

router.get(
    "/:id/edit",
    catchAsync(async (req, res) => {
        const user = await User.findById(req.params.id);
        res.render("users/edit", { user });
    })
);

router.put(
    "/:id",
    validateUser,
    catchAsync(async (req, res) => {
        const { id } = req.params;
        const user = await User.findByIdAndUpdate(id, { ...req.body.user });
        res.render("users/userPage", { user });
    })
);

router.delete(
    "/:id",
    catchAsync(async (req, res) => {
        const { id } = req.params;
        const user = await User.findByIdAndDelete(id);
        res.redirect("/users");
    })
);

module.exports = router;
