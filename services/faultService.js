const FaultLog = require("../models/FaultLog");

exports.createFault = async(data)=>{

    return await FaultLog.create(data);
};

exports.getClientFaults = async(clientId)=>{

    return await FaultLog
    .find({ clientId })
    .sort({ createdAt:-1 });
};

exports.getPendingFaults = async()=>{

    return await FaultLog.find({
        resolved:false
    });
};

exports.resolveFault = async(id)=>{

    return await FaultLog.findByIdAndUpdate(
        id,
        {
            resolved:true,
            resolvedAt:new Date()
        },
        { new:true }
    );
};