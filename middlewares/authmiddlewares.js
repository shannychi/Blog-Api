const jwt = require("jsonwebtoken");
require('dotenv').config();
const BlogUser = require("../Models/Users");

const requireAuth = (req, res, next) => {
    const token = req.cookies.jwt;
//check json web token exist
    if(token) {
  jwt.verify(token, process.env.JWT_SECRET, async(err, decodedToken) => {
    if(err) {
        console.log(err.message);
        res.redirect('/login')
    } else {
      // let user = await BlogUser.findById(decodedToken.id);
      //     req.user = user;
        console.log(decodedToken);
        next();
    }
  });
    }
    else {
        res. redirect("/login");
}
}

//check current user
const checkUser = (req, res, next) => {
    const token = req.cookies.jwt;
    if (token) {
      jwt.verify(token, process.env.JWT_SECRET, async (err, decodedToken) => {
        if (err) {
          req.user = null;
          next();
        } else {
          let user = await BlogUser.findById(decodedToken.id);
          req.user = user;
          console.log(user);
          next();
        }
      });
    } else {
      req.user = null;
      next();
    }
  };
module.exports = { checkUser, requireAuth}