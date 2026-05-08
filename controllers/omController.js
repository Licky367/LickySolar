const omService =
require("../services/omService");

exports.getRequestPage = (req,res)=>{

    res.render("client/request-om",{

        title:"Request O&M"
    });
};

exports.createRequest = async(req,res)=>{

    try{

        await omService.createRequest({

            clientId:req.session.user._id,

            title:req.body.title,

            description:req.body.description
        });

        req.flash(
            "success",
            "O&M request submitted"
        );

        res.redirect("/om/history");

    }catch(error){

        req.flash("error", error.message);

        res.redirect("/om/request");
    }
};

exports.clientRequestHistory = async(
    req,
    res
)=>{

    const requests =
    await omService.getClientRequests(
        req.session.user._id
    );

    res.render("client/om-history",{

        title:"O&M History",

        requests
    });
};

exports.adminRequestsPage = async(
    req,
    res
)=>{

    const requests =
    await omService.getAllRequests();

    res.render("admin/om-requests",{

        title:"O&M Requests",

        requests
    });
};

exports.updateRequest = async(
    req,
    res
)=>{

    await omService.updateRequestStatus(

        req.params.id,

        {
            status:req.body.status,

            adminResponse:req.body.adminResponse,

            handledBy:req.session.user._id
        }
    );

    req.flash(
        "success",
        "Request updated"
    );

    res.redirect("/admin/om");
};