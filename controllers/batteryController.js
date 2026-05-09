const batteryService =
require("../services/batteryService");

const DeviceStatus =
require("../modules/DeviceStatus");


// =========================
// CREATE READING (DEVICE API)
// =========================

exports.createReading = async(req,res)=>{

    try{

        const {
            deviceId,
            apiKey,
            voltage,
            current,
            percentage,
            charging,
            temperature
        } = req.body;

        // Validate device
        const device =
        await DeviceStatus.findOne({
            deviceId,
            apiKey
        });

        if(!device){

            return res.status(401).json({
                error:"Invalid device credentials"
            });
        }

        // Save reading
        await batteryService.createReading({

            clientId: device.clientId,

            voltage,
            current,
            percentage,
            charging,
            temperature
        });

        res.json({
            success:true
        });

    }catch(error){

        console.error("Battery API Error:", error);

        res.status(500).json({
            error:error.message
        });
    }
};



// =========================
// CLIENT BATTERY PAGE
// =========================

exports.clientBatteryPage = async(req,res)=>{

    try{

        const clientId = req.session.user._id;

        const readings =
        await batteryService.getHistoryByClient(
            clientId
        );

        const latest =
        await batteryService.getLatestByClient(
            clientId
        );

        // Stats (move logic out of EJS)
        const chargingCount =
        readings.filter(r => r.status === "charging").length;

        const dischargingCount =
        readings.filter(r => r.status === "discharging").length;

        const idleCount =
        readings.filter(r => r.status === "idle").length;

        const faultCount =
        readings.filter(r => r.status === "fault").length;

        res.render("client/battery",{

            title:"Battery Monitoring",

            readings,

            latest,

            stats:{
                charging: chargingCount,
                discharging: dischargingCount,
                idle: idleCount,
                fault: faultCount,
                total: readings.length
            }
        });

    }catch(error){

        console.error("Battery Page Error:", error);

        req.flash("error","Unable to load battery data");

        res.redirect("/");
    }
};