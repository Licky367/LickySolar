const sourceService =
require("../services/sourceService");


// =========================
// SOURCE PAGE
// =========================

exports.sourcePage = async(req,res)=>{

    try{

        const clientId =
        req.session.user._id;

        const filter =
        req.query.source || null;

        const currentSource =
        await sourceService.getCurrentSource(
            clientId
        );

        const transitions =
        await sourceService.getTransitions(
            clientId,
            filter
        );

        res.render("client/source",{

            title:"Power Source Monitoring",

            currentSource,

            transitions,

            filter
        });

    }catch(error){

        console.error(error);

        req.flash("error","Unable to load source data");

        res.redirect("/");
    }
};