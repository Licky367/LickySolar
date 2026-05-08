module.exports = (req,res,next)=>{

    if(req.session.user.role !== "super_admin"){

        req.flash("error","Super admin access only");

        return res.redirect("/admin");
    }

    next();
};