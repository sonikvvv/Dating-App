const express = require("express");
const Rule = require("../utils/models/ruleModel");
const catchAsync = require("../utils/catchAsync");
const router = express.Router();
const { validateRule, isLoggedIn, isAdmin } = require("../utils/middleware");

router.get(
    "/",
    catchAsync(async (req, res) => {
        const rules = await Rule.find({});
        res.render("rules/rules", { rules });
    })
);

router.get("/new", isLoggedIn, isAdmin, (req, res) => {
    res.render("rules/newRules");
});

router.post(
    "/",
    validateRule,
    isLoggedIn,
    isAdmin,
    catchAsync(async (req, res) => {
        const rule = new Rule({ ...req.body.rule });
        await rule.save();
        res.redirect(`/rules/${rule._id}`);
    })
);

router.get(
    "/:id",
    catchAsync(async (req, res) => {
        const rule = await Rule.findById(req.params.id);
        res.render("rules/rule", { rule });
    })
);

router.get(
    "/:id/edit",
    isLoggedIn,
    isAdmin,
    catchAsync(async (req, res) => {
        const rule = await Rule.findById(req.params.id);
        res.render("rules/edit", { rule });
    })
);

router.put(
    "/:id",
    validateRule,
    isLoggedIn,
    isAdmin,
    catchAsync(async (req, res) => {
        const { id } = req.params;
        const rule = await Rule.findByIdAndUpdate(id, { ...req.body.rule });
        res.redirect(`/rules/${rule._id}`);
    })
);

router.delete(
    "/:id",
    isLoggedIn,
    isAdmin,
    catchAsync(async (req, res) => {
        const { id } = req.params;
        const rule = await Rule.findByIdAndDelete(id);
        res.redirect("/rules");
    })
);

module.exports = router;
