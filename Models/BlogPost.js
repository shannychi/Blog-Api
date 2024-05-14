const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const createdBlog= mongoose.model(
    "createdBlog",
    new Schema({
        title: {type: String, required:true},
        // tags: {type: String, required:true},
        content: {type: String, required:true},
        status: {type: String, enum: ['draft', 'published'], default: 'draft'},
        userId: {
            type: mongoose.Schema.Types.ObjectId, ref: 'BlogUser', required: true
          },
        // read_count:  {type: String, required:true},
        // reading_time: {type: String, required:true},
        body: {type: String, require:true},
        author: {
          FirstName: String,
          LastName: String
        },
        image: {
          type: String
        },
        createdAt:{
          type: Date,
          default: Date.now
        },
           updatedAt:{
            type: Date,
            default: Date.now
          }
        
    }, {timestamps: true})
)

module.exports = createdBlog;