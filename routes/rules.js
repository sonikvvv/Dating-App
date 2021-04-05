const express = require("express");
const router = express.Router();
const Rule = require("../models/ruleModel");

router.get("/", async (req, res) => {
    const rules = await Rule.find({});
    res.render("rules/rules", { rules });
});

router.get("/new", (req, res) => {
    res.render("rules/newRules");
});

router.post("/", async (req, res) => {
    const rule = new Rule({ ...req.body.rule });
    await rule.save();
    res.redirect(`/rules/${rule._id}`);
});

router.get("/:id", async (req, res) => {
    const rule = await Rule.findById(req.params.id);
    res.render("rules/rule", { rule });
});

router.get("/:id/edit", async (req, res) => {
    const rule = await Rule.findById(req.params.id);
    res.render("rules/edit", { rule });
});

router.put("/:id", async (req, res) => {
    const { id } = req.params;
    const rule = await Rule.findByIdAndUpdate(id, { ...req.body.rule });
    res.redirect(`/rules/${rule._id}`);
});

router.delete("/:id", async (req, res) => {
    const { id } = req.params;
    const rule = await Rule.findByIdAndDelete(id);
    res.redirect("/rules");
});

module.exports = router;
