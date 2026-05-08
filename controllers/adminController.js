const adminService =
require("../services/adminService");

const dashboardService =
require("../services/dashboardService");

exports.clientsPage = async(req,res)=>{

    const clients =
    await adminService.getClients();

    res.render("admin/clients",{

        title:"Clients",

        clients
    });
};

exports.clientDetailsPage = async(
    req,
    res
)=>{

    const client =
    await adminService.getClientById(
        req.params.id
    );

    const dashboard =
    await dashboardService.getClientDashboard(
        req.params.id
    );

    res.render("admin/client-details",{

        title:"Client Details",

        client,

        dashboard
    });
};

exports.adminsPage = async(req,res)=>{

    const admins =
    await adminService.getAdmins();

    res.render("admin/admins",{

        title:"Admins",

        admins
    });
};

exports.getInvitePage = (req,res)=>{

    res.render("admin/invite-admin",{

        title:"Invite Admin"
    });
};

exports.inviteAdmin = async(req,res)=>{

    try{

        await adminService.inviteAdmin({

            email:req.body.email,

            invitedBy:req.session.user._id
        });

        req.flash(
            "success",
            "Admin invited"
        );

        res.redirect("/admin/admins");

    }catch(error){

        req.flash("error", error.message);

        res.redirect("/admin/invite-admin");
    }
};