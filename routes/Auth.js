// const express = require("express");

const { Router } = require('express');

const authcontrollers = require('../controllers/authcontrollers')
const { checkUser, requireAuth  } = require("../middlewares/authmiddlewares");
const Auth = Router();

Auth.get("/register", authcontrollers.register_get)

Auth.post("/register", authcontrollers.register_post)

Auth.get("/login", authcontrollers.Login_get);

Auth.post("/login", authcontrollers.Login_post);

Auth.get("/dashboard", checkUser, requireAuth, authcontrollers.admin_dashboard);

Auth.get("/logout", authcontrollers.logOut);



module.exports =  Auth;