const express = require("express");
const Badge = require("../utils/models/badgeModel");
const catchAsync = require("../utils/catchAsync");
const router = express.Router();
const { validateBadge, isLoggedIn, isAdmin } = require("../utils/middleware");
const multer = require("multer");
const { storage } = require("../cloudinary");
const upload = multer({ storage });

router.get(
    "/",
    catchAsync(async (req, res) => {
        const badges = await Badge.find({});
        res.render("badges/badges", { badges });
    })
);

router.get("/new", isLoggedIn, isAdmin, (req, res) => {
    res.render("badges/new");
});

router.get(
    "/:id",
    catchAsync(async (req, res) => {
        const badge = await Badge.findById(req.params.id);
        res.render("badges/singleBadge", { badge });
    })
);

router.get(
    "/:id/edit",
    isLoggedIn,
    isAdmin,
    catchAsync(async (req, res) => {
        const badge = await Badge.findById(req.params.id);
        res.render("badges/edit", { badge });
    })
);

router.post(
    "/",
    upload.single("image"),
    validateBadge,
    isLoggedIn,
    isAdmin,
    catchAsync(async (req, res) => {
        const image = req.file;
        const badge = new Badge(req.body.badge);
        badge.image = { url: image.path, filename: image.filename };
        await badge.save();
        console.log(badge);
        res.redirect(`/badges/${badge._id}`);
    })
);

router.put(
    "/:id",
    upload.single("image"),
    validateBadge,
    isLoggedIn,
    isAdmin,
    catchAsync(async (req, res) => {
        const { id } = req.params;
        const image = req.file;
        const badge = await Badge.findById(id);
        badge.image = { url: image.path, filename: image.filename };
        await Badge.findByIdAndUpdate(id, { ...badge });
        res.redirect(`/badges/${badge._id}`);
    })
);

router.delete(
    "/:id",
    isLoggedIn,
    isAdmin,
    catchAsync(async (req, res) => {
        const { id } = req.params;
        const badge = await Badge.findByIdAndDelete(id);
        res.redirect("/badges");
    })
);

module.exports = router;
