const batteryService =
require("../services/batteryService");

exports.createReading = async(req,res)=>{

    try{

        await batteryService.createReading(
            req.body
        );

        res.json({
            success:true
        });

    }catch(error){

        res.status(500).json({
            error:error.message
        });
    }
};

exports.clientBatteryPage = async(req,res)=>{

    const readings =
    await batteryService.getHistoryByClient(
        req.session.user._id
    );

    res.render("client/battery",{

        title:"Battery Monitoring",

        readings
    });
};