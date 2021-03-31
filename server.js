const express = require('express');
const ejsMate = require('ejs-mate');
const path = require('path');
const mongoose = require('mongoose');
const Badge = require('./models/badgeModel');
const methodOverride = require('method-override');

mongoose.connect('mongodb://localhost:27017/dating-app', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
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

app.get('/badges/new', async (req, res) => {
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

app.get('/rules', (req, res) => {
    res.render('rules/rules');
});

app.get('/login', (req, res) => {
    res.render('log-reg/login');
});

app.get('/register', (req, res) => {
    res.render('log-reg/register');
});

app.listen(3000, () => {
    console.log('Server started on port 3000.');
});