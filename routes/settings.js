const express = require("express");
const router = express.Router();
const User = require("../utils/models/userModel");
const catchAsync = require("../utils/catchAsync");
const passport = require("passport");
const multer = require("multer");
const { storage, cloudinary } = require("../cloudinary");
const upload = multer({ storage });
const { isLoggedIn } = require("../utils/middleware");
const Tag = require("../utils/models/tagModel");

router.get(
    "/",
    isLoggedIn,
    catchAsync(async (req, res) => {
        const user = await User.findById(req.user._id).populate("images").populate("tags");
        res.render("users/settings/settings", { user });
    })
);

router.get("/filter", isLoggedIn, (req, res) => {
    res.render("users/settings/filter");
});

router.post(
    "/filter",
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
        res.redirect(`/settings`);
    })
);

router.get("/images", isLoggedIn, (req, res) => {
    const user = req.user;
    res.render("users/settings/images", { user });
});

router.post(
    "/images",
    upload.array("images"),
    isLoggedIn,
    catchAsync(async (req, res) => {
        const images = req.files.map((f) => ({
            url: f.path,
            filename: f.filename,
        }));
        const deleteImages = req.body.deleteImages
            ? [...req.body.deleteImages]
            : [];

        const user = req.user;

        if (images.length !== 0) {
            images.forEach((element, i) => {
                if (user.images.length !== 5) {
                    user.images.push(element);
                } else {
                    deleteImages.push(element.filename);
                }
            });
        }

        await user.save();

        if (deleteImages.length !== 0) {
            for(let filename of deleteImages) {
                await cloudinary.uploader.destroy(filename);
            };
            await user.updateOne({
                $pull: { images: { filename: { $in: deleteImages } } },
            });
        }

        res.redirect("images");
    })
);

module.exports = router;
