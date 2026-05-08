const gridService =
require("../services/gridService");

exports.createReading = async(req,res)=>{

    try{

        await gridService.createReading(
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