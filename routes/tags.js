const express = require("express");
const catchAsync = require("../utils/catchAsync");
const router = express.Router();
const { validateTag, isLoggedIn, isAdmin } = require("../utils/middleware");
const tags = require("../controllers/tags");

router
    .route("/")
    .get(isAdmin, catchAsync(tags.renderTags))
    .post(validateTag, isLoggedIn, isAdmin, catchAsync(tags.createTag));

router.get("/new", isLoggedIn, isAdmin, tags.renderNewTags);

router
    .route("/:id")
    .get(isAdmin, catchAsync(tags.renderTag))
    .put(validateTag, isLoggedIn, isAdmin, catchAsync(tags.updateTag))
    .delete(isLoggedIn, isAdmin, catchAsync(tags.deleteTag));

router.get("/:id/edit", isLoggedIn, isAdmin, catchAsync(tags.renderEditTag));

module.exports = router;
