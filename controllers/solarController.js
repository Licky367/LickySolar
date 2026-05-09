const solarService =
require("../services/solarService");

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
        await solarService.createReading({
            clientId: device.clientId,
            voltage,
            current,
            temperature
        });

        res.json({
            success:true
        });

    }catch(error){

        console.error("Solar API Error:", error);

        res.status(500).json({
            error:error.message
        });
    }
};



// =========================
// CLIENT SOLAR PAGE
// =========================

exports.clientSolarPage = async(req,res)=>{

    try{

        const clientId = req.session.user._id;

        const readings =
        await solarService.getHistoryByClient(clientId);

        const latest =
        await solarService.getLatestByClient(clientId);

        // Stats (move logic out of EJS)
        const activeCount =
        readings.filter(r => r.status === "active").length;

        const lowCount =
        readings.filter(r => r.status === "low").length;

        const faultCount =
        readings.filter(r => r.status === "fault").length;

        res.render("client/solar",{

            title:"Solar Monitoring",

            readings,

            latest,

            stats:{
                active: activeCount,
                low: lowCount,
                fault: faultCount,
                total: readings.length
            }
        });

    }catch(error){

        console.error("Solar Page Error:", error);

        req.flash("error","Unable to load solar data");

        res.redirect("/");
    }
};