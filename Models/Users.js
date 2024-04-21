const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const BlogUser = mongoose.model(
    "BlogUser",
    new Schema({
        FirstName: String,
        LastName: String,
        Email: String,
        Password: String,
        ConfirmPassword: String,
    })
)

module.exports = BlogUser;