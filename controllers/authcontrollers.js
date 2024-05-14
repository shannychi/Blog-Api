const BlogUser = require("../Models/Users");
const jwt = require("jsonwebtoken");
const createdBlog = require("../Models/BlogPost");
require('dotenv').config();


const handleError = (err) => {
    console.log(err.message, err.code);
    let error = { FirstName: "", LastName: "", Email: "", Password: "",};

//incorrect email
if(err.message === "incorrect email"){
    error.Email = "Email is not registered";
}

//incorrect password
if(err.message === "incorrect Password"){
    error.Password = "incorrect password";
}

    //duplicate error code 
    if(err.code === 11000){
        error.Email = "this email already exist";
        return error;
    }
    //validation error 
    if(err.message.includes("BlogUser validation failed")) {
        Object.values(err.errors).forEach(({ properties }) => {
            error[properties.path] = properties.message;
        });
    }

    return error;
}

const maxAge = 3 * 24 * 60 * 60;


const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: maxAge
    });
}

module.exports.register_get = (req, res) => {
    res.render('SignUp.ejs');
}

module.exports.Login_get = (req, res) => {
    res.render('Login.ejs');
}

module.exports.register_post = async(req, res) => {
    // const hashedPassword = await bcrypt.hash(req.body.Password, 10);
    //  const hashedConfirmPassword = await bcrypt.hash(req.body.ConfirmPassword, 10)
    
    const { FirstName, LastName, Email, Password, ConfirmPassword } = req.body;
    try{
        const user = await BlogUser.create({
            FirstName,
            LastName,
            Email,
            Password,
            ConfirmPassword
        });
        // if ( req.body.ConfirmPassword !== req.body.Password) {
        //     return res.status(400);
        //   }
        
          const token = createToken(user._id);
          res.cookie('jwt', token, {
            httpOnly: true, maxAge: maxAge * 1000
          })
        res.status(200).json({ user: user._id });

    } 
    catch(err) {
       const error =  handleError(err);
        res.status(400).json({ error });
    }
    } 

module.exports.Login_post = async (req, res) => {
   const { Email, Password } = req.body;

   try{
    const user = await BlogUser.login( Email, Password );

    const token = createToken(user._id);
          res.cookie('jwt', token, {
            httpOnly: true, maxAge: maxAge * 1000
          })

    res.status(200).json({ user: user._id })
   }
   catch(err){
    const error = handleError(err);
      res.status(400).json({ error })
   }
    }

    module.exports.admin_dashboard = async(req, res) => {
        try {
            
            const totalPosts = await createdBlog.countDocuments({userId: req.user.id})

            res.render("UserDashboard.ejs", {currentUser: req.user, totalPosts} )
        }
        catch(err) {
          console.log('error getting user dashboard:', err)
        }
    }


module.exports.logOut = (req, res, next) => {
    res.cookie('jwt', "", {maxAge: 1}).redirect("/");
}