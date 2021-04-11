const express = require("express");
const Rule = require("../models/ruleModel");
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const { ruleSchema } = require('../utils/validationSchemas');
const router = express.Router();

const validateRule = (req, res, next) => {
    const { error } = ruleSchema.validate(req.body);
    if (error) {
        const msg = error.details.map((el) => el.message).join(', ');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
};

router.get("/", catchAsync( async (req, res) => {
    const rules = await Rule.find({});
    res.render("rules/rules", { rules });
}));

router.get("/new", (req, res) => {
    res.render("rules/newRules");
});

router.post("/", validateRule, catchAsync( async (req, res) => {
    const rule = new Rule({ ...req.body.rule });
    await rule.save();
    res.redirect(`/rules/${rule._id}`);
}));

router.get("/:id", catchAsync( async (req, res) => {
    const rule = await Rule.findById(req.params.id);
    res.render("rules/rule", { rule });
}));

router.get("/:id/edit", catchAsync( async (req, res) => {
    const rule = await Rule.findById(req.params.id);
    res.render("rules/edit", { rule });
}));

router.put("/:id", validateRule, catchAsync( async (req, res) => {
    const { id } = req.params;
    const rule = await Rule.findByIdAndUpdate(id, { ...req.body.rule });
    res.redirect(`/rules/${rule._id}`);
}));

router.delete("/:id", catchAsync( async (req, res) => {
    const { id } = req.params;
    const rule = await Rule.findByIdAndDelete(id);
    res.redirect("/rules");
}));

module.exports = router;
