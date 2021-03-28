const express = require("express");
const app = express();
const ejsMate = require("ejs-mate");

app.engine('ejs', ejsMate);
app.set("view engine", "ejs");

app.get("/", (req, res) => {
    res.render("home");
});

app.get("/badges", (req, res) => {
    res.render("badges/badges");
});

app.get("/rules", (req, res) => {
    res.render("rules/rules");
});

app.get("/login", (req, res) => {
    res.render("log-reg/login");
});

app.get("/register", (req, res) => {
    res.render("log-reg/register");
});

app.listen(3000);