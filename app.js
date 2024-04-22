const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
require('dotenv').config();
const session = require("express-session");
const LocalStrategy = require("passport-local").Strategy;
const passport = require("passport");
const Schema = mongoose.Schema;
const path = require("path");
const { error } = require("console");
const Auth = require("./Modules/Auth");
const Blog = require("./Modules/Blog");
const { connect } = require("http2");

const mogoDb = process.env.MONGODB_URL
mongoose.connect(mogoDb).then(console.log("connected to database"));
const db = mongoose.connection;
db.on("error", console.error.bind(console, "mongo connection error"));

const app = express();
const PORT = 8000;
app.set("views engine", "ejs");
app.use(express.static("public"));
app.use(express.static("node_modules"));
app.use(bodyParser.urlencoded({extended: true}))

app.use(express.urlencoded({ extended: false }));





app.get("/", (req, res) => {
    res.render("Home.ejs")
})

app.use("/", Auth);

app.use("/", Blog)

app.get("/blog", (req, res) => {
    res.render("BlogCards.ejs")
})


app.listen(PORT, () => {
    console.log("app runing on port 8000")
})