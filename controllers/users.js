const User = require("../models/user");
module.exports.renderSignupForm = (req,res)=>{
    res.render("users/signup.ejs");
}
module.exports.signup = async (req,res)=>{
    try{
        let { username, email, password } = req.body;
        //password validation
        if (!password || password.length < 8) {
           req.flash("error", "Password must be at least 8 characters long.");
           return res.redirect("/signup");
        }

        const newUser = new User({
            email,
            username,
        });

        const registeredUser = await User.register(newUser,password);
        console.log(registeredUser);
        req.login(registeredUser, (err) =>{
            if(err){
                return next(err);
            }
            req.flash("success","Welcome to WanderStay!");
            res.redirect("/listings");
        });
        
    }catch(e){
        req.flash("error", e.message);
        res.redirect("/signup");
    }
    
}
module.exports.renderLoginForm = (req,res) =>{
    res.render("users/login.ejs");
}

//changes
// Show admin signup form
module.exports.renderAdminSignupForm = (req, res) => {
    res.render("admins/adminsignup.ejs");
};





module.exports.login = async (req,res) =>{
    req.flash("success", "Welcome back to WanderStay!");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
} 

module.exports.logout = (req,res)=>{
    req.logout((err) =>{
        if(err){
           return next(err);
        }
        req.flash("success", "You are logged out now!");
        res.redirect("/listings");
    })
}

// Handle admin signup
module.exports.adminSignup = async (req, res) => {
    try {
        let { username, email, password } = req.body;
        //Server-side password validation
        if (!password || password.length < 8) {
            req.flash("error", "Password must be at least 8 characters long.");
            return res.redirect("/adminsignup");
        }
        const newAdmin = new User({
            email,
            username,
            role: "admin"   //  important!
        });

        const registeredAdmin = await User.register(newAdmin, password);
        console.log("Admin registered:", registeredAdmin);

        req.login(registeredAdmin, (err) => {
            if (err) {
                return next(err);
            }
            req.flash("success", "Welcome Admin!");
            res.redirect("/listings"); //  send admins somewhere else
        });

    } catch (e) {
        req.flash("error", e.message);
        res.redirect("/adminsignup");
    }
};
