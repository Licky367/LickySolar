const dashboardService =
require("../services/dashboardService");

const adminService =
require("../services/adminService");


// =========================
// CLIENT DASHBOARD
// =========================

exports.clientDashboard = async(req,res)=>{

    try{

        const clientId = req.session.user._id;

        // Dashboard data (readings, analytics, etc.)
        const dashboard =
        await dashboardService.getClientDashboard(
            clientId
        );

        // Device info (VERY IMPORTANT)
        const {
            device
        } =
        await adminService.getClientWithDevice(
            clientId
        );

        res.render("client/dashboard",{

            title:"Dashboard",

            dashboard,

            device
        });

    }catch(error){

        console.log("Client Dashboard Error:", error);

        req.flash("error","Unable to load dashboard");

        res.redirect("/");
    }
};



// =========================
// ADMIN DASHBOARD
// =========================

exports.adminDashboard = async(req,res)=>{

    try{

        const dashboard =
        await dashboardService.getAdminDashboard();

        // Optional: show devices overview
        const devices =
        await adminService.getAllDevices();

        res.render("admin/dashboard",{

            title:"Admin Dashboard",

            dashboard,

            devices
        });

    }catch(error){

        console.log("Admin Dashboard Error:", error);

        req.flash("error","Unable to load admin dashboard");

        res.redirect("/admin");
    }
};