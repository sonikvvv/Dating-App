const Tag = require("../utils/models/tagModel");

module.exports.renderTags = async (req, res) => {
    const tags = await Tag.find({});
    res.render("tags/tags", { tags });
};

module.exports.renderNewTags = (req, res) => {
    res.render("tags/new");
};

module.exports.createTag = async (req, res) => {
    const tag = new Tag({ ...req.body.tag });
    await tag.save();
    res.redirect(`/tags/${tag._id}`);
};

module.exports.renderTag = async (req, res) => {
    const tag = await Tag.findById(req.params.id);
    res.render("tags/tag", { tag });
};

module.exports.renderEditTag = async (req, res) => {
    const tag = await Tag.findById(req.params.id);
    res.render("tags/edit", { tag });
};

module.exports.updateTag = async (req, res) => {
    const { id } = req.params;
    const tag = await Tag.findByIdAndUpdate(id, { ...req.body.tag });
    res.redirect(`/tags/${tag._id}`);
};

module.exports.deleteTag = async (req, res) => {
    const { id } = req.params;
    const tag = await Tag.findByIdAndDelete(id);
    res.redirect("/tags");
};