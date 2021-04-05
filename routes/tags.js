const express = require("express");
const router = express.Router();
const Tag = require("../models/tagModel");

router.get("/", async (req, res) => {
    const tags = await Tag.find({});
    res.render("tags/tags", { tags });
});

router.get("/new", (req, res) => {
    res.render("tags/new");
});

router.post("/", async (req, res) => {
    const tag = new Tag({ ...req.body.tag });
    await tag.save();
    res.redirect(`/tags/${tag._id}`);
});

router.get("/:id", async (req, res) => {
    const tag = await Tag.findById(req.params.id);
    res.render("tags/tag", { tag });
});

router.get("/:id/edit", async (req, res) => {
    const tag = await Tag.findById(req.params.id);
    res.render("tags/edit", { tag });
});

router.put("/:id", async (req, res) => {
    const { id } = req.params;
    const tag = await Tag.findByIdAndUpdate(id, { ...req.body.tag });
    res.redirect(`/tags/${tag._id}`);
});

router.delete("/:id", async (req, res) => {
    const { id } = req.params;
    const tag = await Tag.findByIdAndDelete(id);
    res.redirect("/tags");
});

module.exports = router;