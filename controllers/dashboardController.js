const dashboardService =
require("../services/dashboardService");

exports.clientDashboard = async(req,res)=>{

    try{

        const data =
        await dashboardService.getClientDashboard(
            req.session.user._id
        );

        res.render("client/dashboard",{

            title:"Dashboard",

            data
        });

    }catch(error){

        console.log(error);

        res.redirect("/");
    }
};

exports.adminDashboard = async(req,res)=>{

    try{

        const data =
        await dashboardService.getAdminDashboard();

        res.render("admin/dashboard",{

            title:"Admin Dashboard",

            data
        });

    }catch(error){

        console.log(error);

        res.redirect("/admin");
    }
};