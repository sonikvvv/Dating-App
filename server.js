const express = require('express');
const ejsMate = require('ejs-mate');
const path = require('path');
const mongoose = require('mongoose');
const Badge = require('./models/badgeModel');
const methodOverride = require('method-override');
const Rule = require('./models/ruleModel');
const Tag = require('./models/tagModel');

mongoose.connect('mongodb://localhost:27017/dating-app', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error: "));
db.once("open", () => {
    console.log('Database connected.');
});

const app = express();

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride('_method'));


app.get('/', (req, res) => {
    res.render('home');
});

////

app.get('/badges', async (req, res) => {
    const badges = await Badge.find({});
    res.render('badges/badges', { badges });
});

app.get('/badges/new', (req, res) => {
    res.render('badges/new');
});

app.get('/badges/:id', async (req, res) => {
    const badge = await Badge.findById(req.params.id);
    res.render('badges/singleBadge', { badge });
});

app.get('/badges/:id/edit', async (req, res) => {
    const badge = await Badge.findById(req.params.id);
    res.render('badges/edit', { badge });
});

app.post("/badges", async (req, res) => {
    const badge = new Badge(req.body.badge);
    await badge.save();
    res.redirect(`/badges/${badge._id}`);
});

app.put("/badges/:id", async (req, res) => {
    const { id } = req.params;
    const badge = await Badge.findByIdAndUpdate(id, {...req.body.badge});
    res.redirect(`/badges/${badge._id}`);
});

app.delete("/badges/:id", async (req, res) => {
    const { id } = req.params;
    const badge = await Badge.findByIdAndDelete(id);
    res.redirect('/badges');
});

////

app.get('/rules', async (req, res) => {
    const rules = await Rule.find({});
    res.render("rules/rules", { rules });
});

app.get('/rules/new', (req, res) => {
    res.render('rules/newRules');
});

app.post("/rules", async (req, res) => {
    const rule = new Rule({ ...req.body.rule });
    await rule.save();
    res.redirect(`/rules/${rule._id}`);
});

app.get('/rules/:id', async (req, res) => {
    const rule = await Rule.findById(req.params.id);
    res.render('rules/rule', { rule });
});

app.get('/rules/:id/edit', async (req, res) => {
    const rule = await Rule.findById(req.params.id);
    res.render('rules/edit', { rule });
});

app.put("/rules/:id", async (req, res) => {
    const { id } = req.params;
    const rule = await Rule.findByIdAndUpdate(id, { ...req.body.rule });
    res.redirect(`/rules/${rule._id}`);
});

app.delete("/rules/:id", async (req, res) => {
    const { id } = req.params;
    const rule = await Rule.findByIdAndDelete(id);
    res.redirect("/rules");
});

////

app.get('/tags', async (req, res) => {
    const tags = await Tag.find({});
    res.render("tags/tags", { tags });
})

app.get("/tags/new", (req, res) => {
    res.render("tags/new");
});

app.post("/tags", async (req, res) => {
    const tag = new Tag({ ...req.body.tag });
    await tag.save();
    res.redirect(`/tags/${tag._id}`);
});

app.get("/tags/:id", async (req, res) => {
    const tag = await Tag.findById(req.params.id);
    res.render("tags/tag", { tag });
});

app.get("/tags/:id/edit", async (req, res) => {
    const tag = await Tag.findById(req.params.id);
    res.render("tags/edit", { tag });
});

app.put("/tags/:id", async (req, res) => {
    const { id } = req.params;
    const tag = await Tag.findByIdAndUpdate(id, { ...req.body.tag });
    res.redirect(`/tags/${tag._id}`);
});

app.delete("/tags/:id", async (req, res) => {
    const { id } = req.params;
    const tag = await Tag.findByIdAndDelete(id);
    res.redirect("/tags");
});

////

app.get('/login', (req, res) => {
    res.render('log-reg/login');
});

app.get('/register', (req, res) => {
    res.render('log-reg/register');
});

app.listen(3000, () => {
    console.log('Server started on port 3000.');
});