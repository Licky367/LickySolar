const adminService = require("../services/adminService");
const dashboardService = require("../services/dashboardService");


// =========================
// CLIENTS LIST PAGE
// =========================
exports.clientsPage = async (req, res) => {
    try {
        const clients = await adminService.getClients();

        res.render("admin/clients", {
            title: "Clients",
            clients
        });

    } catch (error) {
        req.flash("error", error.message);
        res.redirect("/admin");
    }
};


// =========================
// CLIENT DETAILS PAGE
// =========================
exports.clientDetailsPage = async (req, res) => {
    try {
        const { id } = req.params;

        const { client, device } =
            await adminService.getClientWithDevice(id);

        if (!client) {
            req.flash("error", "Client not found");
            return res.redirect("/admin/clients");
        }

        const dashboard =
            await dashboardService.getClientDashboard(id);

        res.render("admin/client-details", {
            title: "Client Details",
            client,
            device,
            dashboard
        });

    } catch (error) {
        req.flash("error", error.message);
        res.redirect("/admin/clients");
    }
};


// =========================
// ADMINS PAGE
// =========================
exports.adminsPage = async (req, res) => {
    try {
        const admins = await adminService.getAdmins();

        res.render("admin/admins", {
            title: "Admins",
            admins
        });

    } catch (error) {
        req.flash("error", error.message);
        res.redirect("/admin");
    }
};


// =========================
// INVITE ADMIN PAGE
// =========================
exports.getInvitePage = (req, res) => {
    res.render("admin/invite-admin", {
        title: "Invite Admin"
    });
};


// =========================
// INVITE ADMIN ACTION
// =========================
exports.inviteAdmin = async (req, res) => {
    try {
        await adminService.inviteAdmin({
            email: req.body.email,
            invitedBy: req.session.user._id
        });

        req.flash("success", "Admin invited successfully");

        res.redirect("/admin/admins");

    } catch (error) {
        req.flash("error", error.message);
        res.redirect("/admin/invite-admin");
    }
};


// =========================
// DEVICES LIST PAGE
// =========================
exports.devicesPage = async (req, res) => {
    try {
        const devices =
            await adminService.getAllDevices();

        const deviceCredentials =
            req.flash("deviceCredentials")[0];

        res.render("admin/devices", {
            title: "Devices",
            devices,
            deviceCredentials
        });

    } catch (error) {
        req.flash("error", error.message);
        res.redirect("/admin");
    }
};


// =========================
// DEVICE CONFIG PAGE (NEW)
// =========================
exports.getDeviceConfigPage = (req, res) => {
    res.render("admin/device-config", {
        title: "Configure Device"
    });
};


// =========================
// CREATE DEVICE (CONFIG FLOW)
// =========================
exports.createDevice = async (req, res) => {
    try {

        let { deviceId, name, location, macAddress } = req.body;

        // Normalize MAC address if provided
        if (macAddress) {
            macAddress = macAddress.trim().toUpperCase();
        }

        const device =
            await adminService.createDevice({
                deviceId,
                name,
                location,
                macAddress
            });

        // 🔥 Show credentials once after creation
        req.flash("deviceCredentials", {
            deviceId: device.deviceId,
            apiKey: device.apiKey,
            macAddress: device.macAddress || null
        });

        req.flash("success", "Device created successfully");

        res.redirect("/admin/devices");

    } catch (error) {
        req.flash("error", error.message);
        res.redirect("/admin/devices/config");
    }
};


// =========================
// ASSIGN DEVICE PAGE
// =========================
exports.assignDevicePage = async (req, res) => {
    try {
        res.render("admin/assign-device", {
            title: "Assign Device"
        });

    } catch (error) {
        req.flash("error", error.message);
        res.redirect("/admin/devices");
    }
};


// =========================
// ASSIGN DEVICE (MAC + EMAIL)
// =========================
exports.assignDevice = async (req, res) => {
    try {

        let { macAddress, email } = req.body;

        // Normalize MAC
        if (macAddress) {
            macAddress = macAddress.trim().toUpperCase();
        }

        await adminService.assignDeviceByMacAndEmail(
            macAddress,
            email
        );

        req.flash("success", "Device assigned successfully");

        res.redirect("/admin/devices");

    } catch (error) {
        req.flash("error", error.message);
        res.redirect("/admin/devices/assign");
    }
};


// =========================
// UNASSIGN DEVICE
// =========================
exports.unassignDevice = async (req, res) => {
    try {

        const { deviceId } = req.body;

        await adminService.unassignDevice(deviceId);

        req.flash("success", "Device unassigned successfully");

        res.redirect("/admin/devices");

    } catch (error) {
        req.flash("error", error.message);
        res.redirect("/admin/devices");
    }
};