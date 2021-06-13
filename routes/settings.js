const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const passport = require("passport");
const multer = require("multer");
const { storage } = require("../cloudinary");
const upload = multer({ storage });
const { isLoggedIn } = require("../utils/middleware");
const settings = require("../controllers/settings");

router.get("/", isLoggedIn, catchAsync(settings.renderSettings));

router
    .route("/filter")
    .get(isLoggedIn, settings.renderFilter)
    .post(isLoggedIn, catchAsync(settings.createFilter));

router
    .route("/tags")
    .get(isLoggedIn, catchAsync(settings.renderTags))
    .post(isLoggedIn, catchAsync(settings.updateTags));

router
    .route("/images")
    .get(isLoggedIn, settings.renderImages)
    .post(
        upload.array("images"),
        isLoggedIn,
        catchAsync(settings.updateImages)
    );

module.exports = router;
