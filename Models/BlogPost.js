const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const createdBlog= mongoose.model(
    "createdBlog",
    new Schema({
        title: {type: String, required:true},
        content: {type: String, required:true},
        status: {type: String, enum: ['draft', 'published'], default: 'draft'},
        author: {type: mongoose.Schema.Types.ObjectId, ref: 'BlogUser'}
        
    }, {timestamps: true})
)

module.exports = createdBlog;