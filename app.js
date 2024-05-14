const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
require('dotenv').config();
const Auth = require("./routes/Auth");
const Blog = require("./routes/Blog");
const cookieParser = require("cookie-parser");


const app = express();
const methodOverride = require("method-override");
//middleware
app.use(cookieParser());
app.use(express.static("public"));
app.use(express.static("node_modules"));
app.use(bodyParser.urlencoded({extended: false}))
app.use(express.urlencoded({ extended: true}));
app.use(express.json());
app.use(methodOverride('_method'))

// view engine
app.set("views engine", "ejs");


//database connection
const mogoDb = process.env.MONGODB_URL
mongoose.connect(mogoDb).then(console.log("connected to database"));
const db = mongoose.connection;
db.on("error", console.error.bind(console, "mongo connection error"));

const PORT = 8000;

app.listen(PORT, () => {
    console.log("app runing on port 8000")
})

//routes
app.get("/", (req, res) => {
    res.render("Home.ejs")
})

app.use(Auth);
app.use("/", Blog)

app.get("/blog", (req, res) => {
    res.render("BlogCards.ejs")
})

