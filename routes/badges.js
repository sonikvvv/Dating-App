const express = require("express");
const Badge = require("../models/badgeModel");
const catchAsync = require('../utils/catchAsync');
const router = express.Router();

router.get("/", catchAsync( async (req, res) => {
    const badges = await Badge.find({});
    res.render("badges/badges", { badges });
}));

router.get("/new", (req, res) => {
    res.render("badges/new");
});

router.get("/:id", catchAsync( async (req, res) => {
    const badge = await Badge.findById(req.params.id);
    res.render("badges/singleBadge", { badge });
}));

router.get("/:id/edit", catchAsync( async (req, res) => {
    const badge = await Badge.findById(req.params.id);
    res.render("badges/edit", { badge });
}));

router.post("/", catchAsync( async (req, res) => {
    const badge = new Badge(req.body.badge);
    await badge.save();
    res.redirect(`/badges/${badge._id}`);
}));

router.put("/:id", catchAsync( async (req, res) => {
    const { id } = req.params;
    const badge = await Badge.findByIdAndUpdate(id, { ...req.body.badge });
    res.redirect(`/badges/${badge._id}`);
}));

router.delete("/:id", catchAsync( async (req, res) => {
    const { id } = req.params;
    const badge = await Badge.findByIdAndDelete(id);
    res.redirect("/badges");
}));

module.exports = router;
