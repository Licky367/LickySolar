const solarService =
require("../services/solarService");

exports.createReading = async(req,res)=>{

    try{

        await solarService.createReading(
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

exports.clientSolarPage = async(req,res)=>{

    const readings =
    await solarService.getHistoryByClient(
        req.session.user._id
    );

    res.render("client/solar",{

        title:"Solar Monitoring",

        readings
    });
};