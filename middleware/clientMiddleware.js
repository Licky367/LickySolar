module.exports = (req,res,next)=>{

    if(req.session.user.role !== "client"){

        req.flash("error","Client access only");

        return res.redirect("/admin");
    }

    next();
};