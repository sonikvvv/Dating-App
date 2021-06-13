const User = require("../utils/models/userModel");
const { cloudinary } = require("../cloudinary");
const Tag = require("../utils/models/tagModel");

module.exports.renderSettings = async (req, res) => {
    const user = await User.findById(req.user._id)
        .populate("images")
        .populate("tags");
    res.render("users/settings/settings", { user });
};

module.exports.renderFilter = (req, res) => {
    res.render("users/settings/filter");
};

module.exports.createFilter = async (req, res) => {
    const user = req.user;
    user.filter = req.body.filter;

    await User.findByIdAndUpdate(user._id, { ...user });
    res.redirect("/users/discover");
};

module.exports.renderTags = async (req, res) => {
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
};

module.exports.updateTags = async (req, res) => {
    const user = req.user;
    if (req.body.tags) {
        user.tags = [];
        req.body.tags.forEach((tagId) => {
            user.tags.push(tagId);
        });
        await User.findByIdAndUpdate(user._id, { ...user });
    }
    res.redirect(`/settings`);
};

module.exports.renderImages = (req, res) => {
    const user = req.user;
    res.render("users/settings/images", { user });
};

module.exports.updateImages = async (req, res) => {
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
        for (let filename of deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        await user.updateOne({
            $pull: { images: { filename: { $in: deleteImages } } },
        });
    }

    res.redirect("images");
};
