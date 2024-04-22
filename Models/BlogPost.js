const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const createdBlog= mongoose.model(
    "createdBlog",
    new Schema({
        title: {type: String, required:true},
        tags: {type: String, required:true},
        content: {type: String, required:true},
        status: {type: String, enum: ['draft', 'published'], default: 'draft'},
        author: {type: mongoose.Schema.Types.ObjectId, ref: 'BlogUser'},
        read_count:  {type: String, required:true},
        reading_time: {type: String, required:true},
        body: {type: String, required:true}
        
    }, {timestamps: true})
)

module.exports = createdBlog;