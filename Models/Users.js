const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const {isEmail, isEmpty}  = require('validator');
const bcrypt = require('bcryptjs')


const BlogUser =  new  Schema({
        FirstName:{
            type: String,
            require: [true, "please enter your First Name"],
        },
        LastName: {
            type: String,
            require: [true, "please enter your Last Name"],
        },
        Email: {
            type: String,
            required:[true, "please enter an email"],
            unique: true,
            lowercase: true,
            validate: [isEmail, "please enter a vaild email"]
        },
        Password: {
            type: String,
            required: [true, "please enter a password"],
            minlength: [8, "minimum password length is 8 characters" ]
        }
        // ConfirmPassword: {
        //     type: String,
        //     required: [true, "please Re-enter your password"]
        // }
    })
;

BlogUser.pre('save', async function(next) {
    const salt = await bcrypt.genSalt();
    this.Password = await bcrypt.hash(this.Password, salt);
    next();
})

// BlogUser.pre('save', async function(next) {
//     const salt = await bcrypt.genSalt();
//     this.ConfirmPassword = await bcrypt.hash(this.ConfirmPassword, salt);
//     next();
// })

//static method to login user 
BlogUser.statics.login = async function (Email, Password) {
    const user = await this.findOne({ Email });
    if(user) {
      const auth = await bcrypt.compare(Password, user.Password);
      if(auth) {
        return user
      }
      throw Error('incorrect Password');
    }
    throw Error('incorrect email');
}

const BlogSchema = mongoose.model("BlogUser", BlogUser );

module.exports = BlogSchema;