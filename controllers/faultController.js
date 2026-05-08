const faultService =
require("../services/faultService");

exports.clientFaultsPage = async(req,res)=>{

    const faults =
    await faultService.getClientFaults(
        req.session.user._id
    );

    res.render("client/faults",{

        title:"Fault Logs",

        faults
    });
};

exports.resolveFault = async(req,res)=>{

    await faultService.resolveFault(
        req.params.id
    );

    req.flash(
        "success",
        "Fault resolved"
    );

    res.redirect("/admin");
};