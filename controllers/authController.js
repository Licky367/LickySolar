const authService = require("../services/authService");

exports.getLogin = (req,res)=>{

    res.render("auth/login",{
        title:"Login"
    });
};

exports.getSignup = (req,res)=>{

    res.render("auth/signup",{
        title:"Signup"
    });
};

exports.signup = async(req,res)=>{

    try{

        const user =
        await authService.signup(req.body);

        req.session.user = {

            _id:user._id,

            name:user.name,

            email:user.email,

            role:user.role
        };

        req.flash(
            "success",
            "Signup successful"
        );

        if(user.role === "client"){

            return res.redirect("/");
        }

        return res.redirect("/admin");

    }catch(error){

        req.flash("error", error.message);

        res.redirect("/signup");
    }
};

exports.login = async(req,res)=>{

    try{

        const user =
        await authService.login(
            req.body.email,
            req.body.password
        );

        req.session.user = {

            _id:user._id,

            name:user.name,

            email:user.email,

            role:user.role
        };

        req.flash(
            "success",
            "Login successful"
        );

        if(user.role === "client"){

            return res.redirect("/");
        }

        return res.redirect("/admin");

    }catch(error){

        req.flash("error", error.message);

        res.redirect("/login");
    }
};

exports.logout = (req,res)=>{

    req.session.destroy(()=>{

        res.redirect("/login");
    });
};