module.exports = (req,res,next)=>{

    if(
        req.session.user.role !== "admin" &&
        req.session.user.role !== "super_admin"
    ){

        req.flash("error","Unauthorized");

        return res.redirect("/");
    }

    next();
};