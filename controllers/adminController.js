const adminService =
require("../services/adminService");

const dashboardService =
require("../services/dashboardService");


// =========================
// CLIENTS LIST PAGE
// =========================

exports.clientsPage = async(req,res)=>{

    try{

        const clients =
        await adminService.getClients();

        res.render("admin/clients",{

            title:"Clients",

            clients
        });

    }catch(error){

        req.flash("error", error.message);

        res.redirect("/admin");
    }
};



// =========================
// CLIENT DETAILS PAGE
// =========================

exports.clientDetailsPage = async(
    req,
    res
)=>{

    try{

        const { id } = req.params;

        // Get client + device
        const {
            client,
            device
        } =
        await adminService.getClientWithDevice(id);

        if(!client){

            req.flash("error","Client not found");

            return res.redirect("/admin/clients");
        }

        // Get dashboard data
        const dashboard =
        await dashboardService.getClientDashboard(id);

        res.render("admin/client-details",{

            title:"Client Details",

            client,

            device,

            dashboard
        });

    }catch(error){

        req.flash("error", error.message);

        res.redirect("/admin/clients");
    }
};



// =========================
// ADMINS PAGE
// =========================

exports.adminsPage = async(req,res)=>{

    try{

        const admins =
        await adminService.getAdmins();

        res.render("admin/admins",{

            title:"Admins",

            admins
        });

    }catch(error){

        req.flash("error", error.message);

        res.redirect("/admin");
    }
};



// =========================
// INVITE ADMIN PAGE
// =========================

exports.getInvitePage = (req,res)=>{

    res.render("admin/invite-admin",{

        title:"Invite Admin"
    });
};



// =========================
// INVITE ADMIN ACTION
// =========================

exports.inviteAdmin = async(req,res)=>{

    try{

        await adminService.inviteAdmin({

            email:req.body.email,

            invitedBy:req.session.user._id
        });

        req.flash(
            "success",
            "Admin invited successfully"
        );

        res.redirect("/admin/admins");

    }catch(error){

        req.flash("error", error.message);

        res.redirect("/admin/invite-admin");
    }
};



// =========================
// DEVICES PAGE
// =========================

exports.devicesPage = async(req,res)=>{

    try{

        const devices =
        await adminService.getAllDevices();

        res.render("admin/devices",{

            title:"Devices",

            devices
        });

    }catch(error){

        req.flash("error", error.message);

        res.redirect("/admin");
    }
};



// =========================
// ASSIGN DEVICE PAGE
// =========================

exports.assignDevicePage = async(req,res)=>{

    try{

        const devices =
        await adminService.getUnassignedDevices();

        const clients =
        await adminService.getClients();

        res.render("admin/assign-device",{

            title:"Assign Device",

            devices,

            clients
        });

    }catch(error){

        req.flash("error", error.message);

        res.redirect("/admin/devices");
    }
};



// =========================
// ASSIGN DEVICE ACTION
// =========================

exports.assignDevice = async(req,res)=>{

    try{

        const {
            deviceId,
            clientId
        } = req.body;

        await adminService.assignDeviceToClient(
            deviceId,
            clientId
        );

        req.flash(
            "success",
            "Device assigned successfully"
        );

        res.redirect("/admin/devices");

    }catch(error){

        req.flash("error", error.message);

        res.redirect("/admin/devices/assign");
    }
};