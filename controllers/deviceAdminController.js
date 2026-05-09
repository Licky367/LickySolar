const deviceService = require("../services/deviceService");
const adminService = require("../services/adminService");


// =========================
// DEVICES LIST
// =========================

exports.devicesPage = async(req,res)=>{

    const devices =
    await deviceService.getAllDevices();

    res.render("admin/devices",{

        title:"Devices",

        devices
    });
};


// =========================
// CREATE DEVICE PAGE
// =========================

exports.getCreateDevicePage = (req,res)=>{

    res.render("admin/create-device",{

        title:"Register Device"
    });
};


// =========================
// CREATE DEVICE
// =========================

exports.createDevice = async(req,res)=>{

    try{

        const device =
        await deviceService.createDevice(
            req.body
        );

        req.flash(
            "success",
            "Device created successfully"
        );

        res.redirect("/admin/devices");

    }catch(error){

        req.flash("error", error.message);

        res.redirect("/admin/devices/create");
    }
};


// =========================
// ASSIGN DEVICE PAGE
// =========================

exports.getAssignPage = async(req,res)=>{

    const devices =
    await deviceService.getUnassignedDevices();

    const clients =
    await adminService.getClients();

    res.render("admin/assign-device",{

        title:"Assign Device",

        devices,

        clients
    });
};


// =========================
// ASSIGN DEVICE
// =========================

exports.assignDevice = async(req,res)=>{

    try{

        await deviceService.assignDevice(

            req.body.deviceId,

            req.body.clientId
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