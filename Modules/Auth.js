const express = require("express");
const Auth = express.Router();
const BlogUser = require("../Models/Users");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs")
require('dotenv').config();
const jwtStrategy = require('passport-jwt').Strategy;
const session = require("express-session")


Auth.get("/register", (req, res) => {
    res.render("SignUp.ejs")
})


Auth.post("/register", async(req, res) => {
const hashedPassword = await bcrypt.hash(req.body.Password, 10);
 const hashedConfirmPassword = await bcrypt.hash(req.body.ConfirmPassword, 10)

try{
    const user = new BlogUser({
        FirstName: req.body.FirstName,
        LastName: req.body.LastName,
        Email:  req.body.Email,
        Password: hashedPassword,
        ConfirmPassword: hashedConfirmPassword
    });
    if ( req.body.ConfirmPassword !== req.body.Password) {
        return res.status(400).send('Passwords do not match');
      }

    await user.save();
    console.log(user);
    res.status(200).redirect("/login")
}catch(err) {
    res.status(400).send(err.message)
}
})


Auth.get("/login", (req, res) => {
    res.render("Login.ejs")
})

Auth.post("/login", async (req, res, next) => {
try {
    const {Email, Password} = req.body;

    const user = await BlogUser.findOne({Email: { $regex: new RegExp("^" + Email.toLowerCase(), "i") }});
    if(!user) {
        return res.status(401).json({message: "incorrect password or email"})
    }
    const IsPassword = await bcrypt.compare(Password, user.Password);
    if(!IsPassword) {
        return res.status(401).json({message: "incorrect password or email"})
    }

    const token = jwt.sign({userId: user.id, Email: user.Email, FirstName: user.FirstName}, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.set('Authorization', `Bearer ${token}`).render("UserDashBoard.ejs", {FirstName: user.FirstName, token} );
}  catch(err) {
    res.status(500).send(err.message)
}
});


Auth.get("/logOut", (req, res, next) => {
    res.clearCookie(process.env.JWT_SECRET).redirect("/")
})



module.exports =  Auth;